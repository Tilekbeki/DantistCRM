// store/slices/personalSlice.tsx
import { createSlice } from '@reduxjs/toolkit';

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointmentsList: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addAppointments: (state, action) => {
      state.appointmentsList = action.payload;
    },
    removeAppointment: (state, action) => {
      state.appointmentsList = state.appointmentsList.filter((p) => p.id !== action.payload);
    },
  },
});

export const { clearError, addAppointments, removeAppointment } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
