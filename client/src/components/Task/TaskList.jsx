import React from "react";
import { useState } from "react";
import TaskItem from "./TaskItem";
import TaskAreaModal from "./TextAreaModal";
import { deleteTask, updateTaskApi } from "../../ApiCalls";
import useTaskStore from "../../Zustand/taskStore";
const TaskList = ({ todosTasks, inProgressTasks, completedTasks }) => {
  const [editedTask, setEditedTask] = useState({
    _id: "",
    title: "",
    description: "",
    status: "",
    priority: "",
    attatchments: [],
    colloborations: [],
  });

  const handleTaskClick = (task) => {
    setEditedTask(task);
    // Code to open the edit task modal
  };

  // handle input change
  // const handleInputChange = (e) => {
  //   setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  // };

  // on update
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleUpdate(editedTask._id, editedTask);
  };

  // update task
  const updateTask = useTaskStore((state) => state.updateTask);

  const handleUpdate = (id, updatedTask) => {
    updateTask(editedTask.status, editedTask._id, editedTask);
    updateTaskApi(id, updatedTask)
      .then((res) => {
        console.log("Task updated", res);
      })
      .catch((err) => {
        console.log("Error in updating task:", err);
      });
  };

  // delete task
  const handleDelete = (id) => {
    deleteTask(id)
      .then((res) => {
        console.log("Task Deleted:", res);
      })
      .catch((err) => {
        console.log("Error in deletion:", err);
      });
  };
  return (
    <div className="h-screen">
      <div className="grid grid-cols-3 gap-12  mb-4 p-6">
        <ul className="w-full">
          <p className="m-2 text-center text-lg  text-white ">Todo</p>
          <TaskAreaModal status={"todo"} />
          {todosTasks.map((task) => {
            return (
              <div key={task._id}>
                <TaskItem
                  task={task}
                  handleTaskClick={handleTaskClick}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                />
                {/* new modal */}
              </div>
            );
          })}
        </ul>
        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my_modal_6" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <div className="grid grid-cols-2">
              <h3 className="font-bold text-lg">Edit Task</h3>
              <label htmlFor="my_modal_6" className="">
                X
              </label>
            </div>

            <div className="modal-action">
              <form action="" onSubmit={handleFormSubmit}>
                {/* title */}
                <input
                  type="text"
                  name="title"
                  id="title"
                  // @ts-ignore
                  value={editedTask.title}
                  onChange={(e) =>
                    // @ts-ignore
                    setEditedTask({ ...editedTask, title: e.target.value })
                  }
                  // placeholder="Type here"
                  className="mb-6 input input-accent input-bordered input-sm w-full max-w-xs"
                />

                <button className="btn ml-2">Save</button>
              </form>
            </div>
          </div>
        </div>
        <ul>
          <p className="m-2 text-center text-lg  text-white ">In Progress</p>
          <TaskAreaModal status={"inProgress"} />
          {inProgressTasks.map((task) => {
            return (
              <div key={task._id}>
                <TaskItem
                  task={task}
                  handleTaskClick={handleTaskClick}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                />
              </div>
            );
          })}
        </ul>
        <ul>
          <p className="m-2 text-center text-lg  text-white ">Completed</p>
          <TaskAreaModal status={"completed"} />

          {completedTasks.map((task) => {
            return (
              <div key={task._id}>
                <TaskItem
                  task={task}
                  handleTaskClick={handleTaskClick}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                />
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TaskList;
