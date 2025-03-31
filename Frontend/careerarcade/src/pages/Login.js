import React from 'react'
import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import './Styles.css'
import { Link, useNavigate } from "react-router-dom";
import Signup from './Signup';

const Login = () => {
    const [loginInfo, setLoginInfo] = useState({
        email:'',
        password:''
    })

    
    const navigate = useNavigate();

    // Check if user is already logged in and redirect
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const tokenExp = localStorage.getItem("tokenExp");
        const currentTime = Date.now();

        if (token && role && tokenExp) {
        if (currentTime < tokenExp) {
            // Redirect to respective dashboard based on role
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
        }
    }, [navigate]);


    const handleChange=(e)=>{
        const {name,value}=e.target;
        const copyLoginInfo = {...loginInfo}
        copyLoginInfo[name]=value;
        setLoginInfo(copyLoginInfo);
        console.log(loginInfo);
    }


    const baseUrl="https://localhost:7232/api"


    const handleSubmit = async (e)=>{
        e.preventDefault()
        const{email,password}=loginInfo;
        if(!email || !password){
            return;
        } 
        try{
        const response = await fetch(`${baseUrl}/Auth/login`, {
            method: 'POST',
            body: JSON.stringify(loginInfo),
            headers: {
                'Content-type': 'application/json'
            }
        })
        const result = await response.json();
        const {token}=result;
        if (response.ok) {
            localStorage.setItem("token", token);
            const decoded = jwtDecode(token);
            const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            const tokenExp = decoded.exp * 1000;
            localStorage.setItem("tokenExp", tokenExp);
            localStorage.setItem("role",role);
            console.log("login successful")
            setTimeout(()=>{
                navigate('/')
            },1000);
        } else {
            alert(result.message);
        }
    }catch(err){
        console.log(err);
    }
    }
  return (
    <div className="container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" name='email' className="input" onChange={handleChange}/>
          <input type="password" placeholder="Password" name='password' className="input" onChange={handleChange}/>
          
          <button className="button-50">Login</button>
          </form>
          <p className="p">Don't have an account? <Link to="/signup" className="link">Sign Up</Link></p>
        </div>
  )
}

export default Login