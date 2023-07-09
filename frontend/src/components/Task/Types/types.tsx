export interface TaskType {
  _id: number;
  title: string;
  description: string;
  startDate: Date;
  dueDate: Date;
  attatchments: [string];
  tag: string;
  priority: string;
  status: string;
  done: boolean;
  collaborators: string[]; // Assuming collaborators can be of any type
  user: string;
}

export interface TasksProps {
  task: TaskType;
  handleDelete: (task) => void;
  handleTaskClick: (task) => void;
}

export interface TaskCollection {
  todo: TaskType[];
  inProgress: TaskType[];
  completed: TaskType[];
}
