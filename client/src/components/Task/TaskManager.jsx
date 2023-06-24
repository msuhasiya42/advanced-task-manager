import { useEffect, useState } from "react";
import TaskList from "./TaskList";
import { fetchTask } from "../../ApiCalls";
import LoadingPage from "../Loading/LoadingPage";
// import { todos, inprogress, completed } from "../../utils/data/static";
import useTaskStore from "../../Zustand/taskStore";
import React from "react";
import useAuthStore from "../../Zustand/authStore";
const TaskManager = () => {
  const [loading, setLoading] = useState(false);

  // using zustand store
  const { user } = useAuthStore();
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);

  useEffect(() => {
    setLoading(true);
    const fetchTaskFun = async (user) => {
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

    fetchTaskFun(user.id);
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

  // taskType === "Todo"
  //   ? setTodos(todos.filter((task) => task._id !== id))
  //   : taskType === "In Progress"
  //   ? setInprogress(inprogress.filter((task) => task._id !== id))
  //   : setCompleted(completed.filter((task) => task._id !== id));

  return (
    <div>
      <div className=" border-gray-900 border-dashed rounded-lg ">
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            <div className=" bg-gray-900 ml-1 grow h-full rounded ">
              <div className="m-1">
                <div className="">
                  <TaskList
                    todosTasks={tasks.todo}
                    inProgressTasks={tasks.inProgress}
                    completedTasks={tasks.completed}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
