import "../../App.css";
import React, { useState, useEffect, useRef } from "react";
import TaskManager from "../Task/TaskManager";
import SideBar from "../SideBar/SideBar";
import {
  AlignLeftOutlined,
  DoubleLeftOutlined,
  DownOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Badge, Button, Popover, Switch } from "antd";
import useTaskStore from "../../Store/taskStore";
import Filter, { initialFilterValue } from "../Filter/Filter";
import AddTaskModal from "../AddTaskModal/AddTaskModal";

const UserDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true); // Set to true by default
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isChildPopupActive, setIsChildPopupActive] = useState(false);
  const sideBarRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Function to handle clicks outside of sidebar
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sideBarRef.current &&
        !sideBarRef.current.contains(event.target as Node) &&
        !isChildPopupActive
      ) {
        // Clicked outside of sidebar and no child popup is active, so hide the sidebar
        window.innerWidth < 640 && setShowSidebar(false);
      }
    };

    // Add event listener when sidebar is shown
    if (showSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Remove event listener when sidebar is hidden
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up by removing event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar, isChildPopupActive]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const toggleAddTaskFunc = () => {
    setShowAddTaskModal(!showAddTaskModal);
  };

  const filterContent = () => {
    return <Filter setShowFilter={setShowFilter} />;
  };

  const { filter, setView, view } = useTaskStore();

  const filterNotEmpty =
    JSON.stringify(filter) !== JSON.stringify(initialFilterValue);

  const handleChildPopupInteraction = (active: boolean) => {
    // Update state to indicate whether a child popup is active
    setIsChildPopupActive(active);
  };

  const toggleTaskView = () => {
    setView(view === "cardView" ? "listView" : "cardView");
  };

  return (
    <div className="flex h-full w-full">
      {/* Render Sidebar based on showSidebar state */}
      {showSidebar && (
        <div ref={sideBarRef} className="flex h-full z-20">
          <SideBar onChildPopupInteraction={handleChildPopupInteraction} />
        </div>
      )}

      <div className="flex border-gray-900 border-dashed rounded-lg w-full">
        <TaskManager />
      </div>
      {/* Conditionally render button only on small screens */}
      <button
        onClick={toggleSidebar}
        className="sm:hidden fixed bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-md z-50"
      >
        {showSidebar ? (
          <DoubleLeftOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        ) : (
          <AlignLeftOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        )}
      </button>

      <AddTaskModal showAddTaskModal={showAddTaskModal} setShowAddTaskModal={setShowAddTaskModal} />

      {/* bottom buttons */}
      <Badge className="fixed bottom-20 right-4" dot={filterNotEmpty}>
        <Popover
          content={filterContent}
          title={
            <div className="flex gap-1">
              <FilterOutlined className="text-lg" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />{" "}
              <p className="text-lg">Filter</p>
            </div>
          }
          trigger="click"
          open={showFilter}
        >
          <Button
            icon={
              showFilter ? (
                <DownOutlined className="text-white" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              ) : (
                <FilterOutlined className="text-white" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              )
            }
            onClick={toggleFilter}
            className=" fixed bottom-24 right-4 bg-blue-500 text-white rounded-full shadow-md z-50"
          ></Button>
        </Popover>
      </Badge>
      <Button
        icon={
          showAddTaskModal ? (
            <DownOutlined className="text-white" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          ) : (
            <PlusOutlined className="text-white" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          )
        }
        onClick={toggleAddTaskFunc}
        className="fixed bottom-14 right-4 bg-blue-500 text-white rounded-full shadow-md z-50"
      ></Button>
      <Switch className="fixed bottom-4 right-4 te bg-gray-700 xt-white ml-4 mt-5" checkedChildren="Card" unCheckedChildren="List" onClick={toggleTaskView} />
    </div>
  );
};

export default UserDashboard;
