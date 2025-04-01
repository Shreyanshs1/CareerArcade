import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard'
import User from './pages/admin/User';
import JobSeekerDashboard from './pages/jobseeker/JobseekerDashboard'
import EmployerDashboard from './pages/employer/EmployerDashboard'
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './pages/protected/ProtectedRoute';
import Signup from './pages/Signup';

function App() {
  return (
    <>
     <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Jobseeker"]} />}>
            <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Employer"]} />}>
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<User />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
