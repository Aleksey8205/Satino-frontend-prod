import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  authentificated: false,
  errorMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checkAuthSuccess(state, action) {
      state.user = action.payload;
      state.authentificated = true;
    },
    loginSuccess(state, action) {
      state.user = action.payload;
      state.authentificated = true;
    },
    loginError(state, action) {
      state.errorMessage = action.payload;
      state.authentificated = false;
    },
    logout(state) {
      state.user = null;
      state.authentificated = false;
      state.errorMessage = null;
    },
  },
});

export const {checkAuthSuccess, loginSuccess, loginError, logout } = authSlice.actions;
export default authSlice.reducer;