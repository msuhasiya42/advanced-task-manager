import React from "react";
import TaskItem from "./TaskItem";
import TextAreaModal from "./TextAreaModal";
const TaskList = ({ tasks, status, updateTaskFun }) => {
  return (
    <div>
      <ul>
        <TextAreaModal status={status} />
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
