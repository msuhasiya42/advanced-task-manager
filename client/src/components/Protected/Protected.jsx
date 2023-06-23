import React from "react";
import useAuthStore from "../../Zustand/authStore";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default ProtectedRoute;
