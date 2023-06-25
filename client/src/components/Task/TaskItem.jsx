import React from "react";
import { useState } from "react";
const TaskItem = ({ task, handleDelete, handleTaskClick }) => {
  const [editedTask, setEditedTask] = useState(task);

  // due date red if it's over due otherwise blue
  const taskDate = new Date(task.dueDate).getDay();
  const currentDate = new Date().getDay();

  const className =
    taskDate < currentDate
      ? "text-xs bg-red-100 text-red-800  font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400"
      : "text-xs bg-blue-100 text-blue-800  font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400";

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
      <li className="mt-2 mb-4">
        {/* task info card */}
        <div className="w-full bg-white border h-full  border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="p-2">
            <h5 className="mb-2 text-sm text-left font-bold tracking-tight text-gray-900 dark:text-white">
              {task.title}
            </h5>

            <p className="h-full mb-3 text-xs text-left font-normal text-gray-700 dark:text-gray-400">
              {task.description}
            </p>

            {/* edit button and modal */}
            <div>
              <div className="flex flex-row justify-start">
                <div className="mb-4 ">
                  {/* edit button */}
                  <div>
                    <label
                      // @ts-ignore
                      htmlFor="my_modal_6"
                      onClick={() => handleTaskClick(task)}
                      className="text-xs mr-4  w-12 bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-3 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                    >
                      Edit
                    </label>
                    {/* Delete button */}
                    <button
                      onClick={handleDeleteFun}
                      //   data-modal-target="task-modal"
                      //   data-modal-toggle="task-modal"
                      className="h-7  text-xs mr-2  w-16 bg-red-600 hover:bg-red-400 text-white font-bold py-1  border-b-4 border-red-800 hover:border-red-500 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/*  date and attatchment and user icons */}
              <div className="flex flex-row justify-start">
                <div className="ml-2">
                  {task.tags.length !== 0 ? (
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                      #{task.tags[0]}
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                {/* due date badge */}
                <div className="flex ml-4">
                  <span className={className}>
                    <svg
                      aria-hidden="true"
                      className=" w-3 h-3 mr-1"
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
                </div>

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
                  ""
                )}

                {/* members profile icons */}
                <div className="flex -space-x-3 ml-4  h-1 justify-end ">
                  <img
                    className="w-6 h-6 border-2 border-white rounded-full dark:border-gray-800"
                    src="https://cdn.pixabay.com/photo/2021/02/12/07/03/icon-6007530_640.png"
                    alt=""
                  />
                  <img
                    className="w-6 h-6 border-2 border-white rounded-full dark:border-gray-800"
                    src="https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png"
                    alt=""
                  />
                  <img
                    className="w-6 h-6 border-2 border-white rounded-full dark:border-gray-800"
                    src="https://cdn-icons-png.flaticon.com/512/147/147144.png?w=360"
                    alt=""
                  />
                  <a
                    className="w-6 h-6 flex items-center justify-center text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                    href="/show-member"
                  >
                    +2
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </div>
  );
};

export default TaskItem;
