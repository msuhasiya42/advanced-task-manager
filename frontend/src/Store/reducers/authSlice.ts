// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthData, otherUser } from "../../components/Login/types";
import { Tag } from "../taskStore";
import { RootState } from "../store";

export interface User {
  _id: string;
  name: string;
  email: string;
  picture: string;
  tags?: Tag[];
  filter?: string;
}

interface AuthState {
  user: User | null;
  token?: string;
  allUsers?: otherUser[];
}

// Function to load user data from local storage
const loadUserFromLocalStorage = (): User | null => {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};

// Function to load all users from local storage
const loadAllUsersFromLocalStorage = (): otherUser[] | undefined => {
  const allUserData = localStorage.getItem("allUsers");
  return allUserData ? JSON.parse(allUserData).allUsers : undefined;
};

const initialState: AuthState = {
  user: loadUserFromLocalStorage(), // Initialize user from local storage
  token: localStorage.getItem("token") || undefined,
  allUsers: loadAllUsersFromLocalStorage(), // Initialize allUsers from local storage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthData>) => {
      const { _id, name, email, picture, filter, tags, token } = action.payload;
      const userData = {
        _id,
        name,
        email,
        picture,
        filter,
        tags,
      };
      state.user = userData;
      state.token = token;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    addListOfUser: (state, action: PayloadAction<otherUser[]>) => {
      state.allUsers = action.payload;
      localStorage.setItem(
        "allUsers",
        JSON.stringify({ allUsers: action.payload })
      );
    },
    logout: (state) => {
      state.user = null;
      state.token = undefined;
      state.allUsers = undefined;

      localStorage.removeItem("user");
      localStorage.removeItem("allUsers");
      localStorage.removeItem("token");
      localStorage.removeItem("filter");
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { login, setUser, addListOfUser, logout, updateUser } =
  authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectAllUsers = (state: RootState) => state.auth.allUsers;

export default authSlice.reducer;
