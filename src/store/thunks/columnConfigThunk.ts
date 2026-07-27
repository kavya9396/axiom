import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/api";
import { url } from "../../services/apiConfig";
import type {
  ColumnConfig,
  ColumnConfigApiRequest,
  ColumnConfigApiResponse,
  ColumnConfigThunkResult,
  FetchColumnConfigRequest,
  SaveColumnConfigRequest,
} from "../../types/columnConfig.types";

const MAX_VISIBLE_COLUMNS = 8;

type ThunkConfig = {
  rejectValue: string;
};

const getConfigKey = (userId: string, taskId: string) => `${userId}:${taskId}`;

const getDefaultConfig = (allowedColumns: string[]): ColumnConfig => ({
  visible: allowedColumns.slice(0, MAX_VISIBLE_COLUMNS),
  hidden: allowedColumns.slice(MAX_VISIBLE_COLUMNS),
});

const normalizeConfig = (
  config: ColumnConfig | undefined,
  allowedColumns: string[],
): ColumnConfig => {
  if (!config) {
    return getDefaultConfig(allowedColumns);
  }

  const visible = config.visible
    .filter((key) => allowedColumns.includes(key))
    .slice(0, MAX_VISIBLE_COLUMNS);

  if (visible.length === 0) {
    return getDefaultConfig(allowedColumns);
  }

  const visibleSet = new Set(visible);
  const hidden = [
    ...config.hidden.filter(
      (key) => allowedColumns.includes(key) && !visibleSet.has(key),
    ),
    ...allowedColumns.filter(
      (key) => !visibleSet.has(key) && !config.hidden.includes(key),
    ),
  ];

  return {
    visible,
    hidden,
  };
};

const getApiConfig = (
  response: ColumnConfigApiResponse,
  allowedColumns: string[],
): ColumnConfig | null => {
  const sequence =
    response.columnSequence ??
    response.visibleColumns ??
    response.config?.visible;

  if (!sequence?.length) {
    return null;
  }

  const visible = sequence.filter((key) => allowedColumns.includes(key));
  const hiddenFromApi = response.hiddenColumns ?? response.config?.hidden ?? [];
  const visibleSet = new Set(visible);
  const hidden = [
    ...hiddenFromApi.filter(
      (key) => allowedColumns.includes(key) && !visibleSet.has(key),
    ),
    ...allowedColumns.filter(
      (key) => !visibleSet.has(key) && !hiddenFromApi.includes(key),
    ),
  ];

  return {
    visible,
    hidden,
  };
};

export const fetchColumnConfigThunk = createAsyncThunk<
  ColumnConfigThunkResult,
  FetchColumnConfigRequest,
  ThunkConfig
>("columnConfig/fetch", async (payload, { rejectWithValue }) => {
  const { userId, taskId, allowedColumns } = payload;
  const key = getConfigKey(userId, taskId);

  try {
    const response = await apiRequest<ColumnConfigApiResponse, ColumnConfigApiRequest>({
      url: url("columnConfigSave"),
      method: "POST",
      body: {
        userId,
        roleType: taskId,
        action: "GET",
      },
    });

    const apiConfig = getApiConfig(response, allowedColumns);
    return {
      key,
      config: apiConfig ? normalizeConfig(apiConfig, allowedColumns) : null,
    };
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch column config",
    );
  }
});

export const saveColumnConfigThunk = createAsyncThunk<
  ColumnConfigThunkResult,
  SaveColumnConfigRequest,
  ThunkConfig
>("columnConfig/save", async (payload, { rejectWithValue }) => {
  const { userId, taskId, config, allowedColumns } = payload;
  const key = getConfigKey(userId, taskId);
  const normalizedConfig = normalizeConfig(config, allowedColumns);

  try {
    await apiRequest<ColumnConfigApiResponse, ColumnConfigApiRequest>({
      url: url("columnConfigSave"),
      method: "POST",
      body: {
        userId,
        roleType: taskId,
        action: "SAVE",
        visibleColumns: normalizedConfig.visible,
        hiddenColumns: normalizedConfig.hidden,
        columnSequence: normalizedConfig.visible,
      },
    });

    return {
      key,
      config: normalizedConfig,
    };
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to save column config",
    );
  }
});

export const columnConfigUtils = {
  getConfigKey,
  getDefaultConfig,
  normalizeConfig,
  maxVisibleColumns: MAX_VISIBLE_COLUMNS,
};
