import { PATHS } from "./paths";

export const getInboxPath = () => `/${PATHS.INBOX}`;
export const getSearchApplicationPath = () => `/${PATHS.SEARCH_APPLICATION}`;
export const getDRSPath = (appNo: string) => `/app/${appNo}/drs`;
export const getGrievanceApplicationPath = (appNo: string) => `/app/${appNo}/${PATHS.GRIEVANCE_APPLICATION}`;