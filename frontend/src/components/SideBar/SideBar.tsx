import React, { useState } from "react";
import AddTags from "../AddUpdateTag/AddUpdateTag";
import { TaskCategory } from "../Task/Types/types";
import {
  CalendarOutlined,
  HomeOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import ProfileButton from "../SmallComp/ProfileButton/ProfileButton";
import LogoutButton from "../SmallComp/Logout/LogoutButton";
import TagList from "./TagList";
import { setFilteredTasks, setTodaysTasks, setUpcomingTasks } from "../../Store/reducers/taskSlice";
import { useDispatch } from "react-redux";
interface Props {
  onChildPopupInteraction: (active: boolean) => void;
}

export const taskTypes: TaskCategory[] = ["todo", "inProgress", "completed"];

const SideBar = ({ onChildPopupInteraction }: Props) => {
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  const handleAllTasks = () => {
    dispatch(setFilteredTasks());
    setActiveTab("all");
  };

  const handleFilter = (handler: any) => {
    setFilteredTasks();
    taskTypes.forEach((type) => dispatch(handler(type)));
  };

  const handleTemp = () => {
    setActiveTab("reminders");
  };
  return (
    <div className="fixed h-screen top-0 sm:top-auto sm:h-full sm:static flex flex-col w-72 sidebar-container text-gray-300 shadow-lg shadow-indigo-500/10 overflow-hidden">
      {/* App title/logo area */}
      <div className="px-5 py-4 border-b border-indigo-500/20 mt-16 sm:mt-0 bg-gradient-to-r from-gray-900 to-gray-800">
        <h1 className="text-lg text-gray-300 mt-1 font-medium">Organize your day</h1>
      </div>

      {/* Mobile profile buttons - Top */}
      <hr className="border-t sm:hidden border-gray-700/30 my-4 mx-5" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <div>
          <h2 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tasks</h2>
          <ul className="space-y-2">
            {/* Sidebar content here */}
            <li>
              <button
                onClick={handleAllTasks}
                className={`flex items-center w-full p-3 transition-all duration-200 rounded-lg group
            ${activeTab === "all"
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium shadow-md"
                    : "text-gray-300 hover:bg-gray-700/70 hover:text-white"}
            focus:outline-none focus:ring-1 focus:ring-indigo-400`}
              >
                <HomeOutlined className={`text-lg ${activeTab === "all" ? "text-white" : "text-gray-400 group-hover:text-white"}`} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                <span className="ml-3">All Tasks</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  handleFilter(setTodaysTasks);
                  setActiveTab("todays");
                }}
                className={`flex items-center w-full p-3 transition-all duration-200 rounded-lg group
            ${activeTab === "todays"
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium shadow-md"
                    : "text-gray-300 hover:bg-gray-700/70 hover:text-white"}
            focus:outline-none focus:ring-1 focus:ring-indigo-400`}
              >
                <SnippetsOutlined className={`text-lg ${activeTab === "todays" ? "text-white" : "text-gray-400 group-hover:text-white"}`} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                <span className="ml-3 whitespace-nowrap">
                  Today's Tasks
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
                className={`flex items-center w-full p-3 transition-all duration-200 rounded-lg group
            ${activeTab === "upcomingTasks"
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium shadow-md"
                    : "text-gray-300 hover:bg-gray-700/70 hover:text-white"}
            focus:outline-none focus:ring-1 focus:ring-indigo-400`}
              >
                <CalendarOutlined className={`text-lg ${activeTab === "upcomingTasks" ? "text-white" : "text-gray-400 group-hover:text-white"}`} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                <span className="ml-3 whitespace-nowrap">
                  Upcoming Tasks
                </span>
              </button>
            </li>
          </ul>
        </div>

        {/* Tag section with divider */}
        <div className="pt-2">
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-700/40"></div>
            <span className="flex-shrink mx-3 text-xs font-medium text-gray-400">TAGS</span>
            <div className="flex-grow border-t border-gray-700/40"></div>
          </div>
          <TagList activeTab={activeTab} setActiveTab={setActiveTab} onChildPopupInteraction={onChildPopupInteraction} />
        </div>

        {/* Add tag button */}
        <div className="flex justify-center pt-2">
          <AddTags showModal={showModal} setShowModal={setShowModal} onChildPopupInteraction={onChildPopupInteraction} />
        </div>
        <div className="mt-4 flex flex-row sm:hidden px-3 justify-between">
          <ProfileButton />
          <LogoutButton />
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
