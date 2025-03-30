import React from 'react'
import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import './Styles.css'
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [loginInfo, setLoginInfo] = useState({
            email:'',
            password:''
        })

    
        const navigate = useNavigate();


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
            alert("All fields are required")
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
          <p className="p">Don't have an account? <span className="link">Sign Up</span></p>
        </div>
  )
}

export default Login