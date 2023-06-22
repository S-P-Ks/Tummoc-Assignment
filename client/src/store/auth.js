import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // for monitoring the registration process.
    token: null,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      const { user, token } = payload;
      const u = user != null ? user : "";
      state.user = u;
      state.token = token ?? "";
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: {},
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
