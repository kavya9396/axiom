import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { ColumnConfig } from "../types/columnConfig.types";
import {
  columnConfigUtils,
  fetchColumnConfigThunk,
  saveColumnConfigThunk,
} from "../store/thunks/columnConfigThunk";

import { allColumns } from "../store/inbox.columns";
const { maxVisibleColumns: MAX_VISIBLE_COLUMNS } = columnConfigUtils;
const allColumnKeys = allColumns.map((column) => String(column.key));
const allColumnKeySet = new Set(allColumnKeys);

type RoleColumnSource = object[];

const getRoleRowsSignature = (roleRows: RoleColumnSource) => {
  return roleRows
    .map((row) =>
      Object.keys(row)
        .filter((key) => allColumnKeySet.has(key))
        .join(","),
    )
    .join("|");
};

const getRoleAllowedColumns = (roleRowsSignature: string) => {
  const keysFromRoleList = Array.from(
    new Set(roleRowsSignature.split(/[|,]/).filter(Boolean)),
  ).filter((key) => allColumnKeySet.has(key));

  if (keysFromRoleList.length > 0) {
    return keysFromRoleList;
  }

  return allColumnKeys;
};

export const useColumnConfig = (
  userId: string,
  selectedPool: string,
  roleRows: RoleColumnSource = [],
) => {
  const roleRowsSignature = useMemo(
    () => getRoleRowsSignature(roleRows),
    [roleRows],
  );
  const allowedColumns = useMemo(
    () => getRoleAllowedColumns(roleRowsSignature),
    [roleRowsSignature],
  );

  const dispatch = useAppDispatch();
  const key = columnConfigUtils.getConfigKey(userId, selectedPool);
  const configFromStore = useAppSelector(
    (state) => state.columnConfig.byKey[key],
  );
  const isConfigLoading = useAppSelector(
    (state) => state.columnConfig.loadingByKey[key] ?? false,
  );
  const configError = useAppSelector(
    (state) => state.columnConfig.errorByKey[key] ?? null,
  );

  const config: ColumnConfig = useMemo(() => {
    return columnConfigUtils.normalizeConfig(configFromStore, allowedColumns);
  }, [allowedColumns, configFromStore]);

  useEffect(() => {
    if (!userId || !selectedPool) {
      return;
    }

    void dispatch(
      fetchColumnConfigThunk({
        userId,
        taskId: selectedPool,
        allowedColumns,
      }),
    );
  }, [allowedColumns, dispatch, selectedPool, userId]);

  const updateConfig = useCallback(
    async (newConfig: ColumnConfig) => {
      if (!userId || !selectedPool) {
        return;
      }

      await dispatch(
        saveColumnConfigThunk({
          userId,
          taskId: selectedPool,
          config: newConfig,
          allowedColumns,
        }),
      ).unwrap();
    },
    [userId, selectedPool, allowedColumns, dispatch],
  );

  return {
    config,
    updateConfig,
    allowedColumns,
    maxVisibleColumns: MAX_VISIBLE_COLUMNS,
    isConfigLoading,
    configError,
  };
};
