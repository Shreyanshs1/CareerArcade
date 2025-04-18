import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import './css/YourProfile.css';

function YourProfile() {
  // Initialize user state to null to better represent "not loaded yet"
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  // Initialize formData with empty strings, it will be populated on fetch/edit
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true); // Start in loading state
  const [message, setMessage] = useState('');

  // Get token once at the top level to make it accessible to all handlers
  const token = localStorage.getItem('token');

  // Effect to fetch user data on component mount
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component
    console.log("Component Mounted. Token:", token); // Debugging token

    if (!token) {
      console.log("No token found.");
      setMessage("Authorization token not found. Please log in.");
      setLoading(false);
      return; // Exit early
    }

    let currentUserId = '';
    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken); // Debugging decoded token

      // Extract user ID from the token using a standard claim URI
      const userIdClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
      currentUserId = decodedToken[userIdClaim];
      console.log("Extracted User ID:", currentUserId); // Debugging user ID

      if (!currentUserId) {
        console.log("User ID claim not found in token.");
        setMessage("User ID not found in token.");
        setLoading(false);
        return; // Exit early
      }

    } catch (error) {
      console.error("Error decoding token:", error);
      setMessage("Invalid token. Please log in again.");
      setLoading(false);
      return; // Exit early
    }

    const fetchUserData = async (userIdToFetch) => {
      console.log("Fetching user data for ID:", userIdToFetch);
      setMessage(''); // Clear previous messages

      // Construct API URL dynamically using user ID
      const API_URL_FETCH = `https://shreyansh1807.bsite.net/api/user/${userIdToFetch}`;

      try {
        const response = await fetch(API_URL_FETCH, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Use token from outer scope
          }
        });

        console.log("Fetch Response Status:", response.status); // Debugging API response

        if (!response.ok) {
          let errorBody = await response.text();
          console.error(`API Error: Status ${response.status}, Body: ${errorBody}`);// Debugging error response
          throw new Error(`Failed to fetch user profile (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log("Fetched User Data:", data); // Debugging fetched data

        if (isMounted) { // Only update state if component is still mounted
            setUser(data);
            // Initialize formData with fetched data
            setFormData({ name: data.name || '', email: data.email || '', password: '' });
        }

      } catch (error) {
        console.error("Error fetching user:", error);
        if (isMounted) {
            setMessage(error.message || 'An error occurred while fetching profile.');
            setUser(null); // Ensure user is null on error
        }
      } finally {
        // Ensure loading is set to false in finally block
        if (isMounted) {
            setLoading(false);
        }
      }
    };

    // Call the fetch function if we have a userId
    fetchUserData(currentUserId);

    // Cleanup function to run when component unmounts
    return () => {
      isMounted = false;
      console.log("Component Unmounted.");
    };

  }, []); // Empty dependency array: run only once on mount

  // --- Handler Functions ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleEdit = () => {
    if (!editMode && user) {
      // Reset form to current user data when entering edit mode
      setFormData({ name: user.name, email: user.email, password: '' });
    } else if (editMode) {
       // Optionally reset password field when canceling edit mode
       setFormData(prev => ({ ...prev, password: '' }));
    }
    setEditMode(!editMode);
    setMessage(''); // Clear messages when toggling edit mode
  };

  // Update user profile
  const handleUpdate = async () => {
    if (!user || !user.id) {
        setMessage("Cannot update: User data not available.");
        return;
    }
    // Construct API URL dynamically using user ID from state
    const API_URL_UPDATE = `https://shreyansh1807.bsite.net/api/user/${user.id}`;
    setLoading(true);
    setMessage('');

    try {
        // Include password only if it's not empty
        const bodyData = {
            name: formData.name,
            email: formData.email,
            // Conditionally add password if user entered one
            ...(formData.password && { password: formData.password })
        };

      const response = await fetch(API_URL_UPDATE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Use token from outer scope
        },
        body: JSON.stringify(bodyData)
      });

       console.log("Update Response Status:", response.status);

      if (!response.ok) {
        let errorBody = await response.text();
        console.error(`API Error Update: Status ${response.status}, Body: ${errorBody}`);
        throw new Error(`Failed to update profile (Status: ${response.status})`);
      }

      // Parse the response to get updated user data
      const updatedUser = { ...user, name: formData.name, email: formData.email };
      setUser(updatedUser);
      setMessage('Profile updated successfully!');
      setEditMode(false);
      // Clear password field in form state after successful update
      setFormData({ name: updatedUser.name, email: updatedUser.email, password: '' });

    } catch (error) {
      console.error("Error updating user:", error);
      setMessage(error.message || 'An error occurred while updating profile.');
    } finally {
       setLoading(false); // Ensure loading is set to false
    }
  };

  // Delete user profile
  const handleDelete = async () => {
    if (!user || !user.id) {
        setMessage("Cannot delete: User data not available.");
        return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete your profile? This action is irreversible.');
    if (!confirmDelete) return;

    // Construct API URL dynamically using user ID from state
    const API_URL_DELETE = `https://shreyansh1807.bsite.net/api/user/${user.id}`;
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(API_URL_DELETE, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // Use token from outer scope
        }
      });

      console.log("Delete Response Status:", response.status);

      if (!response.ok) {
        let errorBody = await response.text();
        console.error(`API Error Delete: Status ${response.status}, Body: ${errorBody}`);
        throw new Error(`Failed to delete profile (Status: ${response.status})`);
      }

      // Clear local storage and redirect
      localStorage.clear();
      setMessage('Profile deleted successfully. Redirecting...');
      setUser(null); // Clear user state

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/login'; // Redirect to login page
      }, 2000);

    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage(error.message || 'An error occurred while deleting profile.');
      setLoading(false); // Set loading false only if deletion failed
    }
  };


  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>Your Profile</h2>
        {message && <p className={`message ${message.includes('successfully') ? 'message-success' : 'message-error'}`}>{message}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : !user ? (
           // Handle case where loading finished but user is null (error or no data)
           <p>Could not load user profile. {message || ''}</p>
        ) : (
           // Render profile information and edit form if user data exists
          <div className="profile-info">
            {/* Display Fields - Use `user` state for displayed values */}
            <div className="form-group">
              <label>ID:</label>
              <input type="text" value={user.id || ''} disabled />
            </div>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editMode ? formData.name : user.name || ''} // Show user data or form data
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editMode ? formData.email : user.email || ''} // Show user data or form data
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <input type="text" value={user.role || ''} disabled />
            </div>

            {/* Edit Mode Fields */}
            {editMode && (
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password} // Password only uses formData
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  autoComplete="new-password" // Help browser behavior
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="button-group">
              <button onClick={toggleEdit} className="edit-btn" disabled={loading}>
                <FaEdit /> {editMode ? 'Cancel' : 'Edit'}
              </button>
              {editMode && (
                <button onClick={handleUpdate} className="update-btn" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              )}
              <button onClick={handleDelete} className="delete-btn" disabled={loading}>
                <FaTrash /> {loading ? 'Deleting...' : 'Delete Profile'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default YourProfile;