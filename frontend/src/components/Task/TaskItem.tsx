import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { TaskType, TasksProps } from "./Types/types";
import { taskAPI } from "../../ApiCalls";
import useTaskStore from "../../Zustand/taskStore";
import { ConfirmationDialog } from "../SmallComp/ConfirmationDialog/ConfirmationDialog";

const TaskItem = ({ task, handleDelete, handleTaskClick }: TasksProps) => {
  const {
    title,
    description,
    attatchments,
    status,
    done,
    dueDate,
    priority,
    _id,
    tag,
  } = task;

  const taskDate = new Date(dueDate);
  const currentDate = new Date();

  const redOrYellow = () => (taskDate < currentDate ? "red" : "yellow");
  const dateColor = task.done ? "green" : redOrYellow();
  const classNameDueDate = `text-xs ml-1 w-18 bg-${dateColor}-400 text-black font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-${dateColor}-400 dark:text-white border border-white-600  `;

  const updateTaskOrigStore = useTaskStore(
    (state) => state.updateTaskOrigStore
  );
  const updateTaskCopiedStore = useTaskStore(
    (state) => state.updateTaskCopiedStore
  );

  const toggleTaskDone = () => {
    task.done = !done;
    updateTask(_id, task);
  };

  const updateTask = (id: string, updatedTask: TaskType) => {
    taskAPI
      .updateTask(id, updatedTask)
      .then(() => {
        updateTaskOrigStore(status, id, updatedTask);
        updateTaskCopiedStore(status, id, updatedTask);
      })
      .catch((err) => {
        console.log("err in updating to done:", err);
      });
  };

  const handleDeleteFun = () => {
    handleDelete(task);
  };

  const convertToIndianTime = (date: string) => {
    const inputDate = new Date(date);

    const currentDate = new Date();

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

    const isCurrentWeek =
      inputDate >= currentWeekStart && inputDate <= currentWeekEnd;

    if (isCurrentWeek) {
      if (currentDate.getDay() === inputDate.getDay()) {
        return "Today";
      } else if (currentDate.getDay() + 1 === inputDate.getDay()) {
        return "Tommorrow";
      } else if (currentDate.getDay() - 1 === inputDate.getDay()) {
        return "Yesterday";
      }

      const weekDay = inputDate.toLocaleDateString("en-In", {
        weekday: "long",
      });
      return weekDay;
    } else {
      const formattedDate =
        inputDate.getFullYear() == currentDate.getFullYear()
          ? inputDate.toLocaleDateString("en-IN", {
              // year: "numeric",
              month: "long",
              day: "numeric",
            })
          : inputDate.toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
      return formattedDate;
    }
  };

  const indianTime = convertToIndianTime(dueDate);

  // handle due date change

  return (
    <div>
      <label
        style={{ cursor: "pointer" }}
        htmlFor="my_modal_6"
        onClick={() => handleTaskClick(task)}
      >
        <div className="font-thin w-full mb-2 overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 hover:bg-gray-700 ">
          {/* <img
            className="w-full h-48 mt-2"
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=320&q=80"
            alt="NIKE AIR"
          /> */}
          <div className="px-3">
            <div className="flex justify-between">
              <div className="w-36">
                <div className="mb-3">
                  {tag === "" ? (
                    ""
                  ) : (
                    <span className=" text-xxs text-center px-2 py-1 h-4 w-32  uppercase bg-blue-500 rounded-full dark:bg-blue-600 dark:text-white">
                      {tag}
                    </span>
                  )}
                </div>
                <h1 className="text-sm font-extralight text-gray-400   dark:text-gray-300">
                  {title}
                </h1>
              </div>
              <div>
                {priority == "High" && (
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-5 h-5 mt-2 text-red-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
                    ></path>
                  </svg>
                )}

                {priority == "Medium" && (
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-5 h-5 mt-2 text-yellow-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 9h16.5m-16.5 6.75h16.5"
                    ></path>
                  </svg>
                )}

                {priority == "Low" && (
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-5 h-5 mt-2 text-blue-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
                    ></path>
                  </svg>
                )}
              </div>
            </div>

            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description == null ||
              description.replace(/<[^>]*>/g, "") == "" ? (
                ""
              ) : (
                <div className="w-4 group">
                  <p className="group text-white  rounded ">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                      ></path>
                    </svg>
                  </p>

                  <p
                    className="
                    text-xs
                    absolute
                    h-6
                    w-42
                    p-1
                    ml-6
                    pb-3
                    border border-gray-100
                    bg-gray-200
                    text-black
                    rounded
                    hidden
                    group-hover:block"
                  >
                    This card has Description
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between ml-1 py-2 bg-transparent">
            {/* Due Date */}
            <button onClick={toggleTaskDone}>
              <span className={classNameDueDate}>
                {dateColor != "green" ? (
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    fill="none"
                    stroke="currentColor"
                    className=" w-3.5 h-3.5"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                )}
                <p className="ml-1">{indianTime}</p>
              </span>
            </button>

            {/* links badge */}
            <div className="flex flex-row ml-2">
              {attatchments.length ? (
                <>
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
                    {attatchments.length}
                  </span>
                </>
              ) : (
                ""
              )}
            </div>

            <ConfirmationDialog
              title="Do you want to delete this Task?"
              description="This will permanently delete
              Task"
              onConfirm={handleDeleteFun}
              svgPath="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </div>
        </div>
      </label>
    </div>
  );
};

export default TaskItem;
