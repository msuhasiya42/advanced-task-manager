import axios from "redaxios";
import { TaskType } from "../components/Task/Types/types";
import { Tag } from "../Store/taskStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
  createUser: (
    name: string,
    email: string,
    password: string,
    picture: string
  ) => postToAPI("users/signup", { name, email, password, picture }),

  login: (email: string, password: string) =>
    postToAPI("users/login", { email, password }),

  googleLogin: (tokenId: string) =>
    postToAPI("users/googleLoginApi", { token: tokenId }),

  verifyToken: (token: string) => postToAPI("users/verifyToken", { token }),

  getUserData: (userId: string) => getFromAPI(`/users/getUserById/${userId}`),

  updateUserTag: (userId: string, tags: Tag[]) => {
    return putToAPI(`/users/update/${userId}`, { tags, type: "tag" });
  },

  updateUserPhoto: (userId: string, photo: string) => {
    const body = { photo, type: "photo" };
    return putToAPI(`/users/update/${userId}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateUserFilter: (userId: string, filter: string) => {
    return putToAPI(`/users/update/${userId}`, { filter, type: "filter" });
  },

  deleteUser: (id: string) => deleteFromAPI(`/users/delete/${id}`),

  getAllUsers: () => getFromAPI("users/getAllUsers"),
};

// Task related APIs
export const taskAPI = {
  createTask: (title: string, status: string, user: string) =>
    postToAPI("tasks/add", { title, status, user }),

  fetchTask: (userId: string) =>
    getFromAPI(`/tasks/getByUserId/${userId}`),

  deleteTask: (id: string) => deleteFromAPI(`/tasks/delete/${id}`),

  updateTask: (id: string, task: TaskType) =>
    putToAPI(`tasks/update/${id}`, { task }),
};
