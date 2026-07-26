import { createApiThunk } from "./createApiThunk";
import { url } from "../../services/apiConfig";
import type { LoginRequest, LoginResponse } from "../../types/login.types";

export const loginThunk = createApiThunk<LoginResponse, LoginRequest>(
  "Login/login",
  { url: url("login"), method: "POST" },
);