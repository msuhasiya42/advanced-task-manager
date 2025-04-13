import React from "react";
import TaskCard from "./TaskCard";
import { taskAPI } from "../../Api";
import { TaskCategory, TaskType } from "./Types/types";
import "react-datepicker/dist/react-datepicker.css";
import { Badge, Tooltip, message } from "antd";
import AddNewTask from "./AddNewTask";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { taskNameMap } from "./utils";
import { deleteTaskFromInStore } from "../../Store/reducers/taskSlice";
import { useDispatch } from "react-redux";
import { CheckCircleOutlined, ClockCircleOutlined, RightCircleOutlined } from "@ant-design/icons";

interface taskListProps {
  tasks: TaskType[];
  taskType: TaskCategory;
}

const TasksList = ({ tasks, taskType }: taskListProps) => {
  const dispatch = useDispatch();

  // Get the appropriate icon based on taskType
  const getTaskTypeIcon = () => {
    switch (taskType) {
      case "todo":
        return <ClockCircleOutlined className="mr-2" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
      case "inProgress":
        return <RightCircleOutlined className="mr-2" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
      case "completed":
        return <CheckCircleOutlined className="mr-2" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
      default:
        return null;
    }
  };

  // Get the appropriate color based on taskType - using lighter colors as requested
  const getColumnColor = () => {
    switch (taskType) {
      case "todo":
        return "from-blue-900 to-blue-800";
      case "inProgress":
        return "from-indigo-900 to-indigo-800";
      case "completed":
        return "from-emerald-900 to-emerald-800";
      default:
        return "from-gray-900 to-gray-800";
    }
  };

  // Get badge color based on taskType
  const getBadgeColor = () => {
    switch (taskType) {
      case "todo":
        return "blue";
      case "inProgress":
        return "geekblue";
      case "completed":
        return "green";
      default:
        return "blue";
    }
  };

  const handleDelete = (task: TaskType) => {
    taskAPI
      .deleteTask(task._id)
      .then(() => {
        const { _id, status } = task;
        dispatch(deleteTaskFromInStore({ category: status, taskId: _id }));
        void message.success("Task Deleted Successfully");
      })
      .catch((err) => {
        console.log("Error in deletion:", err);
      });
  };

  return (
    <>
      {tasks.length > 0 && (
        <div className="inline-block w-[350px] transition-all duration-300 ease-in-out hover:scale-[1.01]">
          <div className={`max-h-[650px] sm:max-h-[700px] flex flex-col w-full p-4 bg-gradient-to-b ${getColumnColor()} rounded-xl shadow-lg border border-gray-700`}>
            <div className="mb-3 text-center sticky top-0 z-10 backdrop-blur-sm bg-opacity-80 py-2 rounded-lg">
              <div className="flex items-center justify-center">
                {getTaskTypeIcon()}
                <span className="text-lg font-semibold text-white">
                  {taskNameMap[taskType]}
                </span>
                <Tooltip title={`${tasks.length} tasks in this column`}>
                  <Badge count={tasks.length} className="ml-2" showZero color={getBadgeColor()} />
                </Tooltip>
              </div>
            </div>

            <Droppable droppableId={taskType}>
              {(provided, snapshot) => (
                <div
                  className={`flex-grow overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 ${snapshot.isDraggingOver ? "bg-opacity-50 bg-gray-700 rounded-lg" : ""
                    }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`task mb-2 transition-all duration-200 ${snapshot.isDragging ? "rotate-1 scale-105" : ""
                            }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} handleDelete={handleDelete} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="mt-3 sticky bottom-0 backdrop-blur-sm bg-opacity-80 py-2 rounded-lg">
              <AddNewTask status={taskType} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TasksList;
