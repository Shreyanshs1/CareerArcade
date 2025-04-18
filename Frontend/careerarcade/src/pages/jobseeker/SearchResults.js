import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Spinner, Button } from 'react-bootstrap';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('title');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://shreyansh1807.bsite.net/api/Job/search?title=${encodeURIComponent(searchTerm)}`);
        setJobs(response.data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) fetchJobs();
  }, [searchTerm]);

  const columns = [
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true
    },
    {
      name: 'Company',
      selector: row => row.company,
      sortable: true
    },
    {
      name: 'Location',
      selector: row => row.location,
      sortable: true
    },
    {
      name: 'Posted On',
      selector: row => new Date(row.postedOn).toLocaleDateString(),
      sortable: true
    },
    {
      name: 'Actions',
      cell: row => (
        <button
          onClick={() => navigate(`/jobseeker/jobs/${row.id}`)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          View
        </button>
      )
    }
  ];

  return (
    <div className="w-100vw p-5 mt-4">
      <h3>Search Results for: "{searchTerm}"</h3>
      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      ) : jobs.length === 0 ? (
        <p>No jobs found matching your search.</p>
      ) : (
        <DataTable
          columns={columns}
          data={jobs}
          pagination
          highlightOnHover
          striped
          responsive
        />
      )}
    </div>
  );
};

export default SearchResults;
