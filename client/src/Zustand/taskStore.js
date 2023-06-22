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
}));

export default useTaskStore;
