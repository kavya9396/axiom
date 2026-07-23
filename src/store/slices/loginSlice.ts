import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "../thunks/loginThunk";
import type { LoginResponse } from "../../types/login";

interface AppState {
  auth: {
    user: LoginResponse  | null;
    loading: boolean;
    error: string | null;
  };
}

const initialState: AppState = {
  auth: {
    user: null,
    loading: false,
    error: null,
  },
};

const loginSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginThunk.pending, (state) => {
        state.auth.loading = true;
        state.auth.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.auth.loading = false;
        state.auth.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.auth.loading = false;
        state.auth.error =
          (action.payload as string) ?? "Login failed";
      });
  },
});

export default loginSlice.reducer;