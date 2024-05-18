import React, { useState } from "react";
import useTaskStore from "../../Store/taskStore";
import useAuthStore from "../../Store/authStore";
import { userAPI } from "../../Api";
import AddTags from "../Add Tags/AddTags";
import { TaskCategory } from "../Task/Types/types";
import { Popconfirm, message } from "antd";
import {
  BellOutlined,
  CalendarOutlined,
  DeleteOutlined,
  HomeOutlined,
  SnippetsOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { deleteTagStr, deleteTagTitle } from "../../utils/strings";
import ProfileButton from "../SmallComp/ProfileButton/ProfileButton";
import LogoutButton from "../SmallComp/Logout/LogoutButton";
interface Props {
  onChildPopupInteraction: (active: boolean) => void;
}
const SideBar = ({ onChildPopupInteraction }: Props) => {
  const [activeTab, setActiveTab] = useState("all");

  const { tags, deleteTag } = useTaskStore();
  const {
    copyTasks,
    setTodaysTasks,
    setUpcomingTasks,
    filterTasksByTag,
    removeTagFromAllTasks,
  } = useTaskStore();

  const handleAllTasks = () => {
    copyTasks();
    setActiveTab("all");
  };
  const userId = useAuthStore((state) => state?.user?.userId);

  const handleDeleteTag = (tag: string) => {
    const updatedTags = tags.filter((t: string) => t !== tag);
    userAPI
      .updateUserTag(userId, updatedTags)
      .then(() => {
        void message.success("Tag Deleted", 1.5);
        deleteTag(tag);
        removeTagFromAllTasks(tag);
      })
      .catch(() => {
        void message.error("Error: Tag Not deleted", 2);
      });
  };

  const taskTypes: TaskCategory[] = ["todo", "inProgress", "completed"];

  const filterTaskByTagName = (tag: string) => {
    copyTasks();
    taskTypes.forEach((category) => filterTasksByTag(category, tag));
  };

  const handleFilter = (handler: any) => {
    copyTasks();
    taskTypes.forEach(handler);
  };

  const handleTemp = () => {
    setActiveTab("reminders");
  };
  return (
    <div className="fixed h-screen pt-4 sm:static text-gray-400 flex-col w-72 px-5 bg-white border-r dark:bg-gray-900 dark:border-gray-700">
      <div className="flex flex-row ml-[-4px] sm:hidden ">
        <ProfileButton />
        <div className="ml-24">
          <LogoutButton />
        </div>
      </div>
      <hr className="border-t sm:hidden border-gray-300 my-4" />
      <nav className="flex-1 space-y-3 ">
        <ul className="menu text-base-content bg-gray-900">
          {/* Sidebar content here */}
          <li>
            <button
              onClick={handleAllTasks}
              className={`bold flex items-center w-full p-2 ${activeTab === "all" ? "bg-gray-700" : ""
                } text-gray-900 transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              <HomeOutlined className="text-lg" />
              <span className="ml-3">All Tasks</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => {
                handleFilter(setTodaysTasks);
                setActiveTab("todays");
              }}
              className={`bold flex items-center w-full p-2 ${activeTab === "todays" ? "bg-gray-700" : ""
                } text-gray-900 transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              <SnippetsOutlined className="text-lg" />
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
              className={`bold flex items-center w-full p-2 ${activeTab === "upcomingTasks" ? "bg-gray-700" : ""
                } text-gray-900 transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              <CalendarOutlined className="text-lg" />
              <span className="flex-1 ml-3 whitespace-nowrap">
                Upcoming Tasks
              </span>
            </button>
          </li>

          {/* Reminders */}
          <li>
            <button
              onClick={handleTemp}
              className={`bold flex items-center w-full p-2 ${activeTab === "reminders" ? "bg-gray-700" : ""
                } text-gray-900 transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              <BellOutlined className="text-lg" />
              <span className="flex-1 ml-3 whitespace-nowrap">Reminders</span>
            </button>
          </li>
        </ul>
        <div className="border border-gray-500 max-h-[500px] bg-gray-800 rounded-lg overflow-y-auto">
          {tags.map((tag, index) => (
            <div
              className="flex flex-row items-center justify-between mx-2 my-1"
              key={index}
            >
              <div
                onClick={() => {
                  filterTaskByTagName(tag);
                  setActiveTab(`${index}-${tag}`);
                }}
                className={`flex items-center h-10 cursor-pointer ${activeTab === `${index}-${tag}`
                  ? "text-cyan-500"
                  : "text-gray-300"
                  } transition duration-75 rounded-lg group  dark:hover:text-white`}
              >
                <TagOutlined style={{ marginRight: "5px" }} />
                {tag}
              </div>
              <div>
                <Popconfirm
                  placement="top"
                  title={deleteTagTitle}
                  description={deleteTagStr}
                  okText={
                    <span className="bg-blue-500 rounded-sm w-12">Yes</span>
                  }
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    onChildPopupInteraction(false);
                    handleDeleteTag(tag);
                  }}
                  onCancel={(e) => {
                    onChildPopupInteraction(false);
                    e?.stopPropagation();
                  }}
                  cancelText="No"
                  style={{ height: "200px" }}
                  overlayStyle={{ width: "250px" }}
                >
                  <DeleteOutlined
                    className="text-white hover:text-red-400 cursor-pointer"
                    onClick={(e) => {
                      onChildPopupInteraction(true);
                      e.stopPropagation();
                    }}
                  />
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
        {/* Add tag button */}
        <div className="tags-container">
          <AddTags />
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
