import React, { useEffect, useState } from "react";
import TaskList from "./TaskList";
import { fetchTask } from "../../ApiCalls";
import LoadingPage from "../Loading/LoadingPage";
import useTaskStore from "../../Zustand/taskStore";
import useAuthStore from "../../Zustand/authStore";
const TaskManager = () => {
  const [loading, setLoading] = useState(false);

  // using zustand store
  const { user } = useAuthStore();
  const originalTasks = useTaskStore((state) => state.originalTasks);
  const setOriginalTasks = useTaskStore((state) => state.setOriginalTasks);
  const copyTasks = useTaskStore((state) => state.copyTasks);
  const copiedTasks = useTaskStore((state) => state.copiedTasks);

  useEffect(() => {
    setLoading(true);

    // fetching all tasks
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

          // Storing data to main store
          setOriginalTasks("todo", todos); // Set the fetched tasks in the "todo" category
          setOriginalTasks("inProgress", inprogress); // Set the fetched tasks in the "inProgress" category
          setOriginalTasks("completed", completed);

          // copying orig store into copied store
          copyTasks(originalTasks);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchTaskFun(user.id);
    setLoading(false);
  }, [user, setOriginalTasks]);

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
                    todosTasks={copiedTasks.todo}
                    inProgressTasks={copiedTasks.inProgress}
                    completedTasks={copiedTasks.completed}
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
