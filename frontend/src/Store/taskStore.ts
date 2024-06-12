/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { FilterType, TaskCategory } from "../components/Task/Types/types";
import { TaskType } from "../components/Task/Types/types";
import dayjs from "dayjs";
import { initialFilterValue } from "../components/Filter/Filter";
export interface Tag {
  _id: string;
  name: string;
  color: string;
}

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

  filterTasksByTag: (category: TaskCategory, tagId: string) => void;
  filterTaskByHavingTag: (category: TaskCategory) => void;

  removeTagFromAllTasks: (tagId: string) => void;
  updateTagsInTasks: (tagId: string, updatedTag: Tag) => void;
  // from tag store
  tags: Tag[];
  setTags: (newTags: Tag[]) => void;
  checkTagExists: (tag: string) => boolean;
  updateTags: (updatedTags: Tag[]) => void;

  // filter data
  filter: FilterType;
  updateFilter: (filter: FilterType) => void;
  clearFilter: () => void;

  // view
  view: string;
  setView: (view: string) => void;
};

const useTaskStore = create<TaskStoreState>((set, get) => {
    
  const user = localStorage.getItem("user");
  console.log("userDataInStore", user && JSON.parse(user))
  const initialTags: string[] = user ? JSON.parse(user)?.tags : [];
  const jsonFilter: string = user ? JSON.parse(user)?.filter : "";
  const initialFilter = jsonFilter ? JSON.parse(jsonFilter) : initialFilterValue

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

  // filter
  filter: initialFilter,

  // view
  view: "cardView",

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
  filterTasksByTag: (category: TaskCategory, tagId) =>
    set((state: TaskStoreState) => ({
      filteredTasks: {
        ...state.filteredTasks,
        [category]: state.filteredTasks[category].filter(
          (task: TaskType) => task.tags.some((t) => String(t._id) === String(tagId))
        ),
      },
    })),

  // Filter task by having at least one tag
  filterTaskByHavingTag: (category: TaskCategory) =>
    set((state: TaskStoreState) => ({
      filteredTasks: {
        ...state.filteredTasks,
        [category]: state.filteredTasks[category].filter(
          (task: TaskType) => task.tags?.length !== 0
        ),
      },
    })),

  // delete tag from all tasks linked to it
  removeTagFromAllTasks: (tagId: string) =>
    set((state: TaskStoreState) => ({
      tasksDataByCategory: {
        todo: removeTagFromTasksByCategory(state.tasksDataByCategory.todo, tagId),
        inProgress: removeTagFromTasksByCategory(
          state.tasksDataByCategory.inProgress,
          tagId
        ),
        completed: removeTagFromTasksByCategory(
          state.tasksDataByCategory.completed,
          tagId
        ),
      },
      filteredTasks: {
        todo: removeTagFromTasksByCategory(state.filteredTasks.todo, tagId),
        inProgress: removeTagFromTasksByCategory(
          state.filteredTasks.inProgress,
          tagId
        ),
        completed: removeTagFromTasksByCategory(
          state.filteredTasks.completed,
          tagId
        ),
      },
    })),

  updateTagsInTasks: (tagId: string, updatedTag: Tag) => {
    set((state: TaskStoreState) => ({
      tasksDataByCategory: {
        todo: updateTasksByCategory(state.tasksDataByCategory.todo, tagId, updatedTag),
        inProgress: updateTasksByCategory(state.tasksDataByCategory.inProgress, tagId, updatedTag),
        completed: updateTasksByCategory(state.tasksDataByCategory.completed, tagId, updatedTag),
      },
      filteredTasks: {
        todo: updateTasksByCategory(state.filteredTasks.todo, tagId, updatedTag),
        inProgress: updateTasksByCategory(state.filteredTasks.inProgress, tagId, updatedTag),
        completed: updateTasksByCategory(state.filteredTasks.completed, tagId, updatedTag),
      },
    }));
  },
    

  // for tags
  // setting tags when we fetch
  setTags: (newTags: Tag[]) => {
    set({ tags: newTags });
  },
  checkTagExists: (tagName: string) => {
    const state = get();
    return state.tags.some(tag => tag.name === tagName);
  },
  updateTags: (updatedTags: Tag[]) => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      parsedUser.tags = updatedTags;
      localStorage.setItem('user', JSON.stringify(parsedUser));
      set({ tags: updatedTags });
    }
    set({ tags: updatedTags });
  },

    // Apply filter
  updateFilter: (filter: FilterType) => {
    set((state: TaskStoreState) => {
      let filteredTasks: Record<TaskCategory, TaskType[]> = {
        todo: [...state.tasksDataByCategory.todo],
        inProgress: [...state.tasksDataByCategory.inProgress],
        completed: [...state.tasksDataByCategory.completed],
      };

      // Filter by due date
      if (filter.dueDate !== "") {
        const dueDate = new Date(filter.dueDate);
        filteredTasks = {
          todo: filteredTasks.todo.filter((task) => {
            const taskDueDate = new Date(task.dueDate);
            return (
              taskDueDate.getDate() === dueDate.getDate() &&
              taskDueDate.getMonth() === dueDate.getMonth() &&
              taskDueDate.getFullYear() === dueDate.getFullYear()
            );
          }),
          inProgress: filteredTasks.inProgress.filter((task) => {
            const taskDueDate = new Date(task.dueDate);
            return (
              taskDueDate.getDate() === dueDate.getDate() &&
              taskDueDate.getMonth() === dueDate.getMonth() &&
              taskDueDate.getFullYear() === dueDate.getFullYear()
            );
          }),
          completed: filteredTasks.completed.filter((task) => {
            const taskDueDate = new Date(task.dueDate);
            return (
              taskDueDate.getDate() === dueDate.getDate() &&
              taskDueDate.getMonth() === dueDate.getMonth() &&
              taskDueDate.getFullYear() === dueDate.getFullYear()
            );
          }),
        };
      }

      // Filter by priority
      if (filter.priority !== "") {
        filteredTasks = {
          todo: filteredTasks.todo.filter((task) => task.priority === filter.priority),
          inProgress: filteredTasks.inProgress.filter((task) => task.priority === filter.priority),
          completed: filteredTasks.completed.filter((task) => task.priority === filter.priority),
        };
      }

      // Filter by status
      if (filter.status?.length > 0) {
        filteredTasks = {
          todo: filteredTasks.todo.filter((task) => filter.status.includes(task.status)),
          inProgress: filteredTasks.inProgress.filter((task) => filter.status.includes(task.status)),
          completed: filteredTasks.completed.filter((task) => filter.status.includes(task.status)),
        };
      }

      // Filter by tags
      if (filter.tags?.length > 0) {
        filter.tags.forEach((filterTag) => {
          filteredTasks = {
            todo: filteredTasks.todo.filter((task) =>
              task.tags.some((tag) => tag.name === filterTag)
            ),
            inProgress: filteredTasks.inProgress.filter((task) =>
              task.tags.some((tag) => tag.name === filterTag)
            ),
            completed: filteredTasks.completed.filter((task) =>
              task.tags.some((tag) => tag.name === filterTag)
            ),
          };
        });
      }      

      // Filter by due date shortcuts
    if (filter.dueDateShortCuts?.length > 0) {
      filter.dueDateShortCuts.forEach((shortcut) => {
        switch (shortcut) {
          case "today":
            filteredTasks = filterTasksByShortcut(filteredTasks, "today");
            break;
          case "tomorrow":
            filteredTasks = filterTasksByShortcut(filteredTasks, "tomorrow");
            break;
          case "currentWeek":
            filteredTasks = filterTasksByShortcut(filteredTasks, "currentWeek");
            break;
          case "nextWeek":
            filteredTasks = filterTasksByShortcut(filteredTasks, "nextWeek");
            break;
          case "lastWeek":
            filteredTasks = filterTasksByShortcut(filteredTasks, "lastWeek");
            break;
          case "overdue":
            filteredTasks = filterTasksByShortcut(filteredTasks, "overdue");
            break;
          default:
            break;
        }
      });
    }

      localStorage.setItem("filter", JSON.stringify(filter));
      return { filteredTasks, filter: filter };
    });
  },

  // Clear filter function
  clearFilter: () => {
    set((state: TaskStoreState) => ({
      filteredTasks: {
        todo: [...state.tasksDataByCategory.todo],
        inProgress: [...state.tasksDataByCategory.inProgress],
        completed: [...state.tasksDataByCategory.completed],
      },
    }));
  },

  // setView
  setView: (view: string) => {
    set(() => ({
      view: view
    }));
  }
  }
});

const isDueOnDate = (dueDateString: string, targetDate: Date): boolean => {
  const dueDate = new Date(dueDateString);
  return (
    dueDate.getDate() === targetDate.getDate() &&
    dueDate.getMonth() === targetDate.getMonth() &&
    dueDate.getFullYear() === targetDate.getFullYear()
  );
};
const getWeekRange = (targetDate: dayjs.Dayjs) => {
  const startOfWeek = targetDate.startOf('week').toDate(); // Start of the current week (Monday)
  const endOfWeek = targetDate.endOf('week').toDate(); // End of the current week (Sunday)
  const startOfPastWeek = targetDate.subtract(1, 'week').startOf('week').toDate(); // Start of the past week (Monday)
  const endOfPastWeek = targetDate.subtract(1, 'week').endOf('week').toDate(); // End of the past week (Sunday)
  const startOfNextWeek = targetDate.add(1, 'week').startOf('week').toDate(); // Start of the next week (Monday)
  const endOfNextWeek = targetDate.add(1, 'week').endOf('week').toDate(); // End of the next week (Sunday)
  return { startOfWeek, endOfWeek, startOfPastWeek, endOfPastWeek, startOfNextWeek, endOfNextWeek };
};

const filterTasksByShortcut = (
  tasks: Record<TaskCategory, TaskType[]>,
  shortcut: string
): Record<TaskCategory, TaskType[]> => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { startOfWeek, endOfWeek, startOfPastWeek, endOfPastWeek, startOfNextWeek, endOfNextWeek } = getWeekRange(
    dayjs(today)
  );

  let filteredTasks: Record<TaskCategory, TaskType[]> = {
    todo: [...tasks.todo],
    inProgress: [...tasks.inProgress],
    completed: [...tasks.completed],
  };

  switch (shortcut) {
    case "today":
      filteredTasks = {
        todo: tasks.todo.filter((task) => isDueOnDate(task.dueDate, today)),
        inProgress: tasks.inProgress.filter((task) => isDueOnDate(task.dueDate, today)),
        completed: tasks.completed.filter((task) => isDueOnDate(task.dueDate, today)),
      };
      break;
    case "tomorrow":
      filteredTasks = {
        todo: tasks.todo.filter((task) => isDueOnDate(task.dueDate, tomorrow)),
        inProgress: tasks.inProgress.filter((task) => isDueOnDate(task.dueDate, tomorrow)),
        completed: tasks.completed.filter((task) => isDueOnDate(task.dueDate, tomorrow)),
      };
      break;
    case "currentWeek":
      filteredTasks = {
        todo: tasks.todo.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate <= endOfWeek && dueDate >= startOfWeek;
        }),
        inProgress: tasks.inProgress.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate <= endOfWeek && dueDate >= startOfWeek;
        }),
        completed: tasks.completed.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate <= endOfWeek && dueDate >= startOfWeek;
        }),
      };
      break;
    case "nextWeek":
      filteredTasks = {
        todo: tasks.todo.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate <= endOfNextWeek && dueDate >= startOfNextWeek;
        }),
        inProgress: tasks.inProgress.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate <= endOfNextWeek && dueDate >= startOfNextWeek;
        }),
        completed: tasks.completed.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate <= endOfNextWeek && dueDate >= startOfNextWeek;
        }),
      };
      break;
    case "lastWeek":
      filteredTasks = {
        todo: tasks.todo.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate <= endOfPastWeek && dueDate >= startOfPastWeek;
        }),
        inProgress: tasks.inProgress.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate <= endOfPastWeek && dueDate >= startOfPastWeek;
        }),
        completed: tasks.completed.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate <= endOfPastWeek && dueDate >= startOfPastWeek;
        }),
      };
      break;
    case "overdue":
      filteredTasks = {
        todo: tasks.todo.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate < today 
        }),
        inProgress: tasks.inProgress.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate < today 
        }),
        completed: tasks.completed.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate < today
        }),
      };
      break;
    default:
      break;
  }

  return filteredTasks;
};

const updateTasksByCategory = (tasks: TaskType[], tagId: string, updatedTag: Tag) => {
  return tasks.map(task => {
    task.tags = task.tags.map(tag => tag._id === tagId ? updatedTag: tag);
    return task;
  });
};


const removeTagFromTasksByCategory = (tasks: TaskType[], tagId: string) =>
  tasks.map((task) => {
    if (task.tags.some(tag => tag._id === tagId)) {
      return {
        ...task,
        tags: task.tags.filter((tag) => tag._id !== tagId),
      };
    }
    return task;
});

export default useTaskStore;
