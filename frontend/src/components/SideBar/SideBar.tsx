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
const SideBar = () => {
  const [err, setErr] = useState(false);

  const { tags, deleteTag } = useTagStore();
  const {
    copyTasks,
    setTodaysTasks,
    setUpcomingTasks,
    filterTasksByTag,
    filterTaskByHavingTagFun,
    removeTagFromTasks,
  } = useTaskStore();

  const handleAllTasks = () => copyTasks();
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
    // some code
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
                  className="bold flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                  <span className="ml-3">All Tasks</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleFilter(setTodaysTasks)}
                  className="bold flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className=" w-5 h-5 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    ></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Todays Tasks
                  </span>
                </button>
              </li>

              {/* upcoming tasks */}
              <li>
                <button
                  onClick={() => handleFilter(setUpcomingTasks)}
                  className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white "
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className=" w-5 h-5 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                    ></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Upcoming Tasks
                  </span>
                </button>
              </li>

              {/* Reminders */}
              <li>
                <button
                  onClick={handleTemp}
                  className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className=" w-5 h-5 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                    ></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Reminders
                  </span>
                </button>
              </li>

              {/* tags */}
              <li>
                {" "}
                <button
                  type="button"
                  onClick={() => handleFilter(filterTaskByHavingTagFun)}
                  className="flex items-center w-full mb-3 p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className=" w-5 h-5 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"
                    ></path>
                  </svg>
                  <span className="flex-1 ml-3 text-left whitespace-nowrap">
                    Filter By Tags
                  </span>
                </button>
              </li>
              <li>
                <ul className="border border-gray-500 max-h-[200px] bg-gray-800 rounded-lg overflow-y-auto">
                  {tags.map((tag, index) => (
                    <div className=" grid grid-cols-2 gap-28 " key={index}>
                      <li>
                        <a
                          onClick={() => filterTaskByTagName(tag)}
                          style={{ width: "135px" }}
                          className=" h-10 p-2 text-gray-900 transition duration-75 rounded-lg pl-2 group dark:text-gray-300 my-1 dark:hover:text-white"
                        >
                          #{tag}
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
