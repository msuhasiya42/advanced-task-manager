import React, { useEffect, useState } from "react";
import TasksList from "./TasksList";
import { taskAPI } from "../../Api";
import LoadingPage from "../Loading/LoadingPage";
import useTaskStore from "../../Store/taskStore";
import useAuthStore from "../../Store/authStore";
import { taskSchema } from "../../zodSpecs/task";
import { TaskCategory, TaskType } from "./Types/types";
import { DragDropContext } from "react-beautiful-dnd";


export const filterTasksByStatus = (tasks: TaskType[], status: string) => {
  return tasks.filter((task) => task.status === status);
};

const TaskManager = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const {
    setAllTasks,
    setTasksDataByCategory,
    copyTasks,
    filteredTasks,
    filter,
    updateFilter,
  } = useTaskStore();

  const fetchAndProcessTasks = async (userId: string) => {
    try {
      setLoading(true);
      const response = await taskAPI.fetchTask(userId);
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

      setTasksDataByCategory("todo", todos);
      setTasksDataByCategory("inProgress", inprogress);
      setTasksDataByCategory("completed", completed);

      copyTasks();
      updateFilter(filter);
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
  }, [user]);

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
      todo: filteredTasks.todo,
      inProgress: filteredTasks.inProgress,
      completed: filteredTasks.completed
    };

    // Update tasks function
    const updateTasks = (from: TaskCategory, to: TaskCategory) => {
      const sourceTasks = Array.from(tasksMap[from]);
      const [removed] = sourceTasks.splice(source.index, 1);

      if (from !== to) {
        removed.status = to;
        // api call to change status of task when drag and drop
        taskAPI.updateTask(removed._id, removed);
        setTasksDataByCategory(from, sourceTasks);
      }

      const destinationTasks =
        from !== to ? Array.from(tasksMap[to]) : sourceTasks;
      destinationTasks.splice(destination.index, 0, removed);
      setTasksDataByCategory(to, destinationTasks);
    };

    updateTasks(source.droppableId, destination.droppableId);
    copyTasks();
  };

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="flex h-full w-full bg-gray-900">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col sm:flex-row gap-8 p-8">
              {Object.entries(filteredTasks).map(([taskType, tasks]) => (
                <TasksList
                  key={taskType}
                  tasks={tasks}
                  taskType={taskType as TaskCategory}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      )}
    </ >
  );
};

export default TaskManager;
