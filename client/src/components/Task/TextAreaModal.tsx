import React, { useEffect, useRef, useState } from "react";
import { createTask } from "../../ApiCalls";
import useTaskStore from "../../Zustand/taskStore";
import useAuthStore from "../../Zustand/authStore";

interface StatusType {
  status: string;
}

const TextAreaModal = ({ status }: StatusType) => {
  const [showTextArea, setShowTextArea] = useState(false);
  const [task, setTask] = useState("");
  const [taskCreated, setTaskCreated] = useState(false);
  const [err, setErr] = useState(false);
  const user = useAuthStore((state) => state.user.id);

  // using add task from store
  const addTaskOrigStore = useTaskStore((state) => state.addTaskOrigStore);
  const addTaskCopiedStore = useTaskStore((state) => state.addTaskCopiedStore);

  // hooks
  // @remember
  const textRef = React.useRef<HTMLInputElement>(null);

  // show/hide textArea
  const handleClick = () => {
    setShowTextArea(!showTextArea);
  };

  // when user saves task
  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform any necessary actions with the task name

    // toast msg remove
    const disAppearToast = () => {
      setTaskCreated(false);
    };

    // creat task api
    createTask(task, status, user)
      .then((response) => {
        // Handle the API response

        console.log(response.data.task);
        // @Remember
        const newTask = response.data.task;
        addTaskOrigStore(status, newTask);
        addTaskCopiedStore(status, newTask);
        setTaskCreated(true);
        setTimeout(disAppearToast, 3000);
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

    // Reset the state and hide the text area
    setTask("");
    setShowTextArea(false);
  };

  // update task title
  const updateTitle = (event) => {
    setTask(event.target.value);
  };

  // useEffect
  useEffect(() => {
    if (showTextArea) {
      // @Remember: useRef used here because we are hiding
      // and showing textArea
      if (textRef.current != null) {
        // 👉️ TypeScript knows that ref is not null here
        textRef.current.focus();
      }
    }
  }, [showTextArea]);

  return (
    <div>
      <div>
        <button
          onClick={handleClick}
          //   data-modal-target="task-modal"
          //   data-modal-toggle="task-modal"
          className="mb-3 w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-xl"
        >
          Add Card
        </button>
      </div>
      {/* task Added msg */}
      {taskCreated && (
        <div className="toast bg-transparent">
          <div className=" bg-transparent">
            <div className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-700">
              <div className="flex items-center justify-center w-12 bg-emerald-500">
                <svg
                  className="w-6 h-6 text-white fill-current"
                  viewBox="0 0 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                </svg>
              </div>

              <div className="px-4 py-2 -mx-3">
                <div className="mx-3">
                  <span className="font-semibold text-emerald-500 dark:text-emerald-400">
                    Task Added
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-200"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                      Error
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-200">
                      Task Not added
                    </p>
                  </div>
                </div>
              </div>
            </span>
          </div>
        </div>
      )}
      {showTextArea && (
        <form onSubmit={handleSubmit}>
          <div className="w-full mb-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            {/* <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600"></div> */}
            <div className="px-4  bg-white rounded-lg dark:bg-gray-800">
              <input
                ref={textRef}
                onChange={updateTitle}
                id="task"
                type="text"
                className="block w-full px-2 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write about task..."
                required
              ></input>
            </div>
          </div>

          {/* Add card button */}
          <button
            type="submit"
            className="mb-5 inline-flex items-center px-5 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Add Card
          </button>
          <button
            type="button"
            onClick={handleClick}
            className="ml-2 text-gray-900 bg-white border px-5 py-2 border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm  mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default TextAreaModal;
