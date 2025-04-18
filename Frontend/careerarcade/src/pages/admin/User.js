import React, { useState, useEffect } from 'react';
import Navbar from './component/Navbar'; 
import './css/User.css';
import {ToastContainer} from 'react-toastify'
import { handleSuccess, handleError } from '../utils';

const UserComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'https://localhost:7232/api/User';

  // Function to fetch the list of users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token'); // Adjust the key if needed
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        console.log(response)
        throw new Error('Failed to delete user');
      }
      //Success message
      handleSuccess('User deleted successfully!');
      // Refresh the users list after successful deletion
      fetchUsers();
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="user-content">
        <h1>Users List</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No users found.</td>
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

export default UserComponent;
