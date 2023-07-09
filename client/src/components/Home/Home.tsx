import React from "react";
import NavBar from "../NavBar/NavBarHomePage";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../Zustand/authStore";

const Home = () => {
  const { user } = useAuthStore();
  if (user) {
    return <Navigate to="/user-dashboard" replace />;
  }
  return (
    <div>
      <NavBar />
      Home
    </div>
  );
};

export default Home;
