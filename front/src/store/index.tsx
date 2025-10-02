import { configureStore } from '@reduxjs/toolkit'
import patientReducer from './slices/patientSlice'

export const store = configureStore({
  reducer: {
    patients: patientReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch