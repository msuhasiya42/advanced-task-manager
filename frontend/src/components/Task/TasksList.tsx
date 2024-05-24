import React from "react";
import TaskCard from "./TaskCard";
import { taskAPI } from "../../Api";
import useTaskStore from "../../Store/taskStore";
import { TaskCategory, TaskCollection, TaskType } from "./Types/types";
import "react-datepicker/dist/react-datepicker.css";
import { message } from "antd";
import NoData from "./NoData";
import AddNewTask from "./AddNewTask";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { taskNameMap } from "./utils";

interface taskListProps {
  tasks: TaskType[];
  taskType: TaskCategory;
}

const TasksList = ({ tasks, taskType }: taskListProps) => {
  // store
  const {
    deleteTaskFromDataStore,
    deleteTaskFilteredTasksStore,
  } = useTaskStore();

  const handleDelete = (task: TaskType) => {
    taskAPI
      .deleteTask(task._id)
      .then(() => {
        const { _id, status } = task;
        deleteTaskFromDataStore(status, _id);
        deleteTaskFilteredTasksStore(status, _id);
        void message.success("Task Deleted Successfully");
      })
      .catch((err) => {
        console.log("Error in deletion:", err);
      });
  };

  return (
    <>
      {
        tasks.length > 0 && (
          <div className="inline-block w-[350px]">
            <div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto w-full p-3 bg-black rounded-2xl">
              <div>
                <p className="mb-2 text-center text-lg  text-white ">{taskNameMap[taskType]}</p>
              </div>
              <Droppable droppableId={taskType}>
                {(provided) => (
                  <div
                    className="column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {tasks.map((task, index) => {
                      return (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="task"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                handleDelete={handleDelete}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div>
                <AddNewTask status={taskType} />
              </div>
            </div>
          </div>
        )
      }
    </>

  );
};

export default TasksList;
