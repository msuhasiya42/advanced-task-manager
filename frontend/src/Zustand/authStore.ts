import { create } from "zustand";
import { User, otherUser } from "../components/Login/types";
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
    localStorage.setItem("authState", JSON.stringify({ user: userData }));
  },

  addListOfUser: (users: otherUser[]) => {
    set({ allUsers: users });
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem("authState");
    localStorage.removeItem("tags");
  },
  updateUser: (updates: Partial<User>) => {
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...updates } : null;
      if (updatedUser) {
        localStorage.setItem("authState", JSON.stringify({ user: updatedUser }));
      }
      return { user: updatedUser };
    });
  },
}));

const persistedState = localStorage.getItem("authState");
if (persistedState) {
  useAuthStore.setState(JSON.parse(persistedState));
}

export default useAuthStore;
