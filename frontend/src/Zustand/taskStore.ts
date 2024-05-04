/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { FilterType, TaskCategory } from "../components/Task/Types/types";
import { TaskType } from "../components/Task/Types/types";

export type TaskStoreState = {
  allTasks: TaskType[];
  setAllTasks: (tasks: TaskType[]) => void; 

  tasksDataByCategory: Record<TaskCategory, TaskType[]>;
  setTasksDataByCategory: (category: TaskCategory, newTasks: TaskType[]) => void;

  filteredTasks: Record<TaskCategory, TaskType[]>;
  copyTasks: () => void;

  addTaskDataStore: (category: TaskCategory, task: TaskType) => void;
  addTaskFilteredTasksStore: (category: TaskCategory, task: TaskType) => void;

  updateTaskDataStore: (category: TaskCategory, taskId: string, updatedTask: TaskType) => void;
  updateTaskFilteredTasksStore: (category: TaskCategory, taskId: string, updatedTask: TaskType) => void;

  deleteTaskFromDataStore: (category: TaskCategory, taskId: string) => void;
  deleteTaskFilteredTasksStore: (category: TaskCategory, taskId: string) => void;

  setTodaysTasks: (category: TaskCategory) => void;
  setUpcomingTasks: (category: TaskCategory) => void;

  filterTasksByTag: (category: TaskCategory, tag: string) => void;
  filterTaskByHavingTag: (category: TaskCategory) => void;

  removeTagFromAllTasks: (tagName: string) => void;

  // from tag store
  tags: string[];
  setTags: (newTags: string[]) => void;
  checkTagExists: (tag: string) => boolean;
  addTag: (tag: string) => void;
  deleteTag: (tag: string) => void;

  // filter data
  filter: FilterType;
  applyFilter: (filter: FilterType) => void;
  clearFilter: () => void;
};

const useTaskStore = create<TaskStoreState>((set) => {
    
  const persistedTags = localStorage.getItem("tags");
  const initialTags: string[] = persistedTags ? JSON.parse(persistedTags) : [];

  return {
  allTasks: [],

  // tasks data store by category
  tasksDataByCategory: {
    todo: [],
    inProgress: [],
    completed: [],
  },

  // filtered task store
  filteredTasks: {
    todo: [],
    inProgress: [],
    completed: [],
  },

  // tags
  tags: initialTags,


  setAllTasks: (tasks: TaskType[]) => set({ allTasks: tasks }),

  setTasksDataByCategory: (category:TaskCategory, newTasks: TaskType[]) => // Adjusted the type here
    set((state: TaskStoreState) => ({
      tasksDataByCategory: {
        ...state.tasksDataByCategory,
        [category]: newTasks,
      },
    })),

  copyTasks: () =>
    set((state:TaskStoreState) => ({
      filteredTasks: state.tasksDataByCategory
    })),

  // add new task
  addTaskDataStore: (category: TaskCategory, task: TaskType) =>
    set((state: TaskStoreState) => ({
      tasksDataByCategory: {
        ...state.tasksDataByCategory,
        [category]: [...state.tasksDataByCategory[category], task],
      },
    })),

  addTaskFilteredTasksStore: (category: TaskCategory, task: TaskType) =>
    set((state: TaskStoreState) => ({
      filteredTasks: {
        ...state.filteredTasks,
        [category]: [...state.filteredTasks[category], task],
      },
    })),

  // update task
  updateTaskDataStore: (category: TaskCategory, taskId: string, updatedTask: TaskType) =>
    set((state: TaskStoreState) => ({
      tasksDataByCategory: {
        ...state.tasksDataByCategory,
        [category]: state.tasksDataByCategory[category].map((task: TaskType) =>
          task._id === taskId ? updatedTask : task
        ),
      },
    })),

  updateTaskFilteredTasksStore: (category: TaskCategory, taskId: string, updatedTask: TaskType) =>
    set((state: TaskStoreState) => ({
      filteredTasks: {
        ...state.filteredTasks,
        [category]: state.filteredTasks[category].map((task: TaskType) =>
          task._id === taskId ? updatedTask : task
        ),
      },
    })),

  // delete task
  deleteTaskFromDataStore: (category: TaskCategory, taskId: string) =>
    set((state: TaskStoreState) => ({
      tasksDataByCategory: {
        ...state.tasksDataByCategory,
        [category]: state.tasksDataByCategory[category].filter(
          (task) => task._id !== taskId
        ),
      },
    })),

  deleteTaskFilteredTasksStore: (category: TaskCategory, taskId: string) =>
    set((state: TaskStoreState) => ({
      filteredTasks: {
        ...state.filteredTasks,
        [category]: state.filteredTasks[category].filter(
          (task) => task._id !== taskId
        ),
      },
    })),

  // today's task: due date today
  setTodaysTasks: (category: TaskCategory) => {
    set((state: TaskStoreState) => ({
      filteredTasks: {
        ...state.filteredTasks,
        [category]: state.filteredTasks[category].filter((task: TaskType) => {
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
  setUpcomingTasks: (category: TaskCategory) => {
    set((state: TaskStoreState) => ({
      filteredTasks: {
        ...state.filteredTasks,
        [category]: state.filteredTasks[category].filter((task: TaskType) => {
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
  filterTasksByTag: (category: TaskCategory, tag: string) =>
    set((state: TaskStoreState) => ({
      filteredTasks: {
        ...state.filteredTasks,
        [category]: state.filteredTasks[category].filter(
          (task: TaskType) => task.tags.includes(tag)
        ),
      },
    })),

  // Filter task by having at least one tag
  filterTaskByHavingTag: (category: TaskCategory) =>
    set((state: TaskStoreState) => ({
      filteredTasks: {
        ...state.filteredTasks,
        [category]: state.filteredTasks[category].filter(
          (task: TaskType) => task.tags.length !== 0
        ),
      },
    })),

  // delete tag from all tasks linked to it
  removeTagFromAllTasks: (tag: string) =>
    set((state: TaskStoreState) => ({
      tasksDataByCategory: {
        todo: removeTagFromTasksByCategory(state.tasksDataByCategory.todo, tag),
        inProgress: removeTagFromTasksByCategory(
          state.tasksDataByCategory.inProgress,
          tag
        ),
        completed: removeTagFromTasksByCategory(
          state.tasksDataByCategory.completed,
          tag
        ),
      },
      filteredTasks: {
        todo: removeTagFromTasksByCategory(state.filteredTasks.todo, tag),
        inProgress: removeTagFromTasksByCategory(
          state.filteredTasks.inProgress,
          tag
        ),
        completed: removeTagFromTasksByCategory(
          state.filteredTasks.completed,
          tag
        ),
      },
    })),

  // for tags
  // setting tags when we fetch
  setTags: (newTags: string[]) =>
    set(() => {
      localStorage.setItem("tags", JSON.stringify(newTags));
      return { tags: newTags };
    }),

  // check tag is already there or not
  checkTagExists: (tag: string) => {
    const state: TaskStoreState = useTaskStore.getState();
    return state.tags.includes(tag);
  },

  // Add new tag
  addTag: (tag: string) =>
    set((state: TaskStoreState) => {
      const updatedTags = [...state.tags, tag];
      localStorage.setItem("tags", JSON.stringify(updatedTags));
      return { tags: updatedTags };
    }),

  // Delete tag from store and local storage
  deleteTag: (tag: string) =>
    set((state: TaskStoreState) => {
      const updatedTags = state.tags.filter((t: string) => t !== tag);
      localStorage.setItem("tags", JSON.stringify(updatedTags));
      return { tags: updatedTags };
    }),
  }
});

const removeTagFromTasksByCategory = (tasks: TaskType[], tagName: string) =>
  tasks.map((task) => {
    if (task.tags.includes(tagName)) {
      return {
        ...task,
        tags: task.tags.filter((tag) => tag !== tagName)
      };
    }
    return task;
  });

export default useTaskStore;
