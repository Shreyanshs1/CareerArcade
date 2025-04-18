import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(
          'https://shreyansh1807.bsite.net/api/Application/my-applications',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setApplications(response.data);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <Spinner animation="border" variant="primary" />;

  return (
    <div className="card p-3">
      <h4>My Applications</h4>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((app) => (
          <Card className="mb-2" key={app.id}>
            <Card.Body>
              <Card.Title>{app.jobTitle}</Card.Title>
              <Card.Text>
                <strong>Applied On:</strong>{' '}
                {new Date(app.appliedOn).toLocaleDateString()}
                <br />
                <strong>Status:</strong> {app.status === 0 ? 'Pending' : 'Reviewed'}
              </Card.Text>
              <Button
                variant="outline-primary"
                onClick={() => navigate(`/jobseeker/jobs/${app.jobId}`)}
              >
                View Job
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default MyApplications;
