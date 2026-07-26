import { useMemo, useState } from "react";
import type { TableColumn, tableData } from "../types/inbox.types";
import { toFilterComparableValue } from "../utils/helpers";

type UseInboxFiltersArgs = {
	rows: tableData[];
	visibleColumns: TableColumn<tableData>[];
};

export function useInboxFilters({ rows, visibleColumns }: UseInboxFiltersArgs) {
	const [searchText, setSearchText] = useState("");
	const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});

	const filteredRows = useMemo(() => {
		return rows
			.filter((row) => {
				const activeFilters = Object.entries(filterValues);

				if (!activeFilters.length) return true;

				return activeFilters.every(([key, values]) => {
					if (!values.length) return true;

					const rowValue = toFilterComparableValue(row[key as keyof typeof row]);

					return values.includes(rowValue);
				});
			})
			.filter((row) => {
				if (!searchText.trim()) return true;

				const search = searchText.toLowerCase();

				return visibleColumns.some((col) => {
					const value = row[col.key];

					return String(value ?? "")
						.toLowerCase()
						.includes(search);
				});
			});
	}, [rows, filterValues, searchText, visibleColumns]);

	return {
		filteredRows,
		searchText,
		setSearchText,
		filterValues,
		setFilterValues,
	};
}
