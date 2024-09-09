import React from "react";
import TasksList from "./TasksList";
import { taskAPI } from "../../Api";
import LoadingPage from "../Loading/LoadingPage";
import { TaskCategory, TaskType } from "./Types/types";
import { DragDropContext } from "react-beautiful-dnd";
import AddNewTask from "./AddNewTask";
import { useQuery } from "react-query";
import { COMPLETED, INPROGRESS, TODO } from "../../utils/strings";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { copyTasks, setAllTasks, setTasksDataByCategory, updateFilter } from "../../Store/reducers/taskSlice";


export const filterTasksByStatus = (tasks: TaskType[], status: string) => {
  return tasks.filter((task) => task.status === status);
};

const TaskManager = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    filteredTasks,
    filter,
  } = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch();

  const { isLoading, isError } = useQuery("tasks", () => taskAPI.fetchTask(user?._id ?? ""), {
    enabled: !!user?._id,
    onSuccess: (res) => {
      const allTasks = res.data.tasks;
      dispatch(setAllTasks(allTasks));

      const todos = filterTasksByStatus(allTasks, TODO);
      const inprogress = filterTasksByStatus(allTasks, INPROGRESS);
      const completed = filterTasksByStatus(allTasks, COMPLETED);

      dispatch(setTasksDataByCategory({ category: TODO, newTasks: todos }));
      dispatch(setTasksDataByCategory({ category: INPROGRESS, newTasks: inprogress }));
      dispatch(setTasksDataByCategory({ category: COMPLETED, newTasks: completed }));
      dispatch(copyTasks());
      updateFilter(filter);
    }
  });

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
        dispatch(setTasksDataByCategory({ category: from, newTasks: sourceTasks }));
      }

      const destinationTasks =
        from !== to ? Array.from(tasksMap[to]) : sourceTasks;
      destinationTasks.splice(destination.index, 0, removed);
      dispatch(setTasksDataByCategory({ category: to, newTasks: destinationTasks }));
    };

    updateTasks(source.droppableId, destination.droppableId);
    dispatch(copyTasks());
  };

  const noTasks = filteredTasks.todo.length === 0 && filteredTasks.inProgress.length === 0 && filteredTasks.completed.length === 0

  if (isError) return <p className="flex w-full justify-center items-center text-red-500">Error while fetching tasks</p>

  return (
    <>
      {isLoading ? (
        <LoadingPage message="Fetching tasks..." />
      ) : (
        noTasks ?
          <div className="flex items-center w-full bg-gray-900 justify-center"><AddNewTask status="todo" /></div>
          : (<div className="flex p-2 mt-4 bg-gray-900 justify-center sm:justify-start sm:pl-12">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex flex-col sm:flex-row gap-8">
                {Object.entries(filteredTasks).map(([taskType, tasks]) => (
                  <TasksList
                    key={taskType}
                    tasks={tasks}
                    taskType={taskType as TaskCategory}
                  />
                ))}
              </div>
            </DragDropContext>
          </div>)
      )}
    </ >
  );
};

export default TaskManager;
