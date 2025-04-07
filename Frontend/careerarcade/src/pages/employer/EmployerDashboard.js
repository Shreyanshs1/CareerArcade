import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/EmployerDashboard.css';
import Navbar from './component/Navbar'

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const name = localStorage.getItem('loggedInUser');


  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setMessage('No token found. Please login.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://localhost:7232/api/Job/my-jobs', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs. Status: ${response.status}`);
        }

        const data = await response.json();
        setJobs(data);
      } catch (error) {
        setMessage(error.message);
      }

      setLoading(false);
    };

    fetchJobs();
  }, []);

  const handleJobClick = (id) => {
    navigate(`/employer/job/${id}`);
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <h3 class="text-center mt-3">Hello <span className='text-primary'>"{name}"</span></h3>
      <h2>My Posted Jobs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : message ? (
        <p className="error">{message}</p>
      ) : jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="job-card-grid">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="job-card"
              onClick={() => handleJobClick(job.id)}
            >
              <h5>{job.title}</h5>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p className="truncate"><strong>Description:</strong> {job.description}</p>
              <p><strong>Posted On:</strong> {new Date(job.postedOn).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
