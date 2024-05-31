import { create } from "zustand";
import { AuthData, otherUser } from "../components/Login/types";
import { Tag } from "./taskStore";


export interface User {
  _id: string;
  name: string;
  email: string;
  picture: string;
  tags?: Tag[];
  filter?:string
}

/* eslint-disable no-unused-vars */
type AuthStoreState = {
  user: User | null;
  token?: string;
  allUsers?: otherUser[];
  login: (authData: AuthData) => void;
  setUser: (userData: User) => void;
  addListOfUser: (users: otherUser[]) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
};

const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  login: (authData: AuthData) => {
    const userData = {
      _id: authData._id,
      name: authData.name,
      email: authData.email,
      picture : authData.picture,
      filter : authData.filter,
      tags : authData.tags
    }
    set({ user: userData, token: authData.token });
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authData.token);
  },

  setUser: (userData: User) => {
    set({ user: userData });
    localStorage.setItem("user", JSON.stringify(userData));
  },

  addListOfUser: (users: otherUser[]) => {
    set({ allUsers: users });
    localStorage.setItem("allUsers", JSON.stringify({ allUsers: users }));
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem("user");
    localStorage.removeItem("allUsers");
    localStorage.removeItem("token");
    localStorage.removeItem("filter");
  },
  updateUser: (updates: Partial<User>) => {
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...updates } : null;
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },
}));

const userData = localStorage.getItem("user");
const allUserData = localStorage.getItem("allUsers")
if (userData) {
  useAuthStore.setState({user: JSON.parse(userData)});
}

if(allUserData) {
  useAuthStore.setState({ allUsers: JSON.parse(allUserData).allUsers });
}

export default useAuthStore;
