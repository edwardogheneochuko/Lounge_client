
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";


const ProtectedRoute = ({ children, role }) => {
  const { token, user } = useAuthStore();

  // Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role is required but doesn't match → redirect (e.g., to home or unauthorized page)
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Otherwise → allow access
  return children;
};

export default ProtectedRoute;