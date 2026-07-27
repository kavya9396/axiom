import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";
import columnConfigReducer from "./slices/columnConfigSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    columnConfig: columnConfigReducer,
  },
});

export type RootState = ReturnType<
  typeof store.getState
>;
export type AppDispatch = typeof store.dispatch;