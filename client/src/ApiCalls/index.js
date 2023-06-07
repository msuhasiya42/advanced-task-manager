import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // replace with your Express server URL
});

export const signUp = async (email, password) => {
  try {
    const response = await API.post("/signup");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSomeData = async () => {
  try {
    const response = await API.get("/api/some-data");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
