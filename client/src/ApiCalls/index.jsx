import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // use env to store it and fetch
});

// user related apis
export function createUser(name, email, password) {
  return API.post("users/signup", {
    name,
    email,
    password,
  });
}

export function login(email, password) {
  return API.post("users/login", {
    email,
    password,
  });
}

export function getUserData(userId) {
  return API.get(`/users/getUserById/${userId}`);
}

// task related apis
// Adding new task
export function createTask(title, status, user) {
  return API.post("tasks/createTask", {
    title,
    status,
    user,
  });
}

// get list of tasks
export function fetchTask(userId) {
  return API.get(`/tasks/fetchTasksByUserId/${userId}`);
}

// task Delete
export function deleteTask(id) {
  return API.delete(`/tasks/deleteTask/${id}`);
}

// task update
//@TODO
export function updateTask(id, task) {
  // const currentDateTime = new Date();
  return API.put(`/tasks/updateTask/${id}`, {
    task,
  });
}
