import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { TasksProps } from "./Types/types";
import { updateTaskApi } from "../../ApiCalls";
import useTaskStore from "../../Zustand/taskStore";

const TaskItem = ({ task, handleDelete, handleTaskClick }: TasksProps) => {
  // if it's done then green otherwise based on dueDate color will change into yellow or red.
  const taskDate = new Date(task.dueDate);
  const currentDate = new Date();

  // putting selected color into the class
  function redOrYellow() {
    return taskDate < currentDate ? "red" : "yellow";
  }
  const dateColor = task.done ? "green" : redOrYellow();
  const classNameDueDate = `text-xs ml-1 w-18 bg-${dateColor}-400 text-black font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-${dateColor}-400 dark:text-white border border-white-600  `;

  // After clicking button it will red or green
  const updateTaskOrigStore = useTaskStore(
    (state) => state.updateTaskOrigStore
  );
  const updateTaskCopiedStore = useTaskStore(
    (state) => state.updateTaskCopiedStore
  );

  const hanldeDueDateChange = () => {
    if (dateColor != "green") {
      task.done = true;
      updateTaskApi(task._id, task)
        .then(() => {
          // updating store
          updateTaskOrigStore(task.status, task._id, task);
          updateTaskCopiedStore(task.status, task._id, task);
        })
        .catch((err) => {
          console.log("err in updating to done:", err);
        });
    } else {
      task.done = false;
      updateTaskApi(task._id, task)
        .then(() => {
          // updating store
          updateTaskOrigStore(task.status, task._id, task);
          updateTaskCopiedStore(task.status, task._id, task);
        })
        .catch((err) => {
          console.log("err in updating to done:", err);
        });
    }
  };

  // on delete
  const handleDeleteFun = () => {
    handleDelete(task);
  };

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
      } else if (currentDate.getDay() - 1 === inputDate.getDay()) {
        return "Yesterday";
      }
      // Display the week day if the date is in the current week

      const weekDay = inputDate.toLocaleDateString("en-In", {
        weekday: "long",
      });
      return weekDay;
    } else {
      // Display the full date if it's not in the current week

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

  // change time zone into indian
  const date = task.dueDate;
  const indianTime = convertToIndianTime(date);

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
                  {task.tag === "" ? (
                    ""
                  ) : (
                    <span className=" text-xxs text-center px-2 py-1 h-4 w-32  uppercase bg-blue-500 rounded-full dark:bg-blue-600 dark:text-white">
                      {task.tag}
                    </span>
                  )}
                </div>
                <h1 className="text-sm font-extralight text-gray-400   dark:text-gray-300">
                  {task.title}
                </h1>
              </div>
            </div>

            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {task.description == null ||
              task.description.replace(/<[^>]*>/g, "") == "" ? (
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
            <button onClick={hanldeDueDateChange}>
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
              {task.attatchments.length ? (
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
                    {task.attatchments.length}
                  </span>
                </>
              ) : (
                ""
              )}
            </div>

            <AlertDialog.Root>
              <AlertDialog.Trigger asChild>
                {/* delete button */}
                <button className="font-light mr-2 mb-1 px-1 py-1 text-xs  text-gray-100 uppercase transition-colors duration-300 transform bg-red-600 rounded hover:bg-red-800 focus:bg-red-800 focus:outline-none">
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
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    ></path>
                  </svg>
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
      </label>
    </div>
  );
};

export default TaskItem;
