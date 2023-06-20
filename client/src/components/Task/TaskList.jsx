import React from "react";
import TaskItem from "./TaskItem";
const TaskList = ({ tasks, updateTaskFun }) => {
  return (
    <div>
      <ul>
        {tasks.map((task) => {
          return (
            <TaskItem
              key={task._id}
              task={task}
              updateTaskFun={updateTaskFun}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default TaskList;
