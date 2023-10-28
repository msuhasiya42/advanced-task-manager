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
  const { user } = useAuthStore();

  const setAllTasks = useTaskStore((state) => state.setAllTasks);
  const setOriginalTasks = useTaskStore((state) => state.setOriginalTasks);
  const copyTasks = useTaskStore((state) => state.copyTasks);
  const copiedTasks = useTaskStore((state) => state.copiedTasks);

  const filterTasksByStatus = (tasks: TaskType[], status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const fetchAndProcessTasks = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetchTask(userId);
      const fetchedTasks = response.data.tasks;

      const validatedTasks = fetchedTasks.map((task: TaskType) => {
        try {
          return taskSchema.parse(task);
        } catch (error: any) {
          console.error(`Invalid task: ${error.message}`);
          return null;
        }
      });

      setAllTasks(validatedTasks);

      const todos = filterTasksByStatus(validatedTasks, "todo");
      const inprogress = filterTasksByStatus(validatedTasks, "inProgress");
      const completed = filterTasksByStatus(validatedTasks, "completed");

      setOriginalTasks("todo", todos);
      setOriginalTasks("inProgress", inprogress);
      setOriginalTasks("completed", completed);

      copyTasks();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchAndProcessTasks(user.userId);
    }
  }, [user, setOriginalTasks]);

  return (
    <div className="border-gray-900 border-dashed rounded-lg">
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="bg-gray-900 ml-1 grow h-full rounded">
          <div className="m-1">
            <TaskList
              todo={copiedTasks.todo}
              inProgress={copiedTasks.inProgress}
              completed={copiedTasks.completed}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
