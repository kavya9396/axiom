import { createApiThunk } from "./createApiThunk";
import { url } from "../../services/apiConfig";
import type { InboxRequest, UserContextResponse } from "../../types/inbox.types";

export const fetchInboxThunk = createApiThunk<
  UserContextResponse,
  InboxRequest
>("inbox/roleList", { url: url("roleList"), method: "POST" });