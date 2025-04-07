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
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadJobs = async () => {
      const data = await fetchJobs();
      setJobs(data);
      setFilteredJobs(data);
    };
    loadJobs();
  }, []);

  // Extract unique locations & companies for dropdowns
  const uniqueLocations = [...new Set(jobs.map((job) => job.location).filter(Boolean))];
  const uniqueCompanies = [...new Set(jobs.map((job) => job.company).filter(Boolean))];

  const handleFilter = () => {
    let filtered = [...jobs];

    if (searchText) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter((job) => job.location === selectedLocation);
    }

    if (selectedCompany) {
      filtered = filtered.filter((job) => job.company === selectedCompany);
    }

    setFilteredJobs(filtered);
  };

  // Trigger filter on every change
  useEffect(() => {
    handleFilter();
  }, [searchText, selectedLocation, selectedCompany]);

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
    },
    {
      name: 'Email',
      selector: (row) => row.employer?.email || 'N/A',
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
    <div className="w-100vw px-5 mt-4">
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by job title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="p-2 border rounded w-full md:w-[250px]"
        />

        {/* Location Dropdown */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="p-2 border rounded w-full md:w-[200px]"
        >
          <option value="">All Locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Company Dropdown */}
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="p-2 border rounded w-full md:w-[200px]"
        >
          <option value="">All Companies</option>
          {uniqueCompanies.map((comp) => (
            <option key={comp} value={comp}>
              {comp}
            </option>
          ))}
        </select>
      </div>

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
