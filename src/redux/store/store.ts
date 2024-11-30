import { configureStore } from "@reduxjs/toolkit";
import homeReducer from './features/homeSlice';
import sidebarReducer from './features/sidebarSlice';

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    home: homeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;