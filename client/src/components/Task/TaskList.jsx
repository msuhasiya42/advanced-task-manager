import React from "react";
import { useState } from "react";
import TaskItem from "./TaskItem";
import TaskAreaModal from "./TextAreaModal";
import { deleteTaskApi, updateTaskApi } from "../../ApiCalls";
import useTaskStore from "../../Zustand/taskStore";
const TaskList = ({ todosTasks, inProgressTasks, completedTasks }) => {
  const [delMsg, setDelMsg] = useState(false);
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

  // toast msg remove
  const disAppearToast = () => {
    setDelMsg(false);
  };

  // handle input change
  // const handleInputChange = (e) => {
  //   setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  // };

  // on updating task
  const handleFormSubmit = (e) => {
    e.preventDefault();
    updateTaskApi(editedTask._id, editedTask)
      .then((res) => {
        console.log("Task updated", res);
        updateTaskOrigStore(editedTask.status, editedTask._id, editedTask);
        updateTaskCopiedStore(editedTask.status, editedTask._id, editedTask);
      })
      .catch((err) => {
        console.log("Error in updating task:", err);
      });
  };

  // update task
  const updateTaskOrigStore = useTaskStore(
    (state) => state.updateTaskOrigStore
  );
  const updateTaskCopiedStore = useTaskStore(
    (state) => state.updateTaskCopiedStore
  );

  // getting fun from store to delete and calling delete task api
  // then updating the store
  const deleteTaskOrigStore = useTaskStore(
    (state) => state.deleteTaskOrigStore
  );
  const deleteTaskCopiedStore = useTaskStore(
    (state) => state.deleteTaskCopiedStore
  );

  const handleDelete = (task) => {
    deleteTaskApi(task._id)
      .then((res) => {
        console.log("Task Deleted:", res);
        deleteTaskOrigStore(task.status, task._id);
        deleteTaskCopiedStore(task.status, task._id);

        // toast msg
        setDelMsg(true);
        setTimeout(disAppearToast, 3000);
      })
      .catch((err) => {
        console.log("Error in deletion:", err);
      });
  };
  return (
    <div className="h-screen">
      {delMsg && (
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
                      Task Deleted
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-200"></p>
                  </div>
                </div>
              </div>
            </span>
          </div>
        </div>
      )}
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
