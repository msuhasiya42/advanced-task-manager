import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import taskSlice from "./reducers/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: taskSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
