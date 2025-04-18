import React, { useState, useEffect } from 'react';
import Navbar from './component/Navbar'; // Ensure correct path
import './css/Companies.css';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const COMPANIES_API_URL = 'https://shreyansh1807.bsite.net/api/Admin/companies';

  // Function to fetch companies
  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token'); // Ensure token is available
      const response = await fetch(COMPANIES_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }

      const data = await response.json();
      console.log(data); // Debugging line to check the response
      setCompanies(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch companies when component mounts
  useEffect(() => {
    fetchCompanies();
    console.log("state",companies); // Debugging line to check the companies state

  }, []);

  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="companies-content">
        <h1>Companies List</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="companies-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {companies.length > 0 ? (
                companies.map((company, index) => (
                  <tr key={index}>
                    <td>{company.company}</td>
                    <td>
                      {company.companyDescription}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No companies found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Companies;
