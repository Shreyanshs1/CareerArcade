import React, { useState, useEffect } from 'react';
import Navbar from './component/Navbar'; 
import './css/Jobs.css';
import {ToastContainer} from 'react-toastify'
import {handleSuccess, handleError} from '../utils'

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const JOBS_API_URL = 'https://localhost:7232/api/Job';
  const DELETE_JOB_API_URL = 'https://localhost:7232/api/Admin/job';

  // Function to fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token'); // Ensure token exists in local storage
      const response = await fetch(JOBS_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch jobs when component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle job deletion
  const handleDelete = async (jobId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${DELETE_JOB_API_URL}/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }
      handleSuccess('Job deleted successfully!');
      // Refresh job list after deletion
      fetchJobs();
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="jobs-content">
        <h1>Jobs List</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="jobs-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Company</th>
                <th>Location</th>
                <th>Posted On</th>
                <th>Employer ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td>{job.title}</td>
                    <td>{job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>{new Date(job.postedOn).toLocaleDateString()}</td>
                    <td>{job.employerId}</td>
                    <td>
                      <button className="delete-button" onClick={() => handleDelete(job.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No jobs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Jobs;
