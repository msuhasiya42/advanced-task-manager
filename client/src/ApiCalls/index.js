import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // use env to store it and fetch
});

export function createUser(name, email, password) {
  return API.post("/signup", {
    name,
    email,
    password,
  });
}

export function login(email, password) {
  return API.post("/login", {
    email,
    password,
  });
}

export function getUserData(userId) {
  return axios.get(`/api/users/${userId}`);
}
