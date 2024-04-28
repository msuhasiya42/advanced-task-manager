import "../../App.css";
import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import TaskManager from "../Task/TaskManager";
import SideBar from "../SideBar/SideBar";
import { AlignLeftOutlined, DoubleLeftOutlined } from "@ant-design/icons";

const UserDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true); // Set to true by default

  useEffect(() => {
    // Check screen size on component mount
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 640); // Adjust the width as per your requirement
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Call handleResize initially
    handleResize();

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="App flex flex-col h-screen">
      <div className="Header-container fixed top-0 w-full z-40">
        <Header />
      </div>
      <div className="App-body flex flex-1 mt-12 sm:mt-14">
        {/* Render Sidebar based on showSidebar state */}
        {showSidebar && <SideBar />}
        <TaskManager />
      </div>
      {/* Conditionally render button only on small screens */}
      <button
        onClick={toggleSidebar}
        className="sm:hidden fixed bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-md z-50"
      >
        {showSidebar ? (
          <DoubleLeftOutlined />
        ) : (
          <>
            <AlignLeftOutlined />
          </>
        )}
      </button>
    </div>
  );
};

export default UserDashboard;
