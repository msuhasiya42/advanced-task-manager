import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  //   @Remember
  login: (userData, authToken) => {
    set({ user: userData, token: authToken });
    localStorage.setItem(
      "authState",
      JSON.stringify({ user: userData, token: authToken })
    );
  },
  logout: () => {
    set({ user: null, token: null });
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
