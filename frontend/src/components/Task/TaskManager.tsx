import React, { useMemo } from "react";
import TasksList from "./TasksList";
import { taskAPI } from "../../Api";
import LoadingPage from "../Loading/LoadingPage";
import { TaskCategory, TaskType } from "./Types/types";
import { DragDropContext } from "react-beautiful-dnd";
import AddNewTask from "./AddNewTask";
import { useQuery } from "react-query";
import { TaskCategories } from "../../utils/strings";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { setFilteredTasks, setAllTasks, setTasksByCategory, updateFilter } from "../../Store/reducers/taskSlice";


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
      const allTasks = res.data.tasks ?? [];
      const [todo, inProgress, completed] = TaskCategories.map((category) => filterTasksByStatus(allTasks, category));

      const tasksMap: Record<TaskCategory, TaskType[]> = {
        todo,
        inProgress,
        completed
      };

      TaskCategories.map((category) => dispatch(setTasksByCategory({ category, newTasks: tasksMap[category] })));
      dispatch(setAllTasks(allTasks));
      dispatch(setFilteredTasks());
      dispatch(updateFilter(filter));
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
        dispatch(setTasksByCategory({ category: from, newTasks: sourceTasks }));
      }

      const destinationTasks =
        from !== to ? Array.from(tasksMap[to]) : sourceTasks;
      destinationTasks.splice(destination.index, 0, removed);
      dispatch(setTasksByCategory({ category: to, newTasks: destinationTasks }));
    };

    updateTasks(source.droppableId, destination.droppableId);
    dispatch(setFilteredTasks());
  };

  const noTasks = useMemo(() => {
    return TaskCategories.every((category) => filteredTasks[category].length === 0);
  }, [filteredTasks]);

  if (isError) return <p className="flex w-full justify-center items-center text-red-500">Error while fetching tasks</p>

  return (
    <>
      {isLoading ? (
        <LoadingPage message="Fetching tasks..." />
      ) : (
        noTasks ?
          <div className="flex items-center w-full h-full bg-gray-900 justify-center"><AddNewTask status="todo" /></div>
          : (<div className="flex p-2 w-full h-full bg-gray-900 justify-center sm:justify-start sm:pl-6 overflow-auto">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex flex-col sm:flex-row gap-8 py-4">
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
    </>
  );
};

export default TaskManager;
