import "../../App.css";

import React from "react";
import Header from "../Header/Header";
import TaskManager from "../Task/TaskManager";
import SideBar from "../SideBar/SideBar";
// import { useState } from "react";
//import Footer from "./Footer";

const UserDashboard = () => {
  return (
    <div>
      <Header />
      <div className="App  justify-center items-center ">
        <header className="App-header">
          <div className=" text-white">
            <header className="App-header">
              <div className="flex flex-row w-full ">
                <div>
                  <SideBar />
                </div>
                <div>
                  <TaskManager />
                </div>
              </div>
            </header>
          </div>
        </header>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default UserDashboard;
