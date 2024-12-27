import { createSlice } from "@reduxjs/toolkit";

interface CountState {
  count: number;
}

const initialState: CountState = {
  count: 0,
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
  },
});

export const { increment } = homeSlice.actions;
export default homeSlice.reducer;