import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from "cors"
import bcrypt from "bcrypt";
import session from "express-session"
import AWS from "aws-sdk";
import multer from "multer";
import {ObjectId} from 'mongodb'

const app=express();
const upload = multer();
const s3=new AWS.S3();

dotenv.config();
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})


const port =process.env.Port||5000;
const database_url=process.env.DATABASE_URL;
const sessionSecret=process.env.SESSION_SECRET

app.use(cors())
app.use(express.json());
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));



mongoose.connect(database_url,{useNewUrlParser:true})
.then(()=>{
    console.log("mongodb connected")
})
.catch((error)=>{
    console.log("error",error);
});

const registerSchema=mongoose.Schema({
    name:{type:String,required:[true]},
    email:{type:String,required:[true]},
    password:{type:String,required:[true,'password is required']},
    phoneNumber:{type:Number,required:[true]},
    dob:{type:Date,required:[true]}
})

const RegisteredUser=new mongoose.model('RegisteredUser',registerSchema)

const ImageSchema=mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    imageUrl:{type:String,required:true},
    viewCount:{type:Number,default:0},
    s3Key:{type:String,required:true}
})

const ImageModel=new mongoose.model('ImageModel',ImageSchema);



app.post('/register',async(req,res)=>{
    const {submitData}=req.body;
    console.log("sreq.data",req.body)
    const saltRound=10;
    try{
        const hashedPassword=await bcrypt.hash(submitData.password,saltRound);
        submitData.password=hashedPassword;

        const newUser=new RegisteredUser(submitData);
        await newUser.save(submitData);

        console.log()
        res.status(200).json("Registration Successfull")
    }
    catch(error){
        console.log(error)
    }
})

app.post('/LogIn',async(req,res)=>{
    console.log("req.body",req.body);
    const{email,password}=req.body;
    const caseInsensitiveEmail=email.toLowerCase();
    console.log("caseInsensitiveEmail",caseInsensitiveEmail)

    try{
        const foundUser=await RegisteredUser.findOne({email:caseInsensitiveEmail})
        console.log("found",foundUser)
        if(foundUser){
            const comparePassword=await bcrypt.compare(password,foundUser.password)
            console.log("comparePassword",comparePassword)
            if(comparePassword){
                console.log("user is authentic")
                req.session.user=foundUser
                console.log("req.session.user",req.session.user)
                res.status(200).json(req.session);
            }
            else{
                console.log("user is not authentic")
                res.status(401).json("Password mismatch")
            }
        }
        else{
            res.status(404).json("User not found")
        }
    }
    catch(error){
        console.log(error.message)
        res.status(500).json({message:"Internal server",error:error.message})
    }
})

// Middleware to check session
app.get('/checkSession', (req, res) => {
    console.log("check session",req.session.user)
    if (req.session.user) {
        console.log("authentic")
      res.json({ loggedIn: true });
    } else {
      res.json({ loggedIn: false });
    }
  });

app.post('/uploadImage',upload.single('file'),async(req,res)=>{
    const { title, description } = req.body;
    const file = req.file;
    console.log("file",file)

    const params = {
        Bucket: 'imagehubbucket',
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    try{
        const data=await s3.upload(params).promise();
        //Save image data to MongoDb
        const image=new ImageModel({
            title,
            description,
            imageUrl:data.Location,
            s3Key:file.originalname
        })
        try{
        await image.save();
        res.status(200).json("saved succesfully")
        }
        catch(error){
            console.log(error)
        }
    }
    catch(error){
        console.error("error uploading image or saving to MongoDb",error)
    }
    })

    app.get('/FetchImage',async(req,res)=>{
        console.log("/FetchImage")
        try{
            const images=await ImageModel.find();
            // console.log("images found",images);
            res.json(images)
        }
        catch(error){
            console.log(error)
        }
    })

// Increment view count route
app.put(`/incrementCount/:id/view`, async (req, res) => {
    const { id } = req.params;
    // const obId = new ObjectId(id);
    console.log("id=====",id);
    try {
        const obId = new ObjectId(id);
        const image = await ImageModel.findById(obId);
        if (!image) {
            console.log('Image not found for id:', id);
            return res.status(404).send('Image not found');
        }
        image.viewCount = (image.viewCount || 0) + 1;
        await image.save();
        console.log("image",image)
        res.json(image);
    } catch (error) {
        console.error('Error incrementing view count', error);
        res.status(500).send('Internal server error');
    }
});


app.listen({port},()=>{
    console.log("server is running on ",port)
})


