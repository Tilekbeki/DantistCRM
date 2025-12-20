import { createSlice } from '@reduxjs/toolkit';

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthState {
  isAuth: boolean;
  user: User | null;
  token: null;
  id: null;
}

const initialState: AuthState = {
  isAuth: false,
  user: null,
  token: null,
  id: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.isAuth = true;
      state.user = action.payload;
      state.token = action.payload.token;
      state.id = action.payload.userId;
    },
    clearAuth(state) {
      state.isAuth = false;
      state.user = null;
      state.token = null;
      state.id = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
