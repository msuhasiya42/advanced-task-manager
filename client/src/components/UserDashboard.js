import "../App.css";

import React from "react";
import Header from "./Header";
import TaskCard from "./Task/TaskCard";
import SideBar from "./SideBar";
// import DatePicker from "react-datepicker";
// import { useState } from "react";

//import Footer from "./Footer";

const UserDashboard = () => {
  // const [selectedDate, setSelectedDate] = useState(null);

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };

  // static data of tasks
  const todos = [
    "Create Portfolio site",
    "Read Lean Startup",
    "Start Exercise",
    "Clean Room",
    "Organize Desk",
  ];
  const inprogress = [
    "Reading Alchemist",
    "Learning MongoDb",
    "Learning Express Js",
  ];
  const completed = [
    "React Basics",
    "Redux Basics",
    "Reading Fastlane Millionaire",
    "Buying Monitor",
  ];

  return (
    <div>
      <Header />
      <div className="App  justify-center items-center ">
        <header className="App-header">
          <div className=" text-white">
            <header className="App-header">
              <SideBar />
              <TaskCard
                todos={todos}
                inprogress={inprogress}
                completed={completed}
              />
            </header>
          </div>
        </header>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default UserDashboard;
