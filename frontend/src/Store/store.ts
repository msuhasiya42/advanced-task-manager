import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import taskSlice from "./reducers/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: taskSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
