import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [email, password]);

  const navigate = useNavigate();

  //function to manage input
  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newError = {};
    if (!email || !password) alert("All fields are required");
    if (email && password && validateInput()) {
      const submitData = {
        email,
        password,
      };
      try {
        const response = await axios.post(
          "http://localhost:5000/LogIn",
          submitData
        );
        if (response.status === 200) {
          // Store user information in local storage
          console.log("response.data.user",response.data.user)
          localStorage.setItem('user', JSON.stringify(response.data.user));
          console.log("login");
          navigate("/Dashboard");
      }
      } catch (error) {
        console.log(error.response.status);
        if (error.response && error.response.status === 401) {
          newError.password = "Password mismatch";
        } else if (error.response && error.response.status === 404) {
          newError.email = "User not found";
        } else if (error.response && error.response.status === 500) {
          alert("Internal server error,please try again letter");
        }
        console.log(newError);
        setErrors(newError);
      }
    }
  };

  const validateInput = () => {
    if (/\S+@\S+\.\S+/.test(email) && password.length >= 8) {
      return true;
    } else if (password.length <= 8) {
      errors.password = "password shold be minimum of 8 characters";
      setPassword("");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "enter valid emails";
      setEmail("");
    }
  };

  return (
    <>
      <Navbar showExtraLinks={false} />
      <div className="container">
        <h2>Login</h2>
        <form className="form">
          <label className="label">
            Enter Email Address
            <input
              type="text"
              placeholder="Enter Email"
              name="email"
              value={email}
              onChange={handleChange}
              className="input"
            />
          </label>
          {errors.email && <span className="error">{errors.email}</span>}
          <label className="label">
            Enter Password
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              value={password}
              onChange={handleChange}
              className="input"
            />
          </label>
          {errors.password && <span className="error">{errors.password}</span>}
          <div className="buttonContainer">
            <button className="button" onClick={handleSubmit}>
              Log In
            </button>
          </div>
        </form>
        <p className="accountPrompt">
          Don't have an account? <a href="/register">Sign up here</a>
        </p>
      </div>
    </>
  );
}
