import React, { useEffect, useState } from "react";
import { taskAPI } from "../../ApiCalls";
import useTaskStore from "../../Zustand/taskStore";
import useAuthStore from "../../Zustand/authStore";
import { TaskCategory } from "./Types/types";
import { Toast } from "../SmallComp/ToastMessage/ToastMessage";

interface StatusType {
  status: TaskCategory;
}

const TextAreaModal = ({ status }: StatusType) => {
  const [showTextArea, setShowTextArea] = useState(false);
  const [task, setTask] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user?.userId);
  const addTaskOrigStore = useTaskStore((state) => state.addTaskOrigStore);
  const addTaskCopiedStore = useTaskStore((state) => state.addTaskCopiedStore);
  const textRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => setShowTextArea((prev) => !prev);

  const removeToastMsg = () => setToastMessage(null);

  const onSaveTask = (event: React.FormEvent) => {
    event.preventDefault();

    if (user) {
      taskAPI
        .createTask(task, status, user)
        .then((response) => {
          const newTask = response.data.task;
          addTaskOrigStore(status, newTask);
          addTaskCopiedStore(status, newTask);
          setToastMessage("Task Added");
        })
        .catch((error) => {
          console.error(error);
          setToastMessage("Error: Task Not added");
        });
      setTimeout(removeToastMsg, 2000);
    }
    setTask("");
    setShowTextArea(false);
  };

  const updateTitle = (event: any) => {
    setTask(event.target.value);
  };

  const handleClickOutside = (event: any) => {
    if (
      textRef.current &&
      !textRef.current.contains(event.target) &&
      event.target.type !== "submit"
    ) {
      setShowTextArea(false);
    }
  };

  useEffect(() => {
    if (showTextArea && textRef.current != null) {
      textRef.current.focus();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTextArea]);

  return (
    <div>
      <div>
        <button
          onClick={handleClick}
          className="flex items-center justify-center text-sm mb-3 w-full h-8 bg-blue-500 hover:bg-blue-400 text-gray-300 font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-xl"
        >
          Add Card
        </button>
      </div>

      {toastMessage && (
        <Toast
          type={toastMessage.includes("Error") ? "error" : "success"}
          message={toastMessage}
        />
      )}
      {showTextArea && (
        <form onSubmit={onSaveTask}>
          <div className="w-full mb-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            {/* <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600"></div> */}
            <div className="px-4  bg-white rounded-lg dark:bg-gray-800">
              <input
                ref={textRef}
                onChange={updateTitle}
                id="task"
                type="text"
                className="block w-full px-1 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-gray-300 dark:placeholder-gray-400"
                placeholder="Write about task..."
                required
              ></input>
            </div>
          </div>

          {/* Add card button */}
          <div className=" grid grid-cols-2 gap-24 md:gap-6">
            <button
              type="submit"
              className=" mb-5 inline-flex items-center justify-center px-4 py-1 text-sm font-medium text-center text-gray-300 bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
            >
              Add
            </button>

            <button
              type="button"
              onClick={handleClick}
              className=" mb-5 inline-flex justify-center items-center px-4 py-1 text-sm font-medium text-center text-gray-300 bg-gray-700 rounded-lg focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900 hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TextAreaModal;
