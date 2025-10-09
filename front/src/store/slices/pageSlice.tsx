import { createSlice } from "@reduxjs/toolkit";

const pageReducer = createSlice({
  name: "pages",
  initialState: {
    currentPage: 'homePage',
  },
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});


export const { changePage } = pageReducer.actions;
export default pageReducer.reducer;