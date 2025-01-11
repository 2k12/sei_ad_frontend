import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { permissions } = useAuth();

  const hasPermission = permissions.includes(requiredPermission);

  if (!hasPermission) {
    return <Navigate to="/dashboard" />; 
  }

  return children;
};

export default ProtectedRoute;
