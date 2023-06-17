import React from "react";
import NavBar from "../NavBar/NavBarHomePage";
import { Navigate } from "react-router-dom";

const Home = () => {
  const token = localStorage.getItem("token");
  if (token) {
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
