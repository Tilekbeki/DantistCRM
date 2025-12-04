// store/slices/patientSlice.tsx
import { createSlice } from "@reduxjs/toolkit";

const patientSlice = createSlice({
  name: "patients",
  initialState: {
    patientsList: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Добавьте reducers если нужны локальные изменения
    addPatient: (state, action) => {
      state.patientsList.push(action.payload);
    },
    removePatient: (state, action) => {
      state.patientsList = state.patientsList.filter(p => p.id !== action.payload);
    },
  },
});

export const { clearError, addPatient, removePatient } = patientSlice.actions;
export default patientSlice.reducer;