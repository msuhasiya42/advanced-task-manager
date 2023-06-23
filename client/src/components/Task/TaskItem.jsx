import React from "react";
import { useState } from "react";
import useTaskStore from "../../Zustand/taskStore";
const TaskItem = ({ task, handleUpdate, handleDelete }) => {
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
    console.log(e.target.name, e.target.value);
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  // on update
  const handleFormSubmit = () => {
    console.log(task._id);
    handleUpdate(task._id, editedTask);
  };

  // using delete from store
  // on delete
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const handleDeleteFun = () => {
    deleteTask(task.status, task._id);
    handleDelete(task._id, task.status);
  };

  // change time zone into indian
  const date = task.dueDate;

  // @Remember
  const convertToIndianTime = (date) => {
    // new logic
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
      {/* <button
    data-modal-target="task-modal"
    data-modal-toggle="task-modal"
    href="/task-details"
    className="w-full"
  > */}
      <li className="mt-2">
        {/* task info card */}
        <div className="w-full bg-white border h-full  border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          {/* <img
      className="rounded-t-lg h-10 w-full"
      src="https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?q=10&h=200"
      alt=""
    /> */}
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
                    <button
                      data-modal-target="task-modal"
                      data-modal-toggle="task-modal"
                      className="text-xs mr-4  w-12 bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-3 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                    >
                      Edit
                    </button>
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

                  {/* modal */}
                  {/* <!-- Main modal --> */}
                  <div
                    id="task-modal"
                    aria-hidden="true"
                    className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
                  >
                    <div className="relative w-full max-w-md max-h-full">
                      {/* <!-- Modal content --> */}
                      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button
                          type="button"
                          className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                          data-modal-hide="task-modal"
                        >
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                        <div className="px-6 py-6 lg:px-8">
                          <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                            Add Task
                          </h3>

                          {/* form to fill task details */}
                          <form
                            className="space-y-6"
                            action="#"
                            onSubmit={handleFormSubmit}
                          >
                            <div>
                              <label
                                htmlFor="title"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Title
                              </label>
                              <input
                                type="text"
                                name="title"
                                id="title"
                                value={editedTask.title}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Ex: Cleaning Desk"
                                required
                              />
                            </div>

                            {/* description */}
                            <div>
                              <label
                                htmlFor="description"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Description
                              </label>
                              <textarea
                                id="description"
                                name="description"
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Write About task here..."
                                value={editedTask.description}
                                onChange={handleInputChange}
                              ></textarea>
                            </div>

                            {/* priority */}
                            <div>
                              <label
                                htmlFor="priority"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Priority
                              </label>
                              <select
                                id="priority"
                                name="priority"
                                value={editedTask.priority}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                              </select>
                            </div>

                            {/* status */}
                            <div>
                              <label
                                htmlFor="status"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Status
                              </label>
                              <select
                                id="status"
                                name="status"
                                value={editedTask.status}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              >
                                <option value="Todo">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </div>

                            {/* attachments */}
                            <div>
                              <label
                                htmlFor="countries"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Attatchments
                              </label>
                              <input
                                type="text"
                                name="attachments"
                                id="attachments"
                                value={editedTask.attatchments}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="http://attatchmentsLink.io"
                              />
                            </div>

                            {/* Date picker */}

                            {/* <div>
<DatePicker
selected={selectedDate}
onChange={handleDateChange}
dateFormat="yyyy-MM-dd"
placeholderText="Select a date"
/>
</div> */}
                            {/* <div className="relative max-w-sm">
<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
<svg
  aria-hidden="true"
  className="w-5 h-5 text-gray-500 dark:text-gray-400"
  fill="currentColor"
  viewBox="0 0 20 20"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fillRule="evenodd"
    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
    clipRule="evenodd"
  ></path>
</svg>
</div>
<input
datepicker
type="text"
className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
placeholder="Select date"
/>
</div> */}

                            <button
                              type="submit"
                              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                              Save
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* modal end */}
                </div>
                {/* modal end */}
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
