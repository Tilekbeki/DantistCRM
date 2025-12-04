// store/index.tsx
import { configureStore } from '@reduxjs/toolkit'
import patientReducer from './slices/patientSlice'
import pageReducer from './slices/pageSlice'
import { patientApi } from './services/PatientApi'
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
  reducer: {
    patients: patientReducer,
    pages: pageReducer,
    [patientApi.reducerPath]: patientApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(patientApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch