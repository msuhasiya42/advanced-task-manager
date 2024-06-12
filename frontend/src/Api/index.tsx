import axios from "redaxios";
import { TaskType } from "../components/Task/Types/types";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: API_BASE_URL,
});

const getHeader = () => {
  const token = localStorage.getItem("token");
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

function deleteFromAPI(endpoint: string, data?: object) {
  return API.delete(endpoint, {
    ...getHeader(),
    data,
  });
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

  updatePhoto: (userId: string, photo: string) => {
    return putToAPI(`/users/update/photo/${userId}`, { photo }, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateFilter: (userId: string, filter: string) => {
    return putToAPI(`/users/update/filter/${userId}`, { filter });
  },

  deleteUser: (id: string) => deleteFromAPI(`/users/delete/${id}`),

  getAllUsers: () => getFromAPI("users/getAllUsers"),
};

// Tag related APIs
export const tagAPI = {
  // Function to add a new tag
  addTag: (userId: string, name: string, color: string) => {
    const data = { userId, name, color };
    return postToAPI("tags/add", data);
  },

  // Function to delete a tag
  deleteTag: (userId: string, id: string) => {
    return deleteFromAPI(`tags/delete/${id}`, { userId });
  },

  // Function to update an existing tag
  updateTag: (id: string, userId: string, name: string, color: string) => {
    const data = { userId, name, color };
    return putToAPI(`tags/update/${id}`, data);
  },
};

// Task related APIs
export const taskAPI = {
  createTask: (taskData: object) =>
    postToAPI("tasks/add", taskData),

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


  deleteComment: (commentId: string) =>
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

