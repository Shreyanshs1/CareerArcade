import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobById } from './component/jobApi';
import dayjs from 'dayjs';
import axios from 'axios';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await fetchJobById(id);
        setJob(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to apply for a job.');
      return;
    }
  
    try {
      await axios.post(
        'https://shreyansh1807.bsite.net/api/Application/apply',
        {
          jobId: parseInt(id),
          resumeUrl: resumeUrl
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessage('Application submitted successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to submit application.');
    } finally {
      setShowModal(false);
      setResumeUrl('');
    }
  };
  

  if (loading) return <div className="container py-5 text-center">Loading...</div>;
  if (error) return <div className="container py-5 text-danger text-center">{error}</div>;

  return (
    <div className="py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">

              {/* Header Buttons */}
              <div className="mb-3 d-flex justify-content-between">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>← Back</button>
                <button className="btn btn-success btn-sm" onClick={() => setShowModal(true)}>Apply</button>
              </div>

              {/* Feedback Message */}
              {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`} role="alert">
                  {message}
                </div>
              )}

              {/* Job Info */}
              <div className="mb-4 border-bottom pb-3">
                <h2 className="text-primary text-break">{job.title}</h2>
                <p className="text-muted mb-0">
                  Posted on: {dayjs(job.postedOn).format('DD MMM YYYY')} • {job.location}
                </p>
              </div>

              {/* Job Description */}
              <section className="mb-4">
                <h5 className="mb-2">Job Description</h5>
                <p style={{ whiteSpace: 'pre-line' }}>{job.description}</p>
              </section>

              {/* Company Details */}
              <section className="mb-4 p-3 bg-light border rounded">
                <h5 className="mb-2">Company: {job.company}</h5>
                <p style={{ whiteSpace: 'pre-line' }}>{job.companyDescription}</p>
              </section>

              {/* Employer Info */}
              <section className="p-3 bg-white border rounded">
                <h5 className="mb-2">Posted By</h5>
                <p><strong>Name:</strong> {job.employer?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {job.employer?.email || 'N/A'}</p>
              </section>

            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Apply for Job</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <label htmlFor="resumeUrl" className="form-label">Resume URL</label>
                <input
                  type="text"
                  className="form-control"
                  id="resumeUrl"
                  placeholder="Enter resume URL"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleApply}>Submit Application</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default JobDetailsPage;
