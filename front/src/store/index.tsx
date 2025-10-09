import { configureStore } from '@reduxjs/toolkit'
import patientReducer from './slices/patientSlice'
import pageReducer from './slices/pageSlice'

export const store = configureStore({
  reducer: {
    patients: patientReducer,
    pages:pageReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch