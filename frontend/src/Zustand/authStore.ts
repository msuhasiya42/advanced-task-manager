import { create } from "zustand";
import { User, otherUser } from "../components/Login/types";

/* eslint-disable no-unused-vars */
type AuthStoreState = {
  user: User | null;
  allUsers?: otherUser[];
  login: (userData: User) => void;
  addListOfUser: (users: otherUser[]) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
};

const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  login: (userData: User) => {
    set({ user: userData });
    localStorage.setItem("auth", JSON.stringify({ user: userData }));
  },

  addListOfUser: (users: otherUser[]) => {
    set({ allUsers: users });
    localStorage.setItem("allUsers", JSON.stringify({ allUsers: users }));
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem("auth");
    localStorage.removeItem("tags");
    localStorage.removeItem("allUsers");
  },
  updateUser: (updates: Partial<User>) => {
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...updates } : null;
      if (updatedUser) {
        localStorage.setItem("auth", JSON.stringify({ user: updatedUser }));
      }
      return { user: updatedUser };
    });
  },
}));

const userData = localStorage.getItem("auth");
const allUserData = localStorage.getItem("allUsers")
if (userData) {
  useAuthStore.setState(JSON.parse(userData));
}

if(allUserData) {
  useAuthStore.setState({ allUsers: JSON.parse(allUserData).allUsers });
}

export default useAuthStore;
