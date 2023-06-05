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
          <div className="text-center text-white"></div>
        </header>
        <footer className="App-footer ">
          <div className="flex flex-nowrap">
            <div className="pl-40 ">
              <h1 className="text-black font-bold underline pb-4 ">Company</h1>
              <a href="/aboutus">About Us</a>
              <h1>Team</h1>
              <h1>Careers</h1>
            </div>
            <div className="pl-40">
              <h1 className="text-black font-bold underline pb-4 ">Contact</h1>
              <h1>Help & Support</h1>
            </div>
          </div>
        </footer>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
