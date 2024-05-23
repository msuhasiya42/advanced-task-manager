import axios, { Options } from "redaxios";
import { TaskType } from "../components/Task/Types/types";
import { Tag } from "../Store/taskStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: API_BASE_URL,
});

const getHeader = () => {
  const auth = localStorage.getItem("auth");
  const parsedUser = auth ? JSON.parse(auth)?.user : null;
  const token = parsedUser?.token;
  if (!token) {
    console.log("no token found")
  };
  return {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}

function postToAPI(endpoint: string, data: object) {
  return API.post(endpoint, data, getHeader());
}

function getFromAPI(endpoint: string) {
  return API.get(endpoint, getHeader());
}

// change type of config , don't use any
function putToAPI(endpoint: string, data: object, config?: Object) {
  return API.put(endpoint, data, getHeader());
}

function deleteFromAPI(endpoint: string) {
  return API.delete(endpoint, getHeader());
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

  getUserData: (id: string) => getFromAPI(`/users/getById/${id}`),

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

// Comment related APIs
export const commentAPI = {

  // Comment apis
  getComments: (taskId: string) => getFromAPI(`/comments/task/${taskId}`),

  addComment: (taskId: string, content: string, authorId: string) =>
    postToAPI(`/comments/task/${taskId}/add`, { content, authorId }),

  editComment: (commentId: string, content: string) =>
    putToAPI(`/comments/${commentId}/edit`, { content }),


  deleteComment: (commentId: string, token: string) =>
    deleteFromAPI(`/comments/${commentId}/delete`),


  // reply apis
  addReply: (commentId: string, content: string, authorId: string) =>
    postToAPI(`/comments/${commentId}/reply/add`, { content, authorId }),

  editReply: (replyId: string, content: string) =>
    putToAPI(`/comments/replies/${replyId}/edit`, { content }),

  deleteReply: (replyId: string) =>
    deleteFromAPI(`/comments/replies/${replyId}/delete`),

  // reaction apis
  addReaction: (commentId: string, emoji: string, authorId: string) =>
    postToAPI(`/comments/${commentId}/reaction/add`, { emoji, authorId }),

  deleteReaction: (reactionId: string) =>
    deleteFromAPI(`/comments/reactions/${reactionId}/delete`),
};

