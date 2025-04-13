import React, { useEffect, useState } from "react";
import { taskAPI } from "../../Api";
import { TaskCategory } from "./Types/types";
import { Button, Input, InputRef, Spin, Tooltip, message } from "antd";
import { CloseOutlined, EditOutlined, PlusOutlined, SendOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { addNewTask } from "../../Store/reducers/taskSlice";
import { motion } from "framer-motion";

interface StatusType {
  status: TaskCategory;
}

const AddNewTask = ({ status }: StatusType) => {
  const [showTextArea, setShowTextArea] = useState(false);
  const [task, setTask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const textRef = React.useRef<InputRef>(null);
  const dispatch = useDispatch();

  const handleClick = () => setShowTextArea((prev) => !prev);

  const onSaveTask = (event: React.FormEvent) => {
    event.preventDefault();

    if (userId) {
      if (task.trim() === "") {
        void message.error("Empty Title", 1.5);
        return;
      }

      setIsSubmitting(true);
      taskAPI
        .createTask({ title: task, status, user: userId })
        .then((response) => {
          const newTask = response.data.task;
          dispatch(addNewTask({ category: status, task: newTask }));
          void message.success("Task Added", 1.5);
          setTask("");
          setShowTextArea(false);
        })
        .catch((error) => {
          console.error(error);
          void message.error("Error: Task Not added", 1.5);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSaveTask(event);
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

  // Color and icon based on the status
  const getStatusColor = () => {
    switch (status) {
      case "todo":
        return "bg-blue-600 hover:bg-blue-700";
      case "inProgress":
        return "bg-indigo-600 hover:bg-indigo-700";
      case "completed":
        return "bg-emerald-600 hover:bg-emerald-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <div>
      {showTextArea ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <form onSubmit={onSaveTask}>
            <div className="w-full mb-2 border rounded-lg bg-gray-700 border-gray-600 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="p-2">
                <Input
                  ref={textRef}
                  size="large"
                  placeholder="What needs to be done?"
                  prefix={<EditOutlined className="text-gray-400" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                  value={task}
                  onChange={updateTitle}
                  onKeyPress={handleKeyPress}
                  autoFocus
                  className="bg-gray-700 text-white border-gray-600 hover:border-gray-500 focus:border-blue-500"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#374151',
                    color: 'white',
                    borderColor: '#4B5563'
                  }}
                />
              </div>
            </div>

            {/* Button group */}
            <div className="flex gap-2 items-center">
              <Tooltip title="Add task (or press Enter)">
                <Button
                  type="primary"
                  htmlType="submit"
                  className={`h-8 flex items-center justify-center px-4 text-sm text-white ${getStatusColor()}`}
                  icon={isSubmitting ? <Spin size="small" /> : <SendOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                  loading={isSubmitting}
                >
                  Add
                </Button>
              </Tooltip>

              <Tooltip title="Cancel">
                <Button
                  type="text"
                  onClick={handleClick}
                  className="h-8 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700"
                  icon={<CloseOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                  disabled={isSubmitting}
                />
              </Tooltip>
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Tooltip title="Add a new task">
            <Button
              type="text"
              className="w-full text-left flex items-center bg-opacity-50 hover:bg-opacity-100 bg-gray-800 rounded-md py-2 text-gray-300 hover:text-white transition-all duration-200"
              onClick={handleClick}
              icon={<PlusOutlined className="mr-1" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            >
              <span className="text-sm">Add Task</span>
            </Button>
          </Tooltip>
        </motion.div>
      )}
    </div>
  );
};

export default AddNewTask;
