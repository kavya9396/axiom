import { useMemo, useState } from "react";
import type { SortDirection, TableColumn, tableData } from "../types/inbox.types";
import { toFilterComparableValue } from "../utils/helpers";

type UseInboxSortingArgs = {
	rows: tableData[];
	visibleColumns: TableColumn<tableData>[];
};

const compareByColumn = (
	a: tableData,
	b: tableData,
	column: TableColumn<tableData>,
) => {
	const aRaw = a[column.key];
	const bRaw = b[column.key];

	const aText = toFilterComparableValue(aRaw).trim();
	const bText = toFilterComparableValue(bRaw).trim();

	if (!aText && !bText) return 0;
	if (!aText) return 1;
	if (!bText) return -1;

	if (column.numeric) {
		const aNum = Number(aText.toString().replace(/,/g, ""));
		const bNum = Number(bText.toString().replace(/,/g, ""));

		if (Number.isFinite(aNum) && Number.isFinite(bNum)) {
			return aNum - bNum;
		}
	}

	const aDate = Date.parse(aText);
	const bDate = Date.parse(bText);
	if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) {
		return aDate - bDate;
	}

	return aText.localeCompare(bText, undefined, {
		numeric: true,
		sensitivity: "base",
	});
};

export function useInboxSorting({ rows, visibleColumns }: UseInboxSortingArgs) {
	const [sortKey, setSortKey] = useState<keyof tableData | "">("");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

	const sortedRows = useMemo(() => {
		if (!sortKey) return rows;

		const sortColumn = visibleColumns.find((column) => column.key === sortKey);
		if (!sortColumn) return rows;

		const sorted = [...rows].sort((a, b) => compareByColumn(a, b, sortColumn));

		return sortDirection === "asc" ? sorted : sorted.reverse();
	}, [rows, sortDirection, sortKey, visibleColumns]);

	const handleSort = (columnKey: keyof tableData) => {
		if (sortKey === columnKey) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
			return;
		}

		setSortKey(columnKey);
		setSortDirection("asc");
	};

	const getSortIndicator = (columnKey: keyof tableData) => {
		if (sortKey !== columnKey) return "⇅";
		return sortDirection === "asc" ? "▲" : "▼";
	};

	return {
		sortKey,
		sortDirection,
		handleSort,
		getSortIndicator,
		sortedRows,
	};
}
