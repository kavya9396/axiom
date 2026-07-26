import { allColumns } from "../store/inbox.columns";
import type { tableData } from "../types/inbox.types";

export const getExportColumnKeys = (
    rows: tableData[],
): string[] => {
    const rowKeys = new Set<string>();

    rows.forEach((row) => {
        Object.keys(row).forEach((key) => {
            rowKeys.add(key);
        });
    });

    const configuredKeys = allColumns
        .map((column) => String(column.key))
        .filter((key) => rowKeys.has(key));

    const configuredSet = new Set(configuredKeys);

    const extraKeys = Array.from(rowKeys).filter(
        (key) => !configuredSet.has(key),
    );

    return [...configuredKeys, ...extraKeys];
};