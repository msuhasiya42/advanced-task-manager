import { create } from "zustand";

const useTaskStore = create((set) => ({
  tasks: {
    todo: [],
    inProgress: [],
    completed: [],
  },
  //   set task
  setTasks: (category, newTasks) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [category]: newTasks,
      },
    })),
  //   add new task
  addTask: (category, task) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [category]: [...state.tasks[category], task],
      },
    })),

  // update task
  updateTask: (category, taskId, updatedTask) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [category]: state.tasks[category].map((task) =>
          task._id === taskId ? updatedTask : task
        ),
      },
    })),

  // delete task
  deleteTask: (category, taskId) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [category]: state.tasks[category].filter((task) => task._id !== taskId),
      },
    })),

  filterTasksByTagsAndCategory: () => {
    const tasks = useTaskStore.getState().tasks;
    const tags = useTaskStore.getState().tags;
    const category = useTaskStore.getState().category;

    const filteredTasks = tasks.filter((task) => {
      const hasMatchingTags = tags.every((tag) => task.tags.includes(tag));

      if (category === "All") {
        return hasMatchingTags;
      } else if (category === "Todo") {
        return task.category === "Todo" && hasMatchingTags;
      } else if (category === "In Progress") {
        return task.category === "In Progress" && hasMatchingTags;
      } else if (category === "Completed") {
        return task.category === "Completed" && hasMatchingTags;
      }

      return false;
    });

    useTaskStore.getState().setFilteredTasks(filteredTasks);
  },
}));

export default useTaskStore;
