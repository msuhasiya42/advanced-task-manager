import { useEffect, useState } from "react";
import TaskList from "./TaskList";
import { fetchTask, updateTask, deleteTask } from "../../ApiCalls";
import TaskAreaModal from "./TextAreaModal";
import LoadingPage from "../Loading/LoadingPage";
// import { todos, inprogress, completed } from "../../utils/data/static";
import useTaskStore from "../../Zustand/taskStore";
import React from "react";
const TaskManager = () => {
  const [loading, setLoading] = useState(false);

  const user = localStorage.getItem("userId");

  // using zustand store
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);

  useEffect(() => {
    const fetchTaskFun = async (user) => {
      setLoading(true);
      fetchTask(user)
        .then((response) => {
          const fetchedTasks = response.data.tasks;
          // @Remember
          // Filter tasks into different categories
          // necessary because when we add task we need to refresh individual comp not all
          // so add we add task in particular cat. it will refresh only that comp
          const todos = fetchedTasks.filter((task) => task.status === "todo");
          const inprogress = fetchedTasks.filter(
            (task) => task.status === "inProgress"
          );
          const completed = fetchedTasks.filter(
            (task) => task.status === "completed"
          );

          setTasks("todo", todos); // Set the fetched tasks in the "todo" category
          setTasks("inProgress", inprogress); // Set the fetched tasks in the "inProgress" category
          setTasks("completed", completed);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchTaskFun(user);

    setLoading(false);
  }, [user, setTasks]);

  // Fetch Task function

  // const addTask = (taskType, newTask) => {
  //   taskType === "Todo"
  //     ? addTask(task, data.todo)
  //     : taskType === "In Progress"
  //     ? setInprogress([...inprogress, newTask])
  //     : setCompleted([...completed, newTask]);
  // };

  // update task
  const handleUpdate = (id, updatedTask) => {
    updateTask(id, updatedTask)
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

    // taskType === "Todo"
    //   ? setTodos(todos.filter((task) => task._id !== id))
    //   : taskType === "In Progress"
    //   ? setInprogress(inprogress.filter((task) => task._id !== id))
    //   : setCompleted(completed.filter((task) => task._id !== id));
  };

  return (
    <div>
      <div className="p-4  sm:ml-64 ">
        <div className="p-4  border-gray-800 border-dashed rounded-lg ">
          {loading ? (
            <LoadingPage />
          ) : (
            <div className="grid grid-cols-3 gap-12  mb-4 ">
              {/* to do card */}

              <div className=" bg-gray-900   rounded ">
                <div className="m-3">
                  <p className="m-2 text-center text-lg mt-1 text-white ">
                    To-do
                  </p>
                  {/* task modal */}
                  <div>
                    <TaskAreaModal status={"todo"} />
                    <TaskList
                      tasks={tasks.todo}
                      handleUpdate={handleUpdate}
                      handleDelete={handleDelete}
                    />
                  </div>
                  {/* task modal end */}
                </div>
              </div>
              {/* to do card end */}

              {/* in-progress card */}
              <div className=" bg-gray-900 flex-col items-center  rounded ">
                <div className="m-3">
                  <p className="m-2 text-center text-lg mt-1 text-white ">
                    In-Progress
                  </p>
                  <div>
                    <TaskAreaModal status={"inProgress"} />
                    <TaskList
                      tasks={tasks.inProgress}
                      handleUpdate={handleUpdate}
                      handleDelete={handleDelete}
                    />
                  </div>
                  {/* task modal end */}
                </div>
              </div>
              {/* in-progress card end*/}

              {/* completed card */}
              <div className=" bg-gray-900 flex-col items-center  rounded ">
                <div className="m-3">
                  <p className="m-2 text-center text-lg mt-1 text-white ">
                    Completed
                  </p>
                  <div>
                    <TaskAreaModal status={"completed"} />

                    <TaskList
                      tasks={tasks.completed}
                      handleUpdate={handleUpdate}
                      handleDelete={handleDelete}
                    />
                  </div>
                  {/* task modal end */}
                </div>
              </div>
              {/* completed card end*/}
            </div>
          )}
        </div>
      </div>

      {/* task cards */}

      {/* task cards ends here */}
    </div>
  );
};

export default TaskManager;
