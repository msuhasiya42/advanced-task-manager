import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../Store/authStore";
import useUserData from "../../hooks/useUserData";
import LoadingPage from "../Loading/LoadingPage";
import ErrorPage from "../ErrorPage/ErrorPage";

interface ChildrenProp {
  children?: ReactNode;
}

const ProtectedRoute = ({ children }: ChildrenProp) => {
  const user = useAuthStore((state) => state.user);
  const { isLoading, error } = useUserData();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
