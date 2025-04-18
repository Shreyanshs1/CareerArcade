import React from 'react';
import JobTable from './component/JobTable';
import Navbar from './component/Navbar';
import './css/JobsPage.css';

const JobsPage = () => {
  return (
    <div className="job-page-container">
        <Navbar/>
      <h1 className="p-3">Job Listings</h1>
      <JobTable />
    </div>
  );
};

export default JobsPage;
