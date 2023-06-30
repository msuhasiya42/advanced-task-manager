import React, { useState } from "react";
import TaskItem from "./TaskItem";
import TaskAreaModal from "./TextAreaModal";
import { deleteTaskApi, updateTaskApi } from "../../ApiCalls";
import useTaskStore from "../../Zustand/taskStore";
import useTagStore from "../../Zustand/tagStore";
import { TaskCollection } from "./Types/types";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TaskList = ({ todo, inProgress, completed }: TaskCollection) => {
  const [delMsg, setDelMsg] = useState(false);
  const [editedTask, setEditedTask] = useState({
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

  // tags
  const tags = useTagStore((state) => state.tags);

  const handleTaskClick = (task) => {
    setEditedTask(task);
    // Code to open the edit task modal
  };

  // toast msg remove
  const disAppearToast = () => {
    setDelMsg(false);
  };

  // handle input change
  const handleInputChange = (e) => {
    console.log(e.target.value, e.target.name);
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  // on updating task
  const updateTaskOrigStore = useTaskStore(
    (state) => state.updateTaskOrigStore
  );
  const updateTaskCopiedStore = useTaskStore(
    (state) => state.updateTaskCopiedStore
  );
  const handleFormSubmit = () => {
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

  // getting fun from store to delete and calling delete task api
  // then updating the store
  const deleteTaskOrigStore = useTaskStore(
    (state) => state.deleteTaskOrigStore
  );
  const deleteTaskCopiedStore = useTaskStore(
    (state) => state.deleteTaskCopiedStore
  );

  // on task delete
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

  const setOriginalTasks = useTaskStore((state) => state.setOriginalTasks);
  const originalTasks = useTaskStore((state) => state.originalTasks);
  const copyTasks = useTaskStore((state) => state.copyTasks);

  // drag and drop
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    console.log(source, destination, draggableId);

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
        <div className="grid grid-cols-3 gap-12  mb-4 p-6">
          {/* todo list */}
          <ul className="w-full p-3 bg-black rounded-2xl">
            <Droppable droppableId="todo">
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <p className="m-2 text-center text-lg  text-white ">Todo</p>
                  <TaskAreaModal status={"todo"} />
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
          </ul>

          {/* in progress list */}
          <ul className="w-full p-3 bg-black rounded-2xl">
            <Droppable droppableId="inProgress">
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <p className="m-2 text-center text-lg   text-white ">
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
          </ul>

          {/* completed list */}
          <ul className="w-full p-3 bg-black rounded-2xl">
            <Droppable droppableId="completed">
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <p className="m-2 text-center text-lg bg-black text-white ">
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
          </ul>

          {/* delete toast msg */}
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
                        value={editedTask.title}
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
                        id="descg gets deleted from the side bar

                        Tuesday
                        ￼DELETE
                        Add option to add links :: 1
                        User can add links/ resources which related to the task.
                        
                        Wednesday
                        ￼DELETE
                        Due Date can be edited :: 2ription"
                        className="block w-full h-20 max-h-48 rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none resize-vertical"
                        aria-label="Textarea"
                        placeholder="Textarea"
                        value={editedTask.description}
                        onChange={handleInputChange}
                      ></textarea>
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
                        value={editedTask.tag}
                        onChange={handleInputChange}
                      >
                        <option className="bg-red-400" selected value="">
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
                        value={editedTask.status}
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
                        value={editedTask.priority}
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

                    <div></div>
                    {/* <DatePicker
                      name="dueDate"
                      id="dueDate"
                      selected={
                        editedTask.dueDate === ""
                          ? moment().toDate()
                          : moment(editedTask.dueDate).toDate()
                      }
                      onChange={(e) => handleDueDate(e)}
                    /> */}

                    {/* <div className="w-full">
                    <label className="block mb-3 font-medium text-gray-700">
                      Tags
                    </label>
                    <select
                      name="tags"
                      id="tags"
                      className="block w-full xt-select rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                      multiple
                      aria-label="Select multiple"
                      onChange={handleInputChange}
                    >
                      <option value="Personal">Personal</option>
                      <option value="Work">Work</option>
                      <option value="House">House</option>
                    </select>
                  </div> */}

                    <div className="w-full mt-3">
                      <button
                        type="submit"
                        className="xt-button py-2.5 px-3.5 text-sm rounded-md font-medium leading-snug tracking-wider uppercase text-white bg-primary-500 transition hover:text-white hover:bg-primary-600 active:text-white active:bg-primary-700 on:text-white on:bg-primary-600"
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
