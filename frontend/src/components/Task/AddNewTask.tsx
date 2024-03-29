import React, { useEffect, useState } from "react";
import { taskAPI } from "../../ApiCalls";
import useTaskStore from "../../Zustand/taskStore";
import useAuthStore from "../../Zustand/authStore";
import { TaskCategory } from "./Types/types";
import { Input, InputRef, message } from "antd";
import { CloseOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

interface StatusType {
  status: TaskCategory;
}

const AddNewTask = ({ status }: StatusType) => {
  const [showTextArea, setShowTextArea] = useState(false);
  const [task, setTask] = useState("");
  const user = useAuthStore((state) => state.user?.userId);
  const addTaskOrigStore = useTaskStore((state) => state.addTaskOrigStore);
  const addTaskCopiedStore = useTaskStore((state) => state.addTaskCopiedStore);
  const textRef = React.useRef<InputRef>(null);

  const handleClick = () => setShowTextArea((prev) => !prev);

  const onSaveTask = (event: React.FormEvent) => {
    event.preventDefault();

    if (user) {
      if (task.trim() === "") {
        void message.error("Empty Title", 1.5);
        return;
      }
      taskAPI
        .createTask(task, status, user)
        .then((response) => {
          const newTask = response.data.task;
          addTaskOrigStore(status, newTask);
          addTaskCopiedStore(status, newTask);
          void message.success("Task Added", 1.5);
        })
        .catch((error) => {
          console.error(error);
          void message.error("Error: Task Not added", 1.5);
        });
    }
    setTask("");
    setShowTextArea(false);
  };

  const updateTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const inputElement = textRef.current?.input;

    if (
      inputElement &&
      !inputElement.contains(event.target as Node) &&
      (event.target as HTMLInputElement).type !== "submit"
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
      {showTextArea ? (
        <form onSubmit={onSaveTask}>
          <div className="w-full mb-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            {/* <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600"></div> */}
            <div>
              <Input
                ref={textRef}
                size="large"
                placeholder="Write about task..."
                prefix={<EditOutlined />}
                onChange={updateTitle}
              />
            </div>
          </div>

          {/* Add card button */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="h-7 inline-flex items-center justify-center px-4 py-1 text-sm font-medium text-center text-gray-300 bg-blue-700 rounded-md focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
            >
              Add
            </button>

            <button
              type="button"
              onClick={handleClick}
              className=" mb-5 inline-flex justify-center items-center py-1 text-lg text-center rounded-md p-2 hover:bg-gray-800"
            >
              <CloseOutlined />
            </button>
          </div>
        </form>
      ) : (
        <div
          className="hover:bg-slate-700 pl-3 rounded-md py-1 cursor-pointer"
          onClick={handleClick}
        >
          <PlusOutlined /> <span className="text-sm">Add Card</span>
        </div>
      )}
    </div>
  );
};

export default AddNewTask;
