export type TaskCategory = "todo" | "inProgress" | "completed";

export interface TaskType {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  attatchments: string[];
  tag: string;
  priority: string;
  status: TaskCategory;
  done: boolean;
  collaborators: string[]; // Assuming collaborators can be of any type
  user: string;
}

export interface TasksProps {
  task: TaskType;
  handleDelete: (task: TaskType) => void;
  handleTaskClick: (task: TaskType) => void;
}

export interface TaskCollection {
  todo: TaskType[];
  inProgress: TaskType[];
  completed: TaskType[];
}
