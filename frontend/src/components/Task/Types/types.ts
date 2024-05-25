import { CheckboxValueType } from "antd/es/checkbox/Group";
import { Tag } from "../../../Store/taskStore";
import { User } from "../../../Store/authStore";

export type TaskCategory = "todo" | "inProgress" | "completed";

export interface CollabUser {
   _id: string,
   picture?: string
   name?: string
}

export interface Collaborator {
  user: CollabUser;
  permissionType: 'read' | 'edit' | 'admin';
}


export interface TaskType {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  attachments: string[];
  tags: Tag[];
  priority: string;
  status: TaskCategory;
  done: boolean;
  collaborators: Collaborator[];
  user: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
/* eslint-disable no-unused-vars */
export interface TasksProps {
  task: TaskType;
  handleDelete: (task: TaskType) => void;
  handleTaskClick?: (task: TaskType) => void;
}

export interface TaskCollection {
  todo: TaskType[];
  inProgress: TaskType[];
  completed: TaskType[];
}

export interface FilterType {
  dueDateShortCuts: CheckboxValueType[];
  dueDate: string;
  tags: string[];
  priority: string;
  status: string[]
}

export interface ReactionType {
  _id?: string;
  emoji: string;
  user: string | User; 
}

export interface ReplyType {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  createdAt: string;
  updatedAt: string;
  reactions: ReactionType[];
}

export interface CommentType {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  createdAt: string;
  updatedAt: string;
  reactions: ReactionType[];
  replies: ReplyType[];
}

