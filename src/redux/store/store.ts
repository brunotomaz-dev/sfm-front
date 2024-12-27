import { configureStore } from "@reduxjs/toolkit";
import homeReducer from './features/homeSlice';
import sidebarReducer from './features/sidebarSlice';
import userReducer from './features/userSlice';

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    home: homeReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;