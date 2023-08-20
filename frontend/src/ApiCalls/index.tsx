import axios from "redaxios";
import { TaskType } from "../components/Task/Types/types";

const API = axios.create({
  baseURL: "http://localhost:5000", // use env to store it and fetch
});

// user related apis
export function createUser(name: string, email: string, password: string) {
  return API.post("users/signup", {
    name,
    email,
    password,
  });
}

export function loginApi(email: string, password: string) {
  return API.post("users/login", {
    email,
    password,
  });
}

// login using google
export function googleLoginApi(tokenId: string) {
  return API.post("users/googleLoginApi", {
    token: tokenId,
  });
}

// check session
export function verifyToken(token: string) {
  return API.post("users/verifyToken", {
    token,
  });
}

export function getUserData(userId: string) {
  return API.get(`/users/getUserById/${userId}`);
}

// update user : to add new tags into user data
export function updateUserApi(
  userId: string | undefined,
  type: string,
  tag: string,
  photo?: string
) {
  // If a photo is provided, only send the photo data and skip the tag and type.
  const body = photo ? { photo } : { tag, type };

  return API.put(`/users/updateUser/${userId}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
/*________________________________________________*/

// task related apis
// Adding new task
export function createTask(title: string, status: string, user: string) {
  return API.post("tasks/createTask", {
    title,
    status,
    user,
  });
}

// get list of tasks
export function fetchTask(userId: string) {
  return API.get(`/tasks/fetchTasksByUserId/${userId}`);
}

// task Delete
export function deleteTaskApi(id: string) {
  return API.delete(`/tasks/deleteTask/${id}`);
}

// task update
export function updateTaskApi(id: string, task: TaskType) {
  return API.put(`tasks/updateTask/${id}`, {
    task,
  });
}
