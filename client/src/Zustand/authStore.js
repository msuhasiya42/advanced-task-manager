import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  //   @Remember
  login: (userData) => {
    set({ user: userData });
    localStorage.setItem("authState", JSON.stringify({ user: userData }));
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem("authState");
    localStorage.removeItem("tags");
  },
}));
// @Remember
// Retrieve the authentication state from localStorage if available
const persistedState = localStorage.getItem("authState");
if (persistedState) {
  useAuthStore.setState(JSON.parse(persistedState));
}

export default useAuthStore;
