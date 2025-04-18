import React from 'react';
import SearchComponent from './component/SearchComponent';
import MyApplications from './component/MyApplications';
import Navbar from './component/Navbar';

const JobseekerDashboard = () => {
  const name = localStorage.getItem('loggedInUser');
  return (
    <div className="dashboard-container">
      <Navbar />
      <h3 class="text-center mt-3">Hello <span className='text-primary'>"{name}"</span></h3>
      <h2 className="mb-4">Jobseeker Dashboard</h2>
      <div className="row ">
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
