// ============================================================
//  CENTRAL API CONFIGURATION
//  Toggle USE_MOCK to switch between mock JSON files and real
//  API endpoints across the entire application.
//  When USE_MOCK = true  → every thunk hits its mock JSON file.
//  When USE_MOCK = false → every thunk hits the real API URL.
// ============================================================
 
export const USE_MOCK = true; // <-- flip this one flag to switch modes
 
// --------------- URL registry --------------------------------
// Add or edit URLs here; thunk files need no further changes.
// -------------------------------------------------------------
 
const apiUrls = {
  // Auth
  login: {
    real: "/src/mock/Login/login.json",
    mock: "/src/mock/Login/login.json",
  },

  // Inbox
  roleList: {
    real: "http://172.30.74.182:8112/icic-drs-landing-service/v1/role-list",
    mock: "/src/mock/inbox/roleList.json",
  },
  columnConfigSave: {
    real: "/api/inbox/column-config",
    mock: "/src/mock/inbox/columnConfigSave.json",
  },

  //Claim Task
  claimTask: {
    real: "http://172.30.74.182:8112/icic-drs-landing-service/v1/bpm/user-tasks/claim",
    mock: "/src/mock/inbox/claimTask.json"
  },
 
} as const;
 
export type ApiKey = keyof typeof apiUrls;
 
/** Returns the resolved URL based on the USE_MOCK flag. */
export const url = (key: ApiKey): string =>
  USE_MOCK ? apiUrls[key].mock : apiUrls[key].real;