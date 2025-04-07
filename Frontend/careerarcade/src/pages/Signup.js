import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleSuccess, handleError } from './utils';
import {ToastContainer} from 'react-toastify'


const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    role: "", // Store role as string first, convert to number later
  });

  const navigate = useNavigate();
  const baseUrl = "https://localhost:7232/api";

  // Redirect logged-in users
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const tokenExp = localStorage.getItem("tokenExp");
    const currentTime = Date.now();

    if (token && role && tokenExp && currentTime < tokenExp) {
      switch (role) {
        case "Admin":
          navigate("/admin/dashboard");
          break;
        case "Employer":
          navigate("/employer/dashboard");
          break;
        case "Jobseeker":
          navigate("/jobseeker/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({ ...signupInfo, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!signupInfo.name || !signupInfo.email || !signupInfo.password || signupInfo.role === "") {
      handleError("Please fill all fields including role.");
      return;
    }

    const roleValue = signupInfo.role === "Employer" ? 0 : 1; // Convert role to number

    const requestBody = {
      name: signupInfo.name,
      email: signupInfo.email,
      password: signupInfo.password,
      role: roleValue,
    };

    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const result = await response.json();
      const {message} = result;
      if (response.ok) {
        handleSuccess(message);
        console.log(message);
        setTimeout(()=>{
          navigate('/login')
      },1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      handleError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="main-container">
    <div className="login-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          autoFocus
          placeholder="Name"
          name="name"
          className="input"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          className="input"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="input"
          onChange={handleChange}
        />
        {/* Role Selection */}
        <select name="role" className="round" onChange={handleChange}>
          <option value="">Select Role</option>
          <option value="Employer">Employer</option>
          <option value="Jobseeker">Job Seeker</option>
        </select>

        <button type="submit" className="button-50">
          Signup
        </button>
      </form>
      <p>
        Already a user? <Link to="/login" className="link">Login</Link>
      </p>
      <ToastContainer/>
    </div>
    </div>
  );
};

export default Signup;
