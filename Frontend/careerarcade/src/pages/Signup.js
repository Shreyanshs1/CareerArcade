import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({
      name:'',
      email:'',
      password:''
    })
  const navigate = useNavigate() //React hook for navigate

  const baseUrl="https://localhost:7232/api"

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
    const copySignupInfo = {...signupInfo}
    copySignupInfo[name]=value;
    setSignupInfo(copySignupInfo);
}

  return (
    <div className="container">
          <h2>Signup</h2>
          <form >
          <input type="text" autoFocus placeholder="Name" name='name' className="input" onChange={handleChange}/>
                <input type="email" placeholder="Email" name='email' className="input" onChange={handleChange}/>
                <input type="password" placeholder="Password" name='password' className="input" onChange={handleChange}/>
          <button type='submit' className="button-50">Signup</button>
          </form>
          <p>
            Already a user? <Link to="/login" className="link">Login</Link>
          </p>
        </div>
  )
}

export default Signup