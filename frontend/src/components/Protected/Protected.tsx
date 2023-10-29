import React, { ReactNode } from "react";
import useAuthStore from "../../Zustand/authStore";
import { Navigate } from "react-router-dom";
interface ChildrenProp {
  children?: ReactNode;
}

const ProtectedRoute = ({ children }: ChildrenProp) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default ProtectedRoute;
