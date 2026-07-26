import { createApiThunk } from "./createApiThunk";
import type { ClaimTaskRequest, ClaimTaskResponse } from "../../types/inbox.types";
import { url } from "../../services/apiConfig";

export const claimTaskThunk = createApiThunk<ClaimTaskResponse, ClaimTaskRequest>(
  "inbox/claimTask",
  { url: url("claimTask"), method: "POST" },
);
