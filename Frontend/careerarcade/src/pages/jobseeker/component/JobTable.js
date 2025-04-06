// src/components/JobTable.jsx
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { fetchJobs } from './jobApi';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const JobTable = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadJobs = async () => {
      const data = await fetchJobs();
      setJobs(data);
      setFilteredJobs(data);
    };
    loadJobs();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(value)
    );
    setFilteredJobs(filtered);
  };

  const columns = [
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: 'Company',
      selector: (row) => row.company,
      sortable: true,
    },
    {
      name: 'Location',
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: 'Posted On',
      selector: (row) => dayjs(row.postedOn).format('DD MMM YYYY'),
      sortable: true,
    },
    {
      name: 'Employer',
      selector: (row) => row.employer?.name || 'N/A',
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.employer?.email || 'N/A',
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <button
          onClick={() => navigate(`/jobseeker/jobs/${row.id}`)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by job title..."
        value={searchText}
        onChange={handleSearch}
        className="mb-4 p-2 border rounded w-full md:w-1/2"
      />
      <DataTable
        title="Available Jobs"
        columns={columns}
        data={filteredJobs}
        pagination
        highlightOnHover
        striped
        responsive
      />
    </div>
  );
};

export default JobTable;
