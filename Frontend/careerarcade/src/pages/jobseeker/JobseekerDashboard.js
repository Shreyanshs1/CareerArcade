import React from 'react';
import SearchComponent from './component/SearchComponent';
import MyApplications from './component/MyApplications';
import Navbar from './component/Navbar'; // Adjust the import path as necessary

const JobseekerDashboard = () => {
  return (
    <div className="container mt-4">
      <Navbar />
      <h2 className="mb-4">Jobseeker Dashboard</h2>
      <div className="row">
        <div className="col-md-6">
          <SearchComponent />
        </div>
        <div className="col-md-6">
          <MyApplications />
        </div>
      </div>
    </div>
  );
};

export default JobseekerDashboard;
