import React, { useState } from "react";
import TaskItem from "./TaskItem";
import TaskAreaModal from "./TextAreaModal";
import { deleteTaskApi, updateTaskApi } from "../../ApiCalls";
import useTaskStore from "../../Zustand/taskStore";
import useTagStore from "../../Zustand/tagStore";
import { TaskCollection } from "./Types/types";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

const TaskList = ({ todo, inProgress, completed }: TaskCollection) => {
  const [delMsg, setDelMsg] = useState(false);
  const [modalData, setModalData] = useState({
    _id: "",
    title: "",
    description: "",
    dueDate: "",
    status: "",
    priority: "",
    tag: "",
    attatchments: [],
    colloborations: [],
  });

  // store
  const setOriginalTasks = useTaskStore((state) => state.setOriginalTasks);
  const originalTasks = useTaskStore((state) => state.originalTasks);
  const copyTasks = useTaskStore((state) => state.copyTasks);
  const tags = useTagStore((state) => state.tags);
  const updateTaskOrigStore = useTaskStore(
    (state) => state.updateTaskOrigStore
  );
  const updateTaskCopiedStore = useTaskStore(
    (state) => state.updateTaskCopiedStore
  );
  const deleteTaskOrigStore = useTaskStore(
    (state) => state.deleteTaskOrigStore
  );
  const deleteTaskCopiedStore = useTaskStore(
    (state) => state.deleteTaskCopiedStore
  );

  // when clicked on task set editedTask value to currentTask
  const handleTaskClick = (task) => {
    setModalData(task);
  };

  // handle input change (title,priority, status)
  const handleInputChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  // handle description change
  const handleDescription = (desc) => {
    setModalData({ ...modalData, description: desc });
  };

  // handle Date change
  const handleDate = (date) => {
    setModalData({ ...modalData, dueDate: date.toString() });
  };

  const handleFormSubmit = () => {
    updateTaskApi(modalData._id, modalData)
      .then(() => {
        updateTaskOrigStore(modalData.status, modalData._id, modalData);
        updateTaskCopiedStore(modalData.status, modalData._id, modalData);
      })
      .catch((err) => {
        console.log("Error in updating task:", err);
      });
  };

  // handle delete
  const disAppearToast = () => {
    setDelMsg(false);
  };

  const handleDelete = (task) => {
    deleteTaskApi(task._id)
      .then(() => {
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

  // drag and drop
  const handleDragEnd = (result) => {
    const { destination, source } = result;

    // Item dropped outside of a droppable area : no destination
    if (!destination) {
      return;
    }

    // Item dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // if source and destination are same
    if (source.droppableId == destination.droppableId) {
      // if todo
      if (source.droppableId == "todo") {
        const updatedTasks = Array.from(todo);
        const [removed] = updatedTasks.splice(source.index, 1);
        updatedTasks.splice(destination.index, 0, removed);
        setOriginalTasks("todo", updatedTasks);
      }
      // if inprogress
      else if (source.droppableId == "inProgress") {
        const updatedTasks = Array.from(inProgress);
        const [removed] = updatedTasks.splice(source.index, 1);
        updatedTasks.splice(destination.index, 0, removed);
        setOriginalTasks("inProgress", updatedTasks);
      }
      // if completed
      else if (source.droppableId == "completed") {
        const updatedTasks = Array.from(completed);
        const [removed] = updatedTasks.splice(source.index, 1);
        updatedTasks.splice(destination.index, 0, removed);
        setOriginalTasks("completed", updatedTasks);
      }
    }

    //source and destination are not equal
    else {
      if (source.droppableId == "todo") {
        // first take ele from source and update the store of it
        const updatedTodo = Array.from(todo);
        const [removed] = updatedTodo.splice(source.index, 1);
        setOriginalTasks("todo", updatedTodo);

        // todo -> inProgress
        if (destination.droppableId == "inProgress") {
          removed.status = "inProgress";
          const updatedInProgress = Array.from(inProgress);
          updatedInProgress.splice(destination.index, 0, removed);
          setOriginalTasks("inProgress", updatedInProgress);
        }
        // todo -> completed
        else {
          removed.status = "completed";
          const updatedCompleted = Array.from(completed);
          updatedCompleted.splice(destination.index, 0, removed);
          setOriginalTasks("completed", updatedCompleted);
        }
      }
      if (source.droppableId == "inProgress") {
        const updatedInProgress = Array.from(inProgress);
        const [removed] = updatedInProgress.splice(source.index, 1);
        setOriginalTasks("inProgress", updatedInProgress);

        // inProg -> todo
        if (destination.droppableId == "todo") {
          removed.status = "todo";
          const updatedTodo = Array.from(todo);
          updatedTodo.splice(destination.index, 0, removed);
          setOriginalTasks("todo", updatedTodo);
        }

        // inProg -> completed
        else {
          removed.status = "completed";
          const updatedCompleted = Array.from(completed);
          updatedCompleted.splice(destination.index, 0, removed);
          setOriginalTasks("completed", updatedCompleted);
        }
      }
      if (source.droppableId == "completed") {
        const updatedCompleted = Array.from(completed);
        const [removed] = updatedCompleted.splice(source.index, 1);
        setOriginalTasks("completed", updatedCompleted);

        // comp -> todo
        if (destination.droppableId == "todo") {
          removed.status = "todo";
          const updatedTodo = Array.from(todo);
          updatedTodo.splice(destination.index, 0, removed);
          setOriginalTasks("todo", updatedTodo);
        }
        // comp-> inProg
        else {
          removed.status = "inProgress";
          const updatedInProgress = Array.from(inProgress);
          updatedInProgress.splice(destination.index, 0, removed);
          setOriginalTasks("inProgress", updatedInProgress);
        }
      }
    }
    // in end copy state to copied state
    copyTasks(originalTasks);
  };

  return (
    <div className="h-screen">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-6  mb-4 p-6">
          {/* todo list */}
          <div className="border border-gray-500  max-h-[550px] overflow-y-auto w-full p-3 bg-black rounded-2xl">
            <div>
              <p className="mb-2 text-center text-lg  text-white ">Todo</p>
              <TaskAreaModal status={"todo"} />
            </div>
            <Droppable droppableId="todo">
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {todo.map((task, index) => {
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
                            <TaskItem
                              task={task}
                              handleTaskClick={handleTaskClick}
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
          </div>

          {/* in progress list */}
          <div className="border border-gray-500  max-h-[550px] overflow-y-auto w-full p-3 bg-black rounded-2xl">
            <Droppable droppableId="inProgress">
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <p className="mb-2 text-center text-lg   text-white ">
                    In Progress
                  </p>
                  <TaskAreaModal status={"inProgress"} />
                  {inProgress.map((task, index) => {
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
                            <TaskItem
                              task={task}
                              handleTaskClick={handleTaskClick}
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
          </div>

          {/* completed list */}
          <div className="border border-gray-500 max-h-[550px] overflow-y-auto w-full p-3 bg-black rounded-2xl">
            <Droppable droppableId="completed">
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <p className="mb-2 text-center text-lg bg-black text-white ">
                    Completed
                  </p>
                  <TaskAreaModal status={"completed"} />
                  {completed.map((task, index) => {
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
                            <TaskItem
                              task={task}
                              handleTaskClick={handleTaskClick}
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
          </div>

          <div className=""></div>

          {/* delete toast msg */}
          {delMsg && (
            <div className="toast">
              <div className=" ">
                <span>
                  <div className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <div className="flex items-center justify-center w-12 bg-red-500">
                      <svg
                        className="w-6 h-6 text-gray-200 fill-current"
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

          {/* new modal */}
          {/* Put this part before </body> tag */}
          <input type="checkbox" id="my_modal_6" className="modal-toggle" />

          <div className="modal">
            <div className="modal-box bg-gray-400 text-black">
              <div>
                <form className="text-sm" onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-2">
                    <h1 className="text-gray-800 text-xl mb-4">Edit Task</h1>

                    <label
                      htmlFor="my_modal_6"
                      className="btn bg-gray-600 w-16 ml-44 h-2"
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </label>
                  </div>
                  <div className="xt-row xt-row-x-6 xt-row-y-4">
                    <div className="w-full">
                      <div className="modal-action"></div>

                      <label className="block mb-3 font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        required
                        type="text"
                        id="title"
                        name="title"
                        value={modalData.title}
                        className="block w-full rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                        aria-label="Input"
                        placeholder="Input"
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="w-full mt-4">
                      <label className="block mb-3 font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        className="block w-full h-20 max-h-48 rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none resize-vertical"
                        aria-label="Textarea"
                        placeholder="Textarea"
                        value={modalData.description}
                        onChange={handleInputChange}
                      ></textarea>
                      {/* <ReactQuill
                        className="block  w-full rounded-md   text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                        value={modalData.description}
                        onChange={handleDescription}
                        style={{
                          height: " 180px",
                          maxHeight: "180px",
                          overflow: "auto",
                        }}
                      /> */}
                    </div>

                    {/* select tag */}
                    <div className="w-full mt-4">
                      <label className="block mb-3 font-medium text-gray-700">
                        Tag
                      </label>
                      <select
                        id="tag"
                        name="tag"
                        className="block w-full xt-select rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                        aria-label="Select"
                        value={modalData.tag == "" ? "noTag" : modalData.tag}
                        onChange={handleInputChange}
                      >
                        <option value="noTag" className="bg-red-400">
                          No tag
                        </option>

                        {tags.map((tag, index) => (
                          <option key={index} value={tag}>
                            {tag}
                          </option>
                        ))}
                        {/* <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option> */}
                      </select>
                    </div>
                    <div className="w-full mt-4">
                      <label className="block mb-3 font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="block w-full xt-select rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                        aria-label="Select"
                        value={modalData.status}
                        onChange={handleInputChange}
                      >
                        {/* <option selected value="">
                        Select an option
                      </option> */}
                        <option value="todo">Todo</option>
                        <option value="inProgress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="w-full mt-4">
                      <label className="block mb-3 font-medium text-gray-700">
                        Priority
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        className="block w-full xt-select rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                        aria-label="Select"
                        value={modalData.priority}
                        onChange={handleInputChange}
                      >
                        {/* <option selected value="">
                        Select an option
                      </option> */}
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    {/* Date picker */}
                    <div className="pt-3">
                      <label className="block mb-3 font-medium text-gray-700">
                        Due Date
                      </label>
                      <DatePicker
                        className="block w-full rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                        selected={
                          modalData.dueDate == ""
                            ? new Date()
                            : new Date(modalData.dueDate)
                        }
                        onChange={handleDate}
                      />
                    </div>

                    {/* submit button */}
                    <div className="w-full mt-3">
                      <button
                        type="submit"
                        className="xt-button py-2.5 px-3.5 text-sm rounded-md font-medium leading-snug tracking-wider uppercase text-gray-200 bg-primary-500 transition hover:text-gray-200 hover:bg-primary-600 active:text-gray-200 active:bg-primary-700 on:text-gray-200 on:bg-primary-600"
                      >
                        submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskList;
