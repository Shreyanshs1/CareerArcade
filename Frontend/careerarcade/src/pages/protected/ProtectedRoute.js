import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";


const ProtectedRoute = ({ allowedRoles }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
    // Fetch user from localStorage if already logged in
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const tokenExp = localStorage.getItem("tokenExp");
    const currentTime = Date.now();

    if (!token || !role) {
      // No token present, stop loading and force redirect to login
      setLoading(false);
      return;
    }


    // Check if the token is expired
    if (tokenExp && currentTime > tokenExp) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("tokenExp");
      setLoading(false);
      return;
    }
    // If token is present, set user state
    if (token) {
      try {
        setUser({ role: role, token:token });
        setLoading(false);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);
  
  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
