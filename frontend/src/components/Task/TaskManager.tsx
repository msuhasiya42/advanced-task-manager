import React, { useEffect, useState } from "react";
import TaskList from "./TaskList";
import { fetchTask } from "../../ApiCalls";
import LoadingPage from "../Loading/LoadingPage";
import useTaskStore from "../../Zustand/taskStore";
import useAuthStore from "../../Zustand/authStore";
import { taskSchema } from "../../zodSpecs/task";
import { TaskType } from "./Types/types";
const TaskManager = () => {
  const [loading, setLoading] = useState(false);

  // using zustand store
  const { user } = useAuthStore();
  const setAllTasks = useTaskStore((state) => state.setAllTasks);
  const setOriginalTasks = useTaskStore((state) => state.setOriginalTasks);
  const copyTasks = useTaskStore((state) => state.copyTasks);
  const copiedTasks = useTaskStore((state) => state.copiedTasks);

  useEffect(() => {
    setLoading(true);

    // fetching all tasks
    const fetchTaskFun = async (user: string) => {
      fetchTask(user)
        .then((response) => {
          const fetchedTasks = response.data.tasks;

          // zod validation
          const validatedTasks = fetchedTasks.map((task: TaskType) => {
            try {
              return taskSchema.parse(task);
            } catch (error: any) {
              console.error(`Invalid task: ${error.message}`);
              return null;
            }
          });

          setAllTasks(validatedTasks);

          const todos = validatedTasks.filter(
            (task: TaskType) => task.status === "todo"
          );
          const inprogress = validatedTasks.filter(
            (task: TaskType) => task.status === "inProgress"
          );
          const completed = validatedTasks.filter(
            (task: TaskType) => task.status === "completed"
          );

          // Storing data to main store
          setOriginalTasks("todo", todos); // Set the fetched tasks in the "todo" category
          setOriginalTasks("inProgress", inprogress); // Set the fetched tasks in the "inProgress" category
          setOriginalTasks("completed", completed);

          // copying orig store into copied store
          copyTasks();
        })
        .catch((err) => {
          console.log(err);
        });
    };

    if (user?.userId) {
      fetchTaskFun(user.userId);
    }
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
                    todo={copiedTasks.todo}
                    inProgress={copiedTasks.inProgress}
                    completed={copiedTasks.completed}
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
