// store/slices/personalSlice.tsx
import { createSlice } from '@reduxjs/toolkit';

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    servicesList: {},
    categoriesList: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addService: (state, action) => {
      state.servicesList[action.payload.id] = action.payload;
    },
    removeService: (state, action) => {
      state.servicesList = state.servicesList.filter((p) => p.id !== action.payload);
    },
    addCategory: (state, action) => {
        state.categoriesList[action.payload.id] = action.payload;
    },
    removeCategory: (state, action) => {
      state.categoriesList = state.categoriesList.filter((p) => p.id !== action.payload);
    }
  },
});

export const { clearError, addService, removeService, addCategory, removeCategory } = serviceSlice.actions;
export default serviceSlice.reducer;
