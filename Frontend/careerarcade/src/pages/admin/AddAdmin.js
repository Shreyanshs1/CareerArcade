import React, { useState } from 'react';
import Navbar from './component/Navbar';
import './css/AddAdmin.css';

function AddAdmin() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = 'https://localhost:7232/api/Admin/add-admin';

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add admin');
      }

      setMessage('Admin added successfully!');
      setFormData({ name: '', email: '', password: '' }); // Reset form after success
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="form-container">
        <h2>Add Admin</h2>
        {message && <p className="message">{message}</p>}
        <form className='add-admin-form ' onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input className="input"
            placeholder="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input className="input"
            placeholder="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input className="input"
            placeholder="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="button-50" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAdmin;
