// store/index.tsx
import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './slices/patientSlice';
import pageReducer from './slices/pageSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import personalReducer from './slices/personalSlice';
import {serviceApi, appointmentApi, personalApi, patientApi} from './services'
import serviceReducer from './slices/serviceSlice';

export const store = configureStore({
  reducer: {
    patients: patientReducer,
    personals: personalReducer,
    pages: pageReducer,
    services: serviceReducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [personalApi.reducerPath]: personalApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(patientApi.middleware, personalApi.middleware, appointmentApi.middleware,serviceApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
