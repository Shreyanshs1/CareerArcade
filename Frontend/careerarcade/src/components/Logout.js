import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return <button className="logout" onClick={logout}>Logout</button>;
};

export default LogoutButton;
