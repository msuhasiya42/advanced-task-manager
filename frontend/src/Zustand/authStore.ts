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
  user: User ;
  login: (userData: User) => void;
  logout: () => void;
};

const initialState = {
  id: '',
  name: '',
  token: '',
  email: '',
  picture: '' }

const useAuthStore = create<AuthStoreState>((set) => ({
  user: initialState,
  login: (userData: User) => {
    set({ user: userData });
    localStorage.setItem("authState", JSON.stringify({ user: userData }));
  },
  logout: () => {
    set({ user: initialState });
    localStorage.removeItem("authState");
    localStorage.removeItem("tags");
  },
}));

const persistedState = localStorage.getItem("authState");
if (persistedState) {
  useAuthStore.setState(JSON.parse(persistedState));
}

export default useAuthStore;
