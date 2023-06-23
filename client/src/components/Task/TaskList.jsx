import React from "react";
import TaskItem from "./TaskItem";
const TaskList = ({ tasks, handleUpdate, handleDelete }) => {
  return (
    <div>
      <ul>
        {tasks.map((task) => {
          return (
            <div key={task._id}>
              <TaskItem
                task={task}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
              />
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default TaskList;
