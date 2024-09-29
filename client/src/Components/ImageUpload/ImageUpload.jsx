import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../../state/slicer.js";
import Navbar from "../Navbar/Navbar.jsx";
import axios from "axios";
import "./ImageUpload.css"

export default function ImageUpload() {
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState();
  const [title, setTitle] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();
  const { ImageGallary, isSuccess } = useSelector((state) => state.images);

  const handleFileChange = (e) => {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (file && title && description) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("viewCount", viewCount);
      formData.append("description", description);
      console.log("formData", formData);
      try {
        const response = dispatch(uploadImage(formData));
        console.log("response", response);
        setFile(null);
        setTitle("");
        setDescription("");
        setImagePreview(null);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    } else {
      alert("enter all fields");
    }
  };

  // const uploadImage=async(formData)=>{
  //         try{
  //             const response=await axios.post('http://localhost:5000/uploadImage',formData)
  //             console.log("response",response);
  //             if(response.status===200)
  //             alert("Image uploaded successfully")
  //             // return (await response).data
  //             setFile(null);
  //             setTitle('');
  //             setDescription('');
  //             setImagePreview(null);
  //             return response;

  //         }
  //         catch(error){
  //             // return rejectWithValue(error.message)
  //             console.log(error)
  //         }
  //     }

  useEffect(() => {
    if (isSuccess) {
      setFile(null);
      setTitle("");
      setDescription("");
      setImagePreview(null);
     
    }
  }, [isSuccess, ImageGallary]);

  return (
    <>
      <Navbar showExtraLinks={true}/>
      <div className="container">
        <h2 className="heading">Upload Image</h2>
        <form className="form">
          <label className="label">
            Choose image
            <input
              type="file"
              onChange={(event) => handleFileChange(event)}
              required
              className="input"
            />
          </label>
          <label className="label">
            Title
            <input
              type="text"
              value={title}
              maxLength={15}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input"
            />
          </label>
          <label className="label">
            Description
            <input
              type="text"
              value={description}
              maxLength={250}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="input"
            />
          </label>
          {imagePreview && (
            <span style={{ marginTop: "10px" }}>Chosen Image</span>
          )}
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="imagePreview" />
          )}
          <div className="buttonContainer">
            <button
              className="button"
              onClick={(event) => {
                handleUploadImage(event);
              }}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
