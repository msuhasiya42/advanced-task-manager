import React, { useState } from "react";
import useTaskStore from "../../Zustand/taskStore";
import AddTags from "../Add Tags/AddTags";
import useTagStore from "../../Zustand/tagStore";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { updateUserApi } from "../../ApiCalls";
import useAuthStore from "../../Zustand/authStore";

const SideBar = () => {
  const [err, setErr] = useState(false);
  // store
  const tags = useTagStore((state) => state.tags);
  const deleteTag = useTagStore((state) => state.deleteTag);
  const originalTasks = useTaskStore((state) => state.originalTasks);
  const copyTasks = useTaskStore((state) => state.copyTasks);
  const setTodaysTasks = useTaskStore((state) => state.setTodaysTasks);
  const setUpcomingTasks = useTaskStore((state) => state.setUpcomingTasks);
  const filterTasksByTag = useTaskStore((state) => state.filterTasksByTag);
  const filterTaskByHavingTagFun = useTaskStore(
    (state) => state.filterTaskByHavingTagFun
  );

  // All tasks
  const handleAllTasks = () => {
    copyTasks(originalTasks);
  };

  // toast msg remove
  const disAppearToast = () => {
    setErr(false);
  };

  // delete tag
  const userId = useAuthStore((state) => state.user.id);

  const handleDelete = (tag) => {
    updateUserApi(userId, "delete", tag)
      .then((response) => {
        // @Remember
        // add tag in store
        deleteTag(tag);
        console.log(response);
      })
      .catch((error) => {
        // @Todo
        // Handle errors
        // handling internal server err
        // is remaining : status code : 500
        console.error(error);
        setErr(true);
        setTimeout(disAppearToast, 3000);
      });
    deleteTag(tag);
  };

  // filter task where today is dueDate
  const handleTodaysTasks = () => {
    // first get orig store into copy store
    copyTasks(originalTasks);
    // then apply filter on copied store
    setTodaysTasks("todo");
    setTodaysTasks("inProgress");
    setTodaysTasks("completed");
  };

  // Upcoming tasks
  const handleUpcomingTasks = () => {
    copyTasks(originalTasks);
    // then apply filter on copied store
    setUpcomingTasks("todo");
    setUpcomingTasks("inProgress");
    setUpcomingTasks("completed");
  };

  // Filter task by tag name
  const filterTaskByTagName = (tag) => {
    copyTasks(originalTasks);
    // then apply filter on copied store
    filterTasksByTag("todo", tag);
    filterTasksByTag("inProgress", tag);
    filterTasksByTag("completed", tag);
  };

  // Filter tasks which has Tags
  const filterTaskByHavingTag = () => {
    copyTasks(originalTasks);
    // then apply filter on copied store
    filterTaskByHavingTagFun("todo");
    filterTaskByHavingTagFun("inProgress");
    filterTaskByHavingTagFun("completed");
  };

  const handleTemp = () => {
    // some code
  };
  return (
    <>
      {/* server issue: task not added */}
      {err && (
        <div className="toast">
          <div className=" ">
            <span>
              <div className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex items-center justify-center w-12 bg-red-500">
                  <svg
                    className="w-6 h-6 text-white fill-current"
                    viewBox="0 0 40 40"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                  </svg>
                </div>

                <div className="px-4 py-2 -mx-3">
                  <div className="mx-3">
                    <span className="font-semibold text-red-500 dark:text-red-400">
                      Error in deletion
                    </span>
                  </div>
                </div>
              </div>
            </span>
          </div>
        </div>
      )}
      <aside className="flex flex-col h-screen w-64  px-5 mt-1  bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav className="flex-1  space-y-3 ">
            <div className="relative ">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="w-5 h-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </span>

              <input
                type="text"
                className="w-full py-1.5 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                placeholder="Search"
              />
            </div>
            <ul className="menu h-fit text-base-content bg-gray-900">
              {/* Sidebar content here */}
              <li>
                <button className="bold flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
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
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                  <span className="ml-3">Journaling</span>
                </button>
              </li>
              <li>
                <button
                  onClick={handleAllTasks}
                  className="bold flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
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
                  onClick={handleTodaysTasks}
                  className="bold flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
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
                  onClick={handleUpcomingTasks}
                  className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
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
                  className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg  group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
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
                <button
                  type="button"
                  onClick={filterTaskByHavingTag}
                  className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
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
                    Tasks with Tags
                  </span>
                </button>
                <ul className=" space-y-1">
                  {tags.map((tag, index) => (
                    <li key={index}>
                      <a
                        onClick={() => filterTaskByTagName(tag)}
                        className="grid grid-cols-2 h-10 w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-6 group hover:bg-gray-100 hover:text-base dark:text-white dark:hover:bg-gray-700"
                      >
                        #{tag}
                        <AlertDialog.Root>
                          <AlertDialog.Trigger asChild>
                            <button className="ml-12">
                              <svg
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                className="flex-shrink-0 w-5 h-5 text-gray-900 transition duration-75 dark: group-hover:text-gray-900 dark:group-hover:text-white"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                ></path>
                              </svg>
                            </button>
                          </AlertDialog.Trigger>
                          <AlertDialog.Portal>
                            <AlertDialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
                            <AlertDialog.Content className="  data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                              <AlertDialog.Title className="text-black text-mauve12 m-0 text-[17px] font-medium">
                                Do you want to delete this tag?
                              </AlertDialog.Title>
                              <AlertDialog.Description className="text-gray-600 text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
                                Tag will be removed from all the tasks linked to
                                it.
                              </AlertDialog.Description>
                              <div className="flex justify-end gap-[25px]">
                                <AlertDialog.Cancel asChild>
                                  <button className="text-mauve11 text-gray-500  bg-gray-200 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium ">
                                    Cancel
                                  </button>
                                </AlertDialog.Cancel>
                                <AlertDialog.Action asChild>
                                  <button
                                    onClick={() => handleDelete(tag)}
                                    className=" text-red-600 bg-red-200 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                                  >
                                    Yes, delete
                                  </button>
                                </AlertDialog.Action>
                              </div>
                            </AlertDialog.Content>
                          </AlertDialog.Portal>
                        </AlertDialog.Root>
                        {/* <button
                          className="ml-8"
                          onClick={() => handleDelete(tag)}
                        >
                          <svg
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            className="flex-shrink-0 w-5 h-5 text-gray-900 transition duration-75 dark: group-hover:text-gray-900 dark:group-hover:text-white"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            ></path>
                          </svg>
                        </button> */}
                      </a>
                    </li>
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
      </aside>
    </>
  );
};

export default SideBar;
