import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useUserData from "../../hooks/useUserData";
import LoadingPage from "../Loading/LoadingPage";
import ErrorPage from "../ErrorPage/ErrorPage";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";

interface ChildrenProp {
  children?: ReactNode;
}

const ProtectedRoute = ({ children }: ChildrenProp) => {
  const { user } = useSelector((state: RootState) => state.auth);
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
