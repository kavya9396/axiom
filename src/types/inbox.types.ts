export type PoolItemProps = {
  label: string;
  value: string;
  selectedPool?: string;
  onClick: (val: string) => void;
  count?: number;
  showCount?: boolean;
};

export type PoolProps = {
  onSelectPool: (pool: string) => void;
  selectedPool: string;
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface tableData {
  id: number;
  taskId?: string;
  applicationNo: string;
  productCode?: string;
  masterPlanNo?: number;
  typeOfGroupBusiness?: string;
  sumAssured?: number;
  appliedSa: number;
  annualPremium: number;
  productType: string;
  drc: string;
  ptlr: string;
  isMedical: boolean;
  breDecision: string;
  channel: string;
  munichReMedicalDecision: string;
  hniFlag: boolean;
  roleType: string;
  businessType?: string;
  state?: string;
  poolTAT?: string;
  start_time?: string;
  at_risk_time?: string;
  due_date?: string;
  dateAndTimeStamp?: string;
  displayName?: string;
  clientType?: string;
  caseType?: string;
  lastPool?: string;
  product?: string;
  uwName?: string;
  userId?: string;
  leaveDateFrom?: string;
  leaveDateTill?: string;
  leaveReason?: string;
  caseToReassignToUw?: string;
  reassignedUserId?: string;
  roles?: string;
  authorityLimitFrom?: string;
  authorityLimitTill?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  premium?: string;
  nameOfProposer?: string;
  nameOfLifeAssured?: string;
  plan?: string;
  caseStatus?: string;
  caseInWhichPool?: string;
  remarks?: string;
  uwDecisionDate?: string;
  dueDate?: string;
  laDecisionDate?: string;
  medicalReceivedDate?: string;
  financialReceivedDate?: string;
  clientName?: string;
  planOpted?: string;
  assignedTpa?: string;
  grievanceRaisedDate?: string;
  caseReceivedDate?: string;
  policyNo?: string;
  memberName?: string;
  appliedCover?: string;
  productOpted?: string;
  medicalRaisedDate?: string;
}

export type InboxRequest = {
  username: string;
  password: string;
};

export type RoleGroup = {
  name: string;
  pools: string[];
};

export type UserContextResponse = {
  userId: string;
  username: string;
  businessType: string;
  roleType: string;
  roles: RoleGroup[];
  pools?: Record<string, string[]>;
  poolData?: Record<string, tableData[]>;
};

export interface TableColumn<T = unknown> {
  key: keyof T;
  label: string;
  width?: number;
  numeric?: boolean;
};

export type PoolStatusFilter = "All" | "Active" | "Error";
export type SortDirection = "asc" | "desc";
export type TaskTimingStatus = "normal" | "atRisk" | "due";
export type TaskTimingColumnKey = "start_time" | "at_risk_time" | "due_date";

export type ClaimTaskRequest = {
  username: string;
  password: string;
  taskId: string;
};

export type ClaimTaskResponse = {
  id?: string;
  state?: string;
  message?: string;
  success?: boolean;
};