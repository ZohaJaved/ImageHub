import React, { useState,useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./Register.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate=useNavigate()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const [dob, setDob] = useState();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [name,email, password,confirmPassword,phoneNumber,dob]);

  //function to handle input
  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
    if (name === "phoneNumber") setPhoneNumber(value);
    if (name === "dob") {
      setDob(value);
      validateDob(value);
    }
  };

  //function to validate dob
  const validateDob = (dob) => {
    const selectedDate = new Date(dob);
    const today = new Date();

    if (selectedDate > today) {
      alert("Date of birth cannot be in the future.");
      setDob("");
    }
  };

  //function to validate form
  const validateForm = () => {
    const newErrors = {};
    if (!name) {
      newErrors.name = "Name is required.";
    } else if (name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      newErrors.name = "Name can only contain letters and spaces.";
    }
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters long.";
    else if (!/\d/.test(password))
      newErrors.password = "Password must contain at least one number.";
    else if (!/[!@#$%^&*]/.test(password))
      newErrors.password =
        "Password must contain at least one special character.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required.";
    else if (!/^\d{10}$/.test(phoneNumber))
      newErrors.phoneNumber = "Phone number is invalid.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //function to submit from
  const handleSubmit = async(event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("form submitted");
      const submitData = {
        name,
        email,
        password,
        phoneNumber,
        dob,

      };
      try {
        const response =await axios.post("http://localhost:5000/register", {
          submitData,
        });
        console.log("response",response)
        if (response.status === 200) {
          console.log("Registered Successful", response.data);
          alert("Register successfull")
          setName('');
          setEmail('');
          setConfirmPassword('');
          setPassword('');
          setPhoneNumber('')
          setDob('')
          navigate('/')
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <Navbar showExtraLinks={false} />
      <div className="register-head">
        <h1>Register</h1>
      </div>
      <form>
        <label>
          Enter Full Name
          <input
            type="text"
            placeholder="Enter Full Name"
            name="name"
            value={name}
            onChange={(event) => {
              handleChange(event);
            }}
          />
        </label>
        {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
        <label>
          Email Address
          <input
            type="text"
            placeholder="Enter Email"
            name="email"
            value={email}
            onChange={(event) => {
              handleChange(event);
            }}
          />
        </label>
        {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
        <label>
          Enter Password
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={password}
            maxLength={15}
            onChange={(event) => {
              handleChange(event);
            }}
            required
          />
        </label>
        {errors.password && (
          <span style={{ color: "red" }}>{errors.password}</span>
        )}
        <label>
          Confirm Password
          <input
            type="password"
            placeholder="Re Enter Password"
            name="confirmPassword"
            value={confirmPassword}
            maxLength={15}
            onChange={(event) => {
              handleChange(event);
            }}
            required
          />
          {errors.confirmPassword && (
            <span style={{ color: "red" }}>{errors.confirmPassword}</span>
          )}
        </label>
        <label>
          Enter Phone Number
          <input
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(event) => {
              handleChange(event);
            }}
          />
        </label>
        {errors.phoneNumber && (
          <span style={{ color: "red" }}>{errors.phoneNumber}</span>
        )}
        <label>
          Enter Date of Birth
          <input
            type="date"
            placeholder="Enter Date Of Birth"
            name="dob"
            value={dob}
            onChange={(event) => {
              handleChange(event);
            }}
          />
        </label>
        {errors.dob && <span style={{ color: "red" }}>{errors.dob}</span>}
        <label>
          <button onClick={(event) => handleSubmit(event)}>Register</button>
        </label>
        <p className="accountPrompt">
            Already Have an account?Login here <a href="/">Login here</a>
        </p>
      </form>
    </div>
  );
}
