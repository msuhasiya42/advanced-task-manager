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
export function createTask(title, status) {
  return API.post("tasks/createTask", {
    title,
    status,
  });
}

// task update
export function updateTask(title, description, dueDate, priority) {
  const currentDateTime = new Date();

  return API.post("tasks/updateTask", {
    title,
    description,
    dueDate,
    priority,
    currentDateTime,
  });
}
