// store/slices/personalSlice.tsx
import { createSlice } from '@reduxjs/toolkit';

const personalSlice = createSlice({
  name: 'personals',
  initialState: {
    personalsList: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addPersonal: (state, action) => {
      state.personalsList[action.payload.id] = action.payload;
    },
    removePersonal: (state, action) => {
      state.personalsList = state.personalsList.filter((p) => p.id !== action.payload);
    },
  },
});

export const { clearError, addPersonal, removePersonal } = personalSlice.actions;
export default personalSlice.reducer;
