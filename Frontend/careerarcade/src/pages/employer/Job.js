import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/Job.css';

const Job = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No token found. Please login.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://localhost:7232/api/Application/job/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch job details');
        const data = await response.json();
        setJob(data);
      } catch (error) {
        setMessage(error.message);
      }

      setLoading(false);
    };

    fetchJob();
  }, [id]);

  const handleDeleteJob = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://localhost:7232/api/Job/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete job');
      alert("Job deleted successfully");
      navigate('/employer/dashboard');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    setStatusUpdating(applicationId);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://localhost:7232/api/Application/${applicationId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to update status');
      const updatedApplications = job.applications.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      );
      setJob({ ...job, applications: updatedApplications });
    } catch (error) {
      alert(error.message);
    }
    setStatusUpdating(null);
  };

  if (loading) return <p>Loading...</p>;
  if (message) return <p className="error">{message}</p>;

  return (
    <div className="job-details-container">
      <div className="job-header">
        <h2>{job.title}</h2>
        <button onClick={handleDeleteJob} className="delete-btn">Delete Job</button>
      </div>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Description:</strong></p>
      <p className="job-description">{job.description}</p>

      <h3>Applications</h3>
      {job.applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div className="application-list">
          {job.applications.map(app => (
            <div key={app.id} className="application-card">
              <p><strong>Applicant:</strong> {app.applicantName}</p>
              <p><strong>Email:</strong> {app.applicantEmail}</p>
              <p><strong>Resume:</strong> <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">View</a></p>
              <p><strong>Status:</strong> {app.status}</p>
              <div className="status-buttons">
                {['Pending', 'Accepted', 'Rejected'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(app.id, status)}
                    disabled={statusUpdating === app.id}
                    className={status === app.status ? 'active' : ''}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Job;
