import React, { useState } from "react";
import useTaskStore from "../../Zustand/taskStore";
import useAuthStore from "../../Zustand/authStore";
import { userAPI } from "../../ApiCalls";
import AddTags from "../Add Tags/AddTags";
import { Toast } from "../SmallComp/ToastMessage/ToastMessage";
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
const SideBar = () => {
  const [err, setErr] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { tags, deleteTag } = useTaskStore();
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
      <div className="flex text-gray-400 flex-col w-72 px-5 mt-1  bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
        <div className="justify-between  mt-4">
          <nav className="flex-1  space-y-3 ">
            <ul className="menu text-base-content bg-gray-900">
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
                    className={`flex items-center h-10 cursor-pointer ${
                      activeTab === `${index}-${tag}` ? "text-cyan-500" : ""
                    } transition duration-75 rounded-lg group text-gray-300 dark:hover:text-white`}
                  >
                    <TagOutlined style={{ marginRight: "5px" }} />
                    {tag}
                  </div>
                  <div>
                    <Popconfirm
                      placement="bottomLeft"
                      title={deleteTagTitle}
                      description={deleteTagStr}
                      okText={
                        <span className="bg-blue-500 rounded-sm">Yes</span>
                      }
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        handleDeleteTag(tag);
                      }}
                      onCancel={(e) => {
                        e?.stopPropagation();
                      }}
                      cancelText="No"
                      style={{ height: "200px" }}
                    >
                      <DeleteOutlined
                        className="text-white hover:text-red-400 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
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
      </div>
    </>
  );
};

export default SideBar;
