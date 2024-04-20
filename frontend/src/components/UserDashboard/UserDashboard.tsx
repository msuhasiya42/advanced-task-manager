import "../../App.css";
import React from "react";
import Header from "../Header/Header";
import TaskManager from "../Task/TaskManager";
import SideBar from "../SideBar/SideBar";

const UserDashboard = () => {
  return (
    <div className="App flex flex-col h-screen">
      <div className="Header-container fixed top-0 w-full z-40">
        <Header />
      </div>
      {/* overflow hidden will create issue when many tasks and overflowing to bottom */}
      <div className="App-body flex flex-1 mt-14 overflow-hidden">
        <SideBar />
        <TaskManager />
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default UserDashboard;
