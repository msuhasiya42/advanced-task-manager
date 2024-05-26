import React, { useState } from "react";
import useTaskStore from "../../Store/taskStore";
import AddTags from "../AddUpdateTag/AddUpdateTag";
import { TaskCategory } from "../Task/Types/types";
import {
  BellOutlined,
  CalendarOutlined,
  HomeOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import ProfileButton from "../SmallComp/ProfileButton/ProfileButton";
import LogoutButton from "../SmallComp/Logout/LogoutButton";
import TagList from "./TagList";
interface Props {
  onChildPopupInteraction: (active: boolean) => void;
}

export const taskTypes: TaskCategory[] = ["todo", "inProgress", "completed"];

const SideBar = ({ onChildPopupInteraction }: Props) => {
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const {
    copyTasks,
    setTodaysTasks,
    setUpcomingTasks
  } = useTaskStore();

  const handleAllTasks = () => {
    copyTasks();
    setActiveTab("all");
  };

  const handleFilter = (handler: any) => {
    copyTasks();
    taskTypes.forEach(handler);
  };

  const handleTemp = () => {
    setActiveTab("reminders");
  };
  return (
    <div className="fixed h-full sm:static text-gray-400 flex-col w-72 px-5  border-r bg-gray-900 border-gray-700">
      <div className="mt-4 flex flex-row sm:hidden ">
        <ProfileButton />
        <div className="ml-24">
          <LogoutButton />
        </div>
      </div>
      <hr className="border-t sm:hidden border-gray-300 my-4" />
      <nav className="flex-1 space-y-3 ">
        <ul className="menu text-base-content bg-gray-900 sm:mt-8">
          {/* Sidebar content here */}
          <li>
            <button
              onClick={handleAllTasks}
              className={`bold flex items-center w-full p-2 transition duration-75 rounded-lg group 
          ${activeTab === "all" ? "bg-gray-700 text-white" : "text-gray-300"}
          hover:bg-gray-400 hover:text-white 
          focus:bg-gray-600 focus:text-white outline-none
          active:bg-gray-700 active:text-white`}
            >
              <HomeOutlined className="text-lg" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              <span className="ml-3">All Tasks</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => {
                handleFilter(setTodaysTasks);
                setActiveTab("todays");
              }}
              className={`bold flex items-center w-full p-2 transition duration-75 rounded-lg group 
          ${activeTab === "todays" ? "bg-gray-700 text-white" : "text-gray-300"}
          hover:bg-gray-400 hover:text-white 
          focus:bg-gray-600 focus:text-white outline-none
          active:bg-gray-700 active:text-white`}
            >
              <SnippetsOutlined className="text-lg" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              <span className="flex-1 ml-3 whitespace-nowrap">
                Todays Tasks
              </span>
            </button>
          </li>

          {/* upcoming tasks */}
          <li>
            <button
              onClick={() => {
                handleFilter(setUpcomingTasks);
                setActiveTab("upcomingTasks");
              }}
              className={`bold flex items-center w-full p-2 transition duration-75 rounded-lg group 
          ${activeTab === "upcomingTasks" ? "bg-gray-700 text-white" : "text-gray-300"}
          hover:bg-gray-400 hover:text-white 
          focus:bg-gray-600 focus:text-white outline-none
          active:bg-gray-700 active:text-white`}
            >
              <CalendarOutlined className="text-lg" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              <span className="flex-1 ml-3 whitespace-nowrap">
                Upcoming Tasks
              </span>
            </button>
          </li>

          {/* Reminders */}
          {/* <li>
            <button
              onClick={handleTemp}
              className={`bold flex items-center w-full p-2 ${activeTab === "reminders" ? "bg-gray-700" : ""
                } transition duration-75 rounded-lg  group text-gray-300 hover:bg-gray-700 hover:text-white`}
            >
              <BellOutlined className="text-lg" />
              <span className="flex-1 ml-3 whitespace-nowrap">Reminders</span>
            </button>
          </li> */}
        </ul>
        <TagList activeTab={activeTab} setActiveTab={setActiveTab} onChildPopupInteraction={onChildPopupInteraction} />
        {/* Add tag button */}
        <div className="flex justify-center">
          <AddTags showModal={showModal} setShowModal={setShowModal} onChildPopupInteraction={onChildPopupInteraction} />
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
