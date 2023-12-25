import React, { useEffect, useState } from "react";
import useTaskStore from "../../../Zustand/taskStore";
import { TaskType } from "../../Task/Types/types";
import DatePicker from "react-datepicker";
import { taskAPI } from "../../../ApiCalls";
import useTagStore from "../../../Zustand/tagStore";
const Search = () => {
  const tasks = useTaskStore((state) => state.allTasks);
  const updateTaskOrigStore = useTaskStore(
    (state) => state.updateTaskOrigStore
  );
  const updateTaskCopiedStore = useTaskStore(
    (state) => state.updateTaskCopiedStore
  );
  const tags = useTagStore((state) => state.tags);

  const [showResult, setShowResult] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [modalData, setModalData] = useState<TaskType>({
    _id: "",
    title: "",
    description: "",
    dueDate: "",
    status: "todo",
    priority: "",
    tag: "",
    attatchments: [],
    collaborators: [],
    startDate: "",
    user: "",
    done: false,
  });
  const containerRef = React.createRef<HTMLDivElement>();

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(inputValue.toLowerCase())
  );

  // when clicked on task set editedTask value to currentTask
  const handleTaskClick = (task: TaskType) => {
    setModalData(task);
  };

  // handle input change (title,priority, status)
  const handleInputChange = (e: { target: { name: string; value: any } }) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  // handle Date change
  const handleDate = (date: Date) => {
    setModalData({ ...modalData, dueDate: date.toString() });
  };

  const handleFormSubmit = () => {
    taskAPI
      .updateTask(modalData._id, modalData)
      .then(() => {
        updateTaskOrigStore(modalData.status, modalData._id, modalData);
        updateTaskCopiedStore(modalData.status, modalData._id, modalData);
      })
      .catch((err) => {
        console.log("Error in updating task:", err);
      });
  };

  // When the component is mounted
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResult(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <li>
        <div className="relative " ref={containerRef}>
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
            onChange={(e) => {
              setInputValue(e.target.value);
              if (e.target.value) {
                setShowResult(true);
              } else {
                setShowResult(false);
              }
            }}
            className="w-full py-1.5 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            placeholder="Search Task"
          />
        </div>
        {showResult && inputValue && (
          <div className="absolute card w-48 bg-base-100 shadow-xl">
            <div className="card-body">
              {filteredTasks.length != 0 ? (
                filteredTasks.map((task, _id) => (
                  <label
                    key={_id}
                    style={{ cursor: "pointer" }}
                    htmlFor="my_modal_6"
                    onClick={() => handleTaskClick(task)}
                  >
                    {task.title}
                  </label>
                ))
              ) : (
                <p>No Task Found</p>
              )}
            </div>
          </div>
        )}

        {/* new modal */}
        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my_modal_6" className="modal-toggle" />

        <div className="modal">
          <div className="modal-box bg-gray-400 text-black">
            <div>
              <form className="text-sm" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-2">
                  <h1 className="text-gray-800 text-xl mb-4">Edit Task</h1>

                  <label
                    htmlFor="my_modal_6"
                    className="btn bg-gray-600 w-16 ml-44 h-2"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </label>
                </div>
                <div className="xt-row xt-row-x-6 xt-row-y-4">
                  <div className="w-full">
                    <div className="modal-action"></div>

                    <label className="block mb-3 font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      required
                      type="text"
                      id="title"
                      name="title"
                      value={modalData.title}
                      className="block w-full rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                      aria-label="Input"
                      placeholder="Input"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="w-full mt-4">
                    <label className="block mb-3 font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="block w-full h-20 max-h-48 rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none resize-vertical"
                      aria-label="Textarea"
                      placeholder="Textarea"
                      value={modalData.description}
                      onChange={handleInputChange}
                    ></textarea>
                    {/* <ReactQuill
                        className="block  w-full rounded-md   text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                        value={modalData.description}
                        onChange={handleDescription}
                        style={{
                          height: " 180px",
                          maxHeight: "180px",
                          overflow: "auto",
                        }}
                      /> */}
                  </div>

                  {/* select tag */}
                  <div className="w-full mt-4">
                    <label className="block mb-3 font-medium text-gray-700">
                      Tag
                    </label>
                    <select
                      id="tag"
                      name="tag"
                      className="block w-full xt-select rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                      aria-label="Select"
                      value={modalData.tag == "" ? "noTag" : modalData.tag}
                      onChange={handleInputChange}
                    >
                      <option value="noTag" className="bg-red-400">
                        No tag
                      </option>

                      {tags.map((tag, index) => (
                        <option key={index} value={tag}>
                          {tag}
                        </option>
                      ))}
                      {/* <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option> */}
                    </select>
                  </div>
                  <div className="w-full mt-4">
                    <label className="block mb-3 font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="block w-full xt-select rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                      aria-label="Select"
                      value={modalData.status}
                      onChange={handleInputChange}
                    >
                      {/* <option selected value="">
                        Select an option
                      </option> */}
                      <option value="todo">Todo</option>
                      <option value="inProgress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="w-full mt-4">
                    <label className="block mb-3 font-medium text-gray-700">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      className="block w-full xt-select rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                      aria-label="Select"
                      value={modalData.priority}
                      onChange={handleInputChange}
                    >
                      {/* <option selected value="">
                        Select an option
                      </option> */}
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  {/* Date picker */}
                  <div className="pt-3">
                    <label className="block mb-3 font-medium text-gray-700">
                      Due Date
                    </label>
                    <DatePicker
                      className="block w-full rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                      selected={
                        modalData.dueDate == ""
                          ? new Date()
                          : new Date(modalData.dueDate)
                      }
                      onChange={handleDate}
                    />
                  </div>

                  {/* submit button */}
                  <div className="w-full mt-3">
                    <button
                      type="submit"
                      className="xt-button py-2.5 px-3.5 text-sm rounded-md font-medium leading-snug tracking-wider uppercase text-gray-200 bg-primary-500 transition hover:text-gray-200 hover:bg-primary-600 active:text-gray-200 active:bg-primary-700 on:text-gray-200 on:bg-primary-600"
                    >
                      submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </li>
    </div>
  );
};

export default Search;
