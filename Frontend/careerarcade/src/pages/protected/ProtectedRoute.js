import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";


const ProtectedRoute = ({ allowedRoles }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    // Fetch user from localStorage if already logged in
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      try {
        setUser({ role: role, token:token });
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);
  
  if (loading) return null; // Prevents unnecessary redirects during initial render

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
