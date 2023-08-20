import { create } from "zustand";

export type User = {
  id: string;
  name: string;
  token: string;
  email: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  locale?: string;
  picture: string;
  // ... any other properties from your user object ...
};


type AuthStoreState = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
};

const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  login: (userData: User) => {
    set({ user: userData });
    localStorage.setItem("authState", JSON.stringify({ user: userData }));
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
