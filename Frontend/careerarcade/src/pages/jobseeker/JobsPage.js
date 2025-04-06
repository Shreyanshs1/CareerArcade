// src/pages/jobseeker/JobsPage.jsx
import React from 'react';
import JobTable from './component/JobTable';

const JobsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
      <JobTable />
    </div>
  );
};

export default JobsPage;
