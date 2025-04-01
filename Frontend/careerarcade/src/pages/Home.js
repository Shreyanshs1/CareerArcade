import React from 'react';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Home() {
  const navigate = useNavigate(); //React hook for navigate
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
  return (
    <>
    <Navbar/>
    </>
  )
}

export default Home