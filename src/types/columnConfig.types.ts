export type ColumnConfig = {
  visible: string[];
  hidden: string[];
};

export type FetchColumnConfigRequest = {
  userId: string;
  taskId: string;
  allowedColumns: string[];
};

export type SaveColumnConfigRequest = {
  userId: string;
  taskId: string;
  config: ColumnConfig;
  allowedColumns: string[];
};

export type ColumnConfigApiRequest = {
  userId: string;
  roleType: string;
  action: "GET" | "SAVE";
  visibleColumns?: string[];
  hiddenColumns?: string[];
  columnSequence?: string[];
};

export type ColumnConfigApiResponse = {
  success?: boolean;
  message?: string;
  visibleColumns?: string[];
  hiddenColumns?: string[];
  columnSequence?: string[];
  config?: Partial<ColumnConfig>;
};

export type ColumnConfigThunkResult = {
  key: string;
  config: ColumnConfig | null;
};
