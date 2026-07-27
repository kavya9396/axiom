import { createSlice } from "@reduxjs/toolkit";
import type { ColumnConfig } from "../../types/columnConfig.types";
import {
  fetchColumnConfigThunk,
  saveColumnConfigThunk,
} from "../thunks/columnConfigThunk";

type ColumnConfigState = {
  byKey: Record<string, ColumnConfig>;
  loadingByKey: Record<string, boolean>;
  errorByKey: Record<string, string | null>;
};

const initialState: ColumnConfigState = {
  byKey: {},
  loadingByKey: {},
  errorByKey: {},
};

const columnConfigSlice = createSlice({
  name: "columnConfig",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchColumnConfigThunk.pending, (state, action) => {
        const { userId, taskId } = action.meta.arg;
        const key = `${userId}:${taskId}`;

        state.loadingByKey[key] = true;
        state.errorByKey[key] = null;
      })
      .addCase(fetchColumnConfigThunk.fulfilled, (state, action) => {
        const { key, config } = action.payload;

        state.loadingByKey[key] = false;
        state.errorByKey[key] = null;
        if (config) {
          state.byKey[key] = config;
        }
      })
      .addCase(fetchColumnConfigThunk.rejected, (state, action) => {
        const { userId, taskId } = action.meta.arg;
        const key = `${userId}:${taskId}`;

        state.loadingByKey[key] = false;
        state.errorByKey[key] =
          (action.payload as string) ?? "Failed to fetch column config";
      })
      .addCase(saveColumnConfigThunk.pending, (state, action) => {
        const { userId, taskId } = action.meta.arg;
        const key = `${userId}:${taskId}`;

        state.errorByKey[key] = null;
      })
      .addCase(saveColumnConfigThunk.fulfilled, (state, action) => {
        const { key, config } = action.payload;

        if (config) {
          state.byKey[key] = config;
        }
        state.errorByKey[key] = null;
      })
      .addCase(saveColumnConfigThunk.rejected, (state, action) => {
        const { userId, taskId } = action.meta.arg;
        const key = `${userId}:${taskId}`;

        state.errorByKey[key] =
          (action.payload as string) ?? "Failed to save column config";
      });
  },
});

export default columnConfigSlice.reducer;
