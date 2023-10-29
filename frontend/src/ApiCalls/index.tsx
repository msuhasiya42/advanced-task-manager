import axios from "redaxios";
import { TaskType } from "../components/Task/Types/types";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";
const API = axios.create({
  baseURL: API_BASE_URL,
});

function postToAPI(endpoint: string, data: object) {
  return API.post(endpoint, data);
}

function getFromAPI(endpoint: string) {
  return API.get(endpoint);
}

function putToAPI(endpoint: string, data: object, config?: object) {
  return API.put(endpoint, data, config);
}

function deleteFromAPI(endpoint: string) {
  return API.delete(endpoint);
}

// User related APIs
export const userAPI = {
  createUser: (name: string, email: string, password: string) =>
    postToAPI("users/signup", { name, email, password }),

  login: (email: string, password: string) =>
    postToAPI("users/login", { email, password }),

  googleLogin: (tokenId: string) =>
    postToAPI("users/googleLoginApi", { token: tokenId }),

  verifyToken: (token: string) => postToAPI("users/verifyToken", { token }),

  getUserData: (userId: string) => getFromAPI(`/users/getUserById/${userId}`),

  updateUser: (
    userId: string | undefined,
    type: string,
    tag: string,
    photo?: string
  ) => {
    const body = photo ? { photo } : { tag, type };
    return putToAPI(`/users/updateUser/${userId}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Task related APIs
export const taskAPI = {
  createTask: (title: string, status: string, user: string) =>
    postToAPI("tasks/createTask", { title, status, user }),

  fetchTask: (userId: string) =>
    getFromAPI(`/tasks/fetchTasksByUserId/${userId}`),

  deleteTask: (id: string) => deleteFromAPI(`/tasks/deleteTask/${id}`),

  updateTask: (id: string, task: TaskType) =>
    putToAPI(`tasks/updateTask/${id}`, { task }),
};
