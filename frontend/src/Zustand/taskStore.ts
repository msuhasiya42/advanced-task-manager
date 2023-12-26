/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { TaskCategory } from "../components/Task/Types/types";
import { TaskType } from "../components/Task/Types/types";

type TaskStoreState = {
  allTasks: TaskType[]; // Add this for a list of all raw tasks
  setAllTasks: (tasks: TaskType[]) => void; 

  originalTasks: Record<TaskCategory, TaskType[]>;
  setOriginalTasks: (category: TaskCategory, newTasks: TaskType[]) => void;

  copiedTasks: Record<TaskCategory, TaskType[]>;
  copyTasks: () => void;

  setTasks: (category: TaskCategory, newTasks: TaskType[]) => void; // Adjusted this

  addTaskOrigStore: (category: TaskCategory, task: TaskType) => void;
  addTaskCopiedStore: (category: TaskCategory, task: TaskType) => void;

  updateTaskOrigStore: (category: TaskCategory, taskId: string, updatedTask: TaskType) => void;
  updateTaskCopiedStore: (category: TaskCategory, taskId: string, updatedTask: TaskType) => void;

  deleteTaskOrigStore: (category: TaskCategory, taskId: string) => void;
  deleteTaskCopiedStore: (category: TaskCategory, taskId: string) => void;

  selectedTag: string;
  setSelectedTag: (tag: string) => void;

  setTodaysTasks: (category: TaskCategory) => void;
  setUpcomingTasks: (category: TaskCategory) => void;

  filterTasksByTag: (category: TaskCategory, tag: string) => void;
  filterTaskByHavingTagFun: (category: TaskCategory) => void;

  removeTagFromTasks: (tagName: string) => void;
};

const useTaskStore = create<TaskStoreState>((set) => ({
  allTasks: [],
  setAllTasks: (tasks) => set({ allTasks: tasks }),

  originalTasks: {
    todo: [],
    inProgress: [],
    completed: [],
  },
  setOriginalTasks: (category, newTasks) => // Adjusted the type here
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
    originalTasks: {
      ...state.originalTasks,
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

  // delete tag from all tasks linked to it

  removeTagFromTasks: (tagName) =>
    set((state) => ({
      originalTasks: {
        todo: removeTagFromTasksByCategory(state.originalTasks.todo, tagName),
        inProgress: removeTagFromTasksByCategory(
          state.originalTasks.inProgress,
          tagName
        ),
        completed: removeTagFromTasksByCategory(
          state.originalTasks.completed,
          tagName
        ),
      },
      copiedTasks: {
        todo: removeTagFromTasksByCategory(state.copiedTasks.todo, tagName),
        inProgress: removeTagFromTasksByCategory(
          state.copiedTasks.inProgress,
          tagName
        ),
        completed: removeTagFromTasksByCategory(
          state.copiedTasks.completed,
          tagName
        ),
      },
    })),
}));

const removeTagFromTasksByCategory = (tasks: TaskType[], tagName: string) =>
  tasks.map((task) => {
    if (task.tag === tagName) {
      return {
        ...task,
        tag: "", // Remove the tag by setting it to an empty string
      };
    }
    return task;
  });

export default useTaskStore;
