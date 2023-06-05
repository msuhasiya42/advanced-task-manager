import "../App.css";

import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

const UserDashboard = () => {
  return (
    <div>
      <NavBar />
      <div className="App  justify-center items-center ">
        <header className="App-header">
          <div className="text-center text-white">
            <p className=" mt-24  text-lg text-blue-400 ">
              Welcome to Home page
            </p>
            <a href="/login">Login</a> <br />
            <a href="/signup">Sign Up</a> <br />
            <a href="/aboutus">About Us</a> <br />
            <a href="/contactus">Contact Us</a> <br />
          </div>
        </header>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
