import React, { useState } from "react";
import useTaskStore from "../../Zustand/taskStore";
import useTagStore from "../../Zustand/tagStore";
import useAuthStore from "../../Zustand/authStore";

import { userAPI } from "../../ApiCalls";
import AddTags from "../Add Tags/AddTags";
import { Toast } from "../SmallComp/ToastMessage/ToastMessage";
import { TaskCategory } from "../Task/Types/types";
import { ConfirmationDialog } from "../SmallComp/ConfirmationDialog/ConfirmationDialog";
import { message } from "antd";
import {
  BellOutlined,
  CalendarOutlined,
  HomeOutlined,
  SnippetsOutlined,
  TagOutlined,
} from "@ant-design/icons";
const SideBar = () => {
  const [err, setErr] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { tags, deleteTag } = useTagStore();
  const {
    copyTasks,
    setTodaysTasks,
    setUpcomingTasks,
    filterTasksByTag,
    removeTagFromTasks,
  } = useTaskStore();

  const handleAllTasks = () => {
    copyTasks();
    setActiveTab("all");
  };
  const userId = useAuthStore((state) => state?.user?.userId);

  const handleDeleteTag = (tag: string) => {
    userAPI
      .updateUser(userId, "delete", tag)
      .then(() => {
        void message.success("Tag Deleted", 1.5);
        deleteTag(tag);
        removeTagFromTasks(tag);
      })
      .catch(() => {
        setErr(true);
        setTimeout(() => setErr(false), 3000);
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
    <>
      {/* server issue: task not added */}
      {err && <Toast type="error" message="Error in deletion" />}
      {/* side bar */}
      <div className="flex text-gray-400 flex-col h-screen w-64  px-5 mt-1  bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
        <div className="justify-between  mt-4">
          <nav className="flex-1  space-y-3 ">
            <ul className="menu h-fit text-base-content bg-gray-900">
              {/* Sidebar content here */}
              <li>
                <button
                  onClick={handleAllTasks}
                  className={`bold flex items-center w-full p-2 ${
                    activeTab === "all" ? "bg-gray-700" : ""
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
                  className={`bold flex items-center w-full p-2 ${
                    activeTab === "todays" ? "bg-gray-700" : ""
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
                  className={`bold flex items-center w-full p-2 ${
                    activeTab === "upcomingTasks" ? "bg-gray-700" : ""
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
                  className={`bold flex items-center w-full p-2 ${
                    activeTab === "reminders" ? "bg-gray-700" : ""
                  } text-gray-900 transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white`}
                >
                  <BellOutlined className="text-lg" />
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Reminders
                  </span>
                </button>
              </li>

              <li>
                <ul className="border mt-3 border-gray-500 max-h-[350px] bg-gray-800 rounded-lg overflow-y-auto">
                  {tags.map((tag, index) => (
                    <div className=" grid grid-cols-2 gap-28 " key={index}>
                      <li>
                        <a
                          onClick={() => {
                            filterTaskByTagName(tag);
                            setActiveTab(`${index}-${tag}`);
                          }}
                          style={{ width: "135px" }}
                          className={`h-10 p-2 text-gray-900 ${
                            activeTab === `${index}-${tag}` ? "bg-gray-700" : ""
                          } transition duration-75 rounded-lg pl-2 group dark:text-gray-300 my-1 dark:hover:text-white`}
                        >
                          <TagOutlined />
                          {tag}
                        </a>
                      </li>
                      <ConfirmationDialog
                        title="Do you want to delete this tag?"
                        description="Tag will be removed from all the tasks linked to it."
                        onConfirm={() => handleDeleteTag(tag)}
                        svgPath="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </div>
                  ))}
                </ul>
              </li>
            </ul>
            {/* Add tag button */}
            <div className="ml-6">
              <AddTags />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideBar;
