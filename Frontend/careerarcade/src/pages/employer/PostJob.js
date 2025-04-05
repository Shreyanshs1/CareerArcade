import React, { useState, useEffect } from 'react';
import Navbar from './component/Navbar'; 
import {jwtDecode} from 'jwt-decode';
import './css/PostJob.css';

function PostJob() {
  const [formData, setFormData] = useState({
    employerId: '',
    title: '',
    description: '',
    company: '',
    location: '',
    postedOn: '',
    companyDescription: ''
  });
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken = jwtDecode(storedToken);
        // Extract employerId from token payload
        const employerId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        // Set current date-time in ISO format
        const currentDateTime = new Date().toISOString();
        setFormData((prevData) => ({
          ...prevData,
          employerId,
          postedOn: currentDateTime
        }));
      } catch (error) {
        setMessage("Invalid token. Please log in again.");
      }
    } else {
      setMessage("No token found. Please log in.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('https://localhost:7232/api/Job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Failed to post job');
      }
      setMessage('Job posted successfully!');
      setFormData((prevData) => ({
        ...prevData,
        title: '',
        description: '',
        company: '',
        location: '',
        companyDescription: ''
      }));
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="post-job-page">
      <Navbar />
      <div className="post-job-container">
        <h2>Post a Job</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-columns">
            {/* Left Column */}
            <div className="form-column left">
              <div className="form-group">
                <label>Employer ID:</label>
                <input className="input mx-wd300" 
                  type="text" 
                  name="employerId" 
                  value={formData.employerId} 
                  disabled 
                />
              </div>
              <div className="form-group">
                <label>Title:</label>
                <input className="input mx-wd300" 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Company:</label>
                <input className="input mx-wd300" 
                  type="text" 
                  name="company" 
                  value={formData.company} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Location:</label>
                <input className="input mx-wd300" 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Posted On:</label>
                <input className="input mx-wd300" 
                  type="text" 
                  name="postedOn" 
                  value={formData.postedOn} 
                  disabled 
                />
              </div>
            </div>
            {/* Right Column */}
            <div className="form-column right">
              <div className="form-group large-group">
                <label>Description:</label>
                <textarea className="input" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                ></textarea>
              </div>
              <div className="form-group large-group">
                <label>Company Description:</label>
                <textarea className="input" 
                  name="companyDescription" 
                  value={formData.companyDescription} 
                  onChange={handleChange} 
                  required 
                ></textarea>
              </div>
            </div>
          </div>
          <button type="submit" className="button-50">Post Job</button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
