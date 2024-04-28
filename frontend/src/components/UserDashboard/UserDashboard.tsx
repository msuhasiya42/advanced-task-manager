import "../../App.css";
import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import TaskManager from "../Task/TaskManager";
import SideBar from "../SideBar/SideBar";
import {
  AlignLeftOutlined,
  DoubleLeftOutlined,
  DownOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Input, Popover, message } from "antd";
import { taskAPI } from "../../ApiCalls";
import useAuthStore from "../../Zustand/authStore";
import useTaskStore from "../../Zustand/taskStore";

const UserDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true); // Set to true by default
  const [toggleAddTask, setToggleAddTask] = useState(false);

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

  const toggleAddTaskFunc = () => {
    setToggleAddTask(!toggleAddTask);
  };

  const user = useAuthStore((state) => state.user?.userId);
  const { addTaskDataStore, addTaskFilteredTasksStore } = useTaskStore();

  const [taskData, setTaskData] = useState({
    title: "",
    status: "todo",
  });

  const handleInputChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const onSaveTask = (event: React.FormEvent) => {
    const { title, status } = taskData;
    event.preventDefault();

    if (user) {
      if (title.trim() === "") {
        setToggleAddTask(false);
        return;
      }
      taskAPI
        .createTask(title, status, user)
        .then((response) => {
          console.log("Response", response.data.task);
          const newTask = response.data.task;
          addTaskDataStore(status, newTask);
          addTaskFilteredTasksStore(status, newTask);
          void message.success("Task Added", 1.5);
        })
        .catch((error) => {
          console.error(error);
          void message.error("Error: Task Not added", 1.5);
        });
    }
    setTaskData({
      title: "",
      status: "todo",
    });
    setToggleAddTask(false);
  };

  const popoverContent = (
    <div className="flex flex-col">
      <p className="text-center text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
        Add Task
      </p>

      <div className="w-full mt-2">
        {/* <label className="block mb-3 font-medium text-gray-700">Status</label> */}
        <div className="w-40">
          <Input
            required
            name="title"
            defaultValue={taskData.title}
            value={taskData.title}
            onChange={handleInputChange}
            placeholder=" Task Title"
            className="w-full mb-2"
          />
        </div>
        <select
          id="status"
          name="status"
          className="block w-full xt-select rounded-md py-1 px-2 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
          aria-label="Select"
          value={taskData.status}
          onChange={handleInputChange}
        >
          <option value="todo">Todo</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <div className="flex justify-end gap-2 mt-2">
          <Button size="small" onClick={() => setToggleAddTask(false)}>
            Cancel
          </Button>
          <Button
            size="small"
            type="primary"
            className="text-white bg-blue-500"
            onClick={(e) => onSaveTask(e)}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );

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
      <Popover content={popoverContent} trigger="click" open={toggleAddTask}>
        <Button
          icon={
            toggleAddTask ? (
              <DownOutlined className="text-white" />
            ) : (
              <PlusOutlined className="text-white" />
            )
          }
          onClick={toggleAddTaskFunc}
          className="sm:hidden fixed bottom-4 right-4 bg-blue-500 text-white rounded-full shadow-md z-50"
        ></Button>
      </Popover>
    </div>
  );
};

export default UserDashboard;
