import React from "react";
import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

const TaskItem = ({ task, handleDelete, handleTaskClick }) => {
  const [editedTask, setEditedTask] = useState(task);

  // due date red if it's over due otherwise blue
  const taskDate = new Date(task.dueDate).getDay();
  const currentDate = new Date().getDay();

  const className =
    taskDate < currentDate
      ? "text-xs ml-2 bg-red-100 text-red-800  font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400"
      : "text-xs ml-2 bg-green-400 text-black  font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-green-400 dark:text-black border border-green-400";

  // handle input change
  const handleInputChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  // on delete
  const handleDeleteFun = () => {
    handleDelete(task);
  };

  // change time zone into indian
  const date = task.dueDate;

  // @Remember
  const convertToIndianTime = (date) => {
    // Convert the input date string to a Date object
    const inputDate = new Date(date);

    // Get the current date and time
    const currentDate = new Date();

    // Calculate the start and end dates of the current week
    const currentWeekStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    );

    const currentWeekEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + (6 - currentDate.getDay())
    );

    // Check if the input date falls within the current week
    const isCurrentWeek =
      inputDate >= currentWeekStart && inputDate <= currentWeekEnd;

    if (isCurrentWeek) {
      if (currentDate.getDay() === inputDate.getDay()) {
        return "Today";
      } else if (currentDate.getDay() + 1 === inputDate.getDay()) {
        return "Tommorrow";
      }
      // Display the week day if the date is in the current week
      const options = { weekday: "long" };
      // @ts-ignore
      const weekDay = inputDate.toLocaleDateString("en-In", options);
      return weekDay;
    } else {
      // Display the full date if it's not in the current week
      const options = { year: "numeric", month: "long", day: "numeric" };
      // @ts-ignore
      const formattedDate = inputDate.toLocaleDateString("en-IN", options);
      return formattedDate;
    }
  };

  const indianTime = convertToIndianTime(date);

  return (
    <div>
      <div className="w-full mb-2 overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 hover:bg-gray-700 ">
        <div className="px-4 py-2">
          <div className="flex justify-between">
            <h1 className="text-sm font-bold text-gray-400   dark:text-gray-300">
              {task.title}
            </h1>

            {task.tags.length !== 0 ? (
              <span className="px-3 py-2 text-xs text-blue-800 uppercase bg-blue-500 rounded-full dark:bg-blue-300 dark:text-blue-900">
                {task.tags[0]}
              </span>
            ) : (
              <span className="px-3 py-2 text-xs text-blue-800 uppercase bg-blue-500 rounded-full dark:bg-blue-300 dark:text-blue-900">
                Tag
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {task.description}
          </p>
        </div>

        {/* <img
            className="object-cover w-full h-48 mt-2"
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=320&q=80"
            alt="NIKE AIR"
          /> */}

        <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
          <label
            // @ts-ignore
            htmlFor="my_modal_6"
            onClick={() => handleTaskClick(task)}
            className="px-2 py-1 text-xs font-semibold cursor-pointer text-gray-900 uppercase transition-colors duration-300 transform bg-gray-200 rounded hover:bg-gray-200 focus:bg-gray-400 focus:outline-none"
          >
            Edit
          </label>

          {/* Due Date */}
          <span className={className}>
            <svg
              aria-hidden="true"
              className=" w-3 h-3 "
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              ></path>
            </svg>
            {indianTime}
          </span>
          {/* links badge */}
          {task.attatchments.length !== 0 ? (
            <div className="flex flex-row ml-2">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="w-4 h-4 mt-1  ml-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                ></path>
              </svg>
              <span
                className=" mr-3 text-left whitespace-nowrap"
                // sidebar-toggle-item
              >
                {task.attatchments.length}
              </span>
            </div>
          ) : (
            <div className="flex flex-row ml-2">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="w-4 h-4 mt-1  "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                ></path>
              </svg>
              <span
                className=" mr-3 text-left whitespace-nowrap"
                // sidebar-toggle-item
              >
                2
              </span>
            </div>
          )}

          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <button className="px-2 py-1 text-xs font-semibold text-gray-300 uppercase transition-colors duration-300 transform bg-red-600 rounded hover:bg-red-800 focus:bg-red-800 focus:outline-none">
                Delete
              </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
              <AlertDialog.Content className="  data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <AlertDialog.Title className="text-black text-mauve12 m-0 text-[17px] font-medium">
                  Do you want to delete this item?
                </AlertDialog.Title>
                <AlertDialog.Description className="text-gray-600 text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
                  This action cannot be undone. This will permanently delete
                  Task
                </AlertDialog.Description>
                <div className="flex justify-end gap-[25px]">
                  <AlertDialog.Cancel asChild>
                    <button className="text-mauve11 text-gray-500  bg-gray-200 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium ">
                      Cancel
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      onClick={handleDeleteFun}
                      className=" text-red-600 bg-red-200 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                    >
                      Yes, delete
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
