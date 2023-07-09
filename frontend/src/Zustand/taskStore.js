import { create } from "zustand";

const useTaskStore = create((set) => ({
  // original task store
  originalTasks: {
    todo: [],
    inProgress: [],
    completed: [],
  },
  setOriginalTasks: (category, newTasks) =>
    set((state) => ({
      originalTasks: {
        ...state.originalTasks,
        [category]: newTasks,
      },
    })),

  // copied task store
  copiedTasks: {
    todo: [],
    inProgress: [],
    completed: [],
  },

  copyTasks: () =>
    set((state) => ({
      copiedTasks: { ...state.originalTasks },
    })),

  //   set task
  setTasks: (category, newTasks) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [category]: newTasks,
      },
    })),

  //   add new task
  addTaskOrigStore: (category, task) =>
    set((state) => ({
      originalTasks: {
        ...state.originalTasks,
        [category]: [...state.originalTasks[category], task],
      },
    })),

  addTaskCopiedStore: (category, task) =>
    set((state) => ({
      copiedTasks: {
        ...state.copiedTasks,
        [category]: [...state.copiedTasks[category], task],
      },
    })),

  // update task
  updateTaskOrigStore: (category, taskId, updatedTask) =>
    set((state) => ({
      originalTasks: {
        ...state.originalTasks,
        [category]: state.originalTasks[category].map((task) =>
          task._id === taskId ? updatedTask : task
        ),
      },
    })),

  updateTaskCopiedStore: (category, taskId, updatedTask) =>
    set((state) => ({
      copiedTasks: {
        ...state.copiedTasks,
        [category]: state.copiedTasks[category].map((task) =>
          task._id === taskId ? updatedTask : task
        ),
      },
    })),

  // delete task
  deleteTaskOrigStore: (category, taskId) =>
    set((state) => ({
      originalTasks: {
        ...state.originalTasks,
        [category]: state.originalTasks[category].filter(
          (task) => task._id !== taskId
        ),
      },
    })),

  deleteTaskCopiedStore: (category, taskId) =>
    set((state) => ({
      copiedTasks: {
        ...state.copiedTasks,
        [category]: state.copiedTasks[category].filter(
          (task) => task._id !== taskId
        ),
      },
    })),

  selectedTag: "",
  setSelectedTag: (tag) => set({ selectedTag: tag }),

  // today's task: due date today
  setTodaysTasks: (category) => {
    set((state) => ({
      copiedTasks: {
        ...state.copiedTasks,
        [category]: state.copiedTasks[category].filter((task) => {
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          return (
            dueDate.getDate() === today.getDate() &&
            dueDate.getMonth() === today.getMonth() &&
            dueDate.getFullYear() === today.getFullYear()
          );
        }),
      },
    }));
  },

  // Upcoming tasks
  setUpcomingTasks: (category) => {
    set((state) => ({
      copiedTasks: {
        ...state.copiedTasks,
        [category]: state.copiedTasks[category].filter((task) => {
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          return (
            dueDate.getDate() > today.getDate() &&
            dueDate.getMonth() >= today.getMonth() &&
            dueDate.getFullYear() >= today.getFullYear()
          );
        }),
      },
    }));
  },

  // Filter by tag
  filterTasksByTag: (category, tag) =>
    set((state) => ({
      copiedTasks: {
        ...state.copiedTasks,
        [category]: state.copiedTasks[category].filter(
          (task) => task.tag === tag
        ),
      },
    })),

  // Filter task by having atleast one tag
  filterTaskByHavingTagFun: (category) =>
    set((state) => ({
      copiedTasks: {
        ...state.copiedTasks,
        [category]: state.copiedTasks[category].filter(
          (task) => task.tag !== ""
        ),
      },
    })),
}));

export default useTaskStore;
