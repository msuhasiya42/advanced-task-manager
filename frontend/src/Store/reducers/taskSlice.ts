import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialFilterValue } from "../../components/Filter/Filter";
import {
  TaskType,
  TaskCategory,
  FilterType,
} from "../../components/Task/Types/types";

export interface Tag {
  _id: string;
  name: string;
  color: string;
}

interface TaskStoreState {
  allTasks: TaskType[];
  tasksDataByCategory: Record<TaskCategory, TaskType[]>;
  filteredTasks: Record<TaskCategory, TaskType[]>;
  tags: Tag[];
  filter: FilterType;
  view: string;
}

const user = localStorage.getItem("user");
const initialTags: Tag[] = user ? JSON.parse(user)?.tags : [];
const jsonFilter: string = user ? JSON.parse(user)?.filter : "";
const initialFilter = jsonFilter ? JSON.parse(jsonFilter) : initialFilterValue;

const initialState: TaskStoreState = {
  allTasks: [],
  tasksDataByCategory: {
    todo: [],
    inProgress: [],
    completed: [],
  },
  filteredTasks: {
    todo: [],
    inProgress: [],
    completed: [],
  },
  tags: initialTags,
  filter: initialFilter,
  view: "cardView",
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setAllTasks(state, action: PayloadAction<TaskType[]>) {
      state.allTasks = action.payload;
    },
    setTasksDataByCategory(
      state,
      action: PayloadAction<{ category: TaskCategory; newTasks: TaskType[] }>
    ) {
      state.tasksDataByCategory[action.payload.category] =
        action.payload.newTasks;
    },
    copyTasks(state) {
      state.filteredTasks = { ...state.tasksDataByCategory };
    },
    addTaskDataStore(
      state,
      action: PayloadAction<{ category: TaskCategory; task: TaskType }>
    ) {
      state.tasksDataByCategory[action.payload.category].push(
        action.payload.task
      );
    },
    addTaskFilteredTasksStore(
      state,
      action: PayloadAction<{ category: TaskCategory; task: TaskType }>
    ) {
      state.filteredTasks[action.payload.category].push(action.payload.task);
    },
    updateTaskDataStore(
      state,
      action: PayloadAction<{
        category: TaskCategory;
        taskId: string;
        updatedTask: TaskType;
      }>
    ) {
      state.tasksDataByCategory[action.payload.category] =
        state.tasksDataByCategory[action.payload.category].map((task) =>
          task._id === action.payload.taskId ? action.payload.updatedTask : task
        );
    },
    updateTaskFilteredTasksStore(
      state,
      action: PayloadAction<{
        category: TaskCategory;
        taskId: string;
        updatedTask: TaskType;
      }>
    ) {
      state.filteredTasks[action.payload.category] = state.filteredTasks[
        action.payload.category
      ].map((task) =>
        task._id === action.payload.taskId ? action.payload.updatedTask : task
      );
    },
    deleteTaskFromDataStore(
      state,
      action: PayloadAction<{ category: TaskCategory; taskId: string }>
    ) {
      state.tasksDataByCategory[action.payload.category] =
        state.tasksDataByCategory[action.payload.category].filter(
          (task) => task._id !== action.payload.taskId
        );
    },
    deleteTaskFilteredTasksStore(
      state,
      action: PayloadAction<{ category: TaskCategory; taskId: string }>
    ) {
      state.filteredTasks[action.payload.category] = state.filteredTasks[
        action.payload.category
      ].filter((task) => task._id !== action.payload.taskId);
    },
    setTodaysTasks(state, action: PayloadAction<TaskCategory>) {
      const today = new Date();
      state.filteredTasks[action.payload] = state.tasksDataByCategory[
        action.payload
      ].filter((task) => {
        const dueDate = new Date(task.dueDate);
        return (
          dueDate.getDate() === today.getDate() &&
          dueDate.getMonth() === today.getMonth() &&
          dueDate.getFullYear() === today.getFullYear()
        );
      });
    },
    setUpcomingTasks(state, action: PayloadAction<TaskCategory>) {
      const today = new Date();
      state.filteredTasks[action.payload] = state.tasksDataByCategory[
        action.payload
      ].filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate > today;
      });
    },
    filterTasksByTag(
      state,
      action: PayloadAction<{ category: TaskCategory; tagId: string }>
    ) {
      state.filteredTasks[action.payload.category] = state.tasksDataByCategory[
        action.payload.category
      ].filter((task) =>
        task.tags.some(
          (t: Tag) => String(t._id) === String(action.payload.tagId)
        )
      );
    },
    filterTaskByHavingTag(state, action: PayloadAction<TaskCategory>) {
      state.filteredTasks[action.payload] = state.tasksDataByCategory[
        action.payload
      ].filter((task) => task.tags?.length !== 0);
    },
    removeTagFromAllTasks(state, action: PayloadAction<string>) {
      const removeTagFromTasksByCategory = (tasks: TaskType[], tagId: string) =>
        tasks.map((task) => ({
          ...task,
          tags: task.tags.filter((tag) => tag._id !== tagId),
        }));

      state.tasksDataByCategory = {
        todo: removeTagFromTasksByCategory(
          state.tasksDataByCategory.todo,
          action.payload
        ),
        inProgress: removeTagFromTasksByCategory(
          state.tasksDataByCategory.inProgress,
          action.payload
        ),
        completed: removeTagFromTasksByCategory(
          state.tasksDataByCategory.completed,
          action.payload
        ),
      };
      state.filteredTasks = {
        todo: removeTagFromTasksByCategory(
          state.filteredTasks.todo,
          action.payload
        ),
        inProgress: removeTagFromTasksByCategory(
          state.filteredTasks.inProgress,
          action.payload
        ),
        completed: removeTagFromTasksByCategory(
          state.filteredTasks.completed,
          action.payload
        ),
      };
    },
    updateTagsInTasks(
      state,
      action: PayloadAction<{ tagId: string; updatedTag: Tag }>
    ) {
      const updateTasksByCategory = (
        tasks: TaskType[],
        tagId: string,
        updatedTag: Tag
      ) =>
        tasks.map((task) => ({
          ...task,
          tags: task.tags.map((tag) => (tag._id === tagId ? updatedTag : tag)),
        }));

      state.tasksDataByCategory = {
        todo: updateTasksByCategory(
          state.tasksDataByCategory.todo,
          action.payload.tagId,
          action.payload.updatedTag
        ),
        inProgress: updateTasksByCategory(
          state.tasksDataByCategory.inProgress,
          action.payload.tagId,
          action.payload.updatedTag
        ),
        completed: updateTasksByCategory(
          state.tasksDataByCategory.completed,
          action.payload.tagId,
          action.payload.updatedTag
        ),
      };
      state.filteredTasks = {
        todo: updateTasksByCategory(
          state.filteredTasks.todo,
          action.payload.tagId,
          action.payload.updatedTag
        ),
        inProgress: updateTasksByCategory(
          state.filteredTasks.inProgress,
          action.payload.tagId,
          action.payload.updatedTag
        ),
        completed: updateTasksByCategory(
          state.filteredTasks.completed,
          action.payload.tagId,
          action.payload.updatedTag
        ),
      };
    },
    setTags(state, action: PayloadAction<Tag[]>) {
      state.tags = action.payload;
    },
    updateTags(state, action: PayloadAction<Tag[]>) {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        parsedUser.tags = action.payload;
        localStorage.setItem("user", JSON.stringify(parsedUser));
      }
      state.tags = action.payload;
    },
    updateFilter(state, action: PayloadAction<FilterType>) {
      let filteredTasks: Record<TaskCategory, TaskType[]> = {
        todo: [...state.tasksDataByCategory.todo],
        inProgress: [...state.tasksDataByCategory.inProgress],
        completed: [...state.tasksDataByCategory.completed],
      };

      const filter = action.payload;

      if (filter.dueDate !== "") {
        const dueDate = new Date(filter.dueDate);
        filteredTasks = {
          todo: filteredTasks.todo.filter((task) =>
            isDueOnDate(task.dueDate, dueDate)
          ),
          inProgress: filteredTasks.inProgress.filter((task) =>
            isDueOnDate(task.dueDate, dueDate)
          ),
          completed: filteredTasks.completed.filter((task) =>
            isDueOnDate(task.dueDate, dueDate)
          ),
        };
      }

      if (filter.priority !== "") {
        filteredTasks = {
          todo: filteredTasks.todo.filter(
            (task) => task.priority === filter.priority
          ),
          inProgress: filteredTasks.inProgress.filter(
            (task) => task.priority === filter.priority
          ),
          completed: filteredTasks.completed.filter(
            (task) => task.priority === filter.priority
          ),
        };
      }

      if (filter.status?.length > 0) {
        filteredTasks = {
          todo: filteredTasks.todo.filter((task) =>
            filter.status.includes(task.status)
          ),
          inProgress: filteredTasks.inProgress.filter((task) =>
            filter.status.includes(task.status)
          ),
          completed: filteredTasks.completed.filter((task) =>
            filter.status.includes(task.status)
          ),
        };
      }

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

      state.filter = filter;
      state.filteredTasks = filteredTasks;
    },
    updateView(state, action: PayloadAction<string>) {
      state.view = action.payload;
    },
  },
});

export const {
  setAllTasks,
  setTasksDataByCategory,
  copyTasks,
  addTaskDataStore,
  addTaskFilteredTasksStore,
  updateTaskDataStore,
  updateTaskFilteredTasksStore,
  deleteTaskFromDataStore,
  deleteTaskFilteredTasksStore,
  setTodaysTasks,
  setUpcomingTasks,
  filterTasksByTag,
  filterTaskByHavingTag,
  removeTagFromAllTasks,
  updateTagsInTasks,
  setTags,
  updateTags,
  updateFilter,
  updateView,
} = taskSlice.actions;

export default taskSlice.reducer;

// Utility functions
const isDueOnDate = (dueDateString: string, targetDate: Date): boolean => {
  const dueDate = new Date(dueDateString);
  return (
    dueDate.getDate() === targetDate.getDate() &&
    dueDate.getMonth() === targetDate.getMonth() &&
    dueDate.getFullYear() === targetDate.getFullYear()
  );
};
