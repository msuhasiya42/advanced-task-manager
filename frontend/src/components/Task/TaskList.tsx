import React, { useState } from "react";
import TaskItem from "./TaskItem";
import TaskAreaModal from "./TextAreaModal";
import { taskAPI } from "../../ApiCalls";
import useTaskStore from "../../Zustand/taskStore";
import { TaskCategory, TaskCollection, TaskType } from "./Types/types";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "react-datepicker/dist/react-datepicker.css";
import { Toast } from "../SmallComp/ToastMessage/ToastMessage";
import { message } from "antd";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

const TaskList = ({ todo, inProgress, completed }: TaskCollection) => {
  const [showDeleteToastMsg, setShowDeleteToastMsg] = useState(false);

  // store
  const {
    setOriginalTasks,
    copyTasks,
    deleteTaskOrigStore,
    deleteTaskCopiedStore,
  } = useTaskStore((state) => ({
    setOriginalTasks: state.setOriginalTasks,
    copyTasks: state.copyTasks,
    updateTaskOrigStore: state.updateTaskOrigStore,
    updateTaskCopiedStore: state.updateTaskCopiedStore,
    deleteTaskOrigStore: state.deleteTaskOrigStore,
    deleteTaskCopiedStore: state.deleteTaskCopiedStore,
  }));

  const removeToastMsg = () => setShowDeleteToastMsg(false);

  const handleDelete = (task: TaskType) => {
    taskAPI
      .deleteTask(task._id)
      .then(() => {
        const { _id, status } = task;
        deleteTaskOrigStore(status, _id);
        deleteTaskCopiedStore(status, _id);
        void message.success("Task Deleted Successfully");
        setTimeout(removeToastMsg, 3000);
      })
      .catch((err) => {
        console.log("Error in deletion:", err);
      });
  };

  // drag and drop
  const handleDragEnd = (result: any) => {
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

    const tasksMap: Record<TaskCategory, TaskType[]> = {
      todo: todo,
      inProgress: inProgress,
      completed: completed,
    };

    // Update tasks function
    const updateTasks = (from: TaskCategory, to: TaskCategory) => {
      const sourceTasks = Array.from(tasksMap[from]);
      const [removed] = sourceTasks.splice(source.index, 1);

      if (from !== to) {
        removed.status = to;
        setOriginalTasks(from, sourceTasks);
      }

      const destinationTasks =
        from !== to ? Array.from(tasksMap[to]) : sourceTasks;
      destinationTasks.splice(destination.index, 0, removed);
      setOriginalTasks(to, destinationTasks);
    };

    updateTasks(source.droppableId, destination.droppableId);
    copyTasks();
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
                            <TaskItem task={task} handleDelete={handleDelete} />
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
                            <TaskItem task={task} handleDelete={handleDelete} />
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
                            <TaskItem task={task} handleDelete={handleDelete} />
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

          {/* delete toast msg */}
          {showDeleteToastMsg && <Toast type="error" message="Task Deleted" />}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskList;
