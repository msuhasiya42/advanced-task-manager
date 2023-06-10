import "../App.css";

import React from "react";
import Header from "./Header";
//import Footer from "./Footer";

const UserDashboard = () => {
  return (
    <div>
      <Header />
      <div className="App  justify-center items-center ">
        <header className="App-header">
          <div className="text-center text-white">
            <p className=" mt-24  text-lg text-blue-400 ">
              Welcome to Home page
            </p>
          </div>
        </header>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default UserDashboard;
