// store/index.tsx
import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './slices/patientSlice';
import pageReducer from './slices/pageSlice';
import { patientApi } from './services/PatientApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import { personalApi } from './services/PersonalApi';
import personalReducer from './slices/personalSlice';
import { appointmentApi } from './services/AppointmentsApi';

export const store = configureStore({
  reducer: {
    patients: patientReducer,
    personals: personalReducer,
    pages: pageReducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [personalApi.reducerPath]: personalApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(patientApi.middleware, personalApi.middleware, appointmentApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
