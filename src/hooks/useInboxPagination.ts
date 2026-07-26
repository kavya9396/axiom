import { useMemo, useState, type ReactElement } from "react";
import type { SelectChangeEvent } from "@mui/material";

type PageItem = number | "...";

type RenderPageButtonsArgs = {
	renderNumberButton: (item: number) => ReactElement;
	renderEllipsis: (item: "...", index: number) => ReactElement;
};

export function useInboxPagination<T>(rows: T[]) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const totalCount = rows.length;
	const totalPages = rowsPerPage === -1 ? 1 : Math.ceil(totalCount / rowsPerPage);
	const safePage = Math.min(page, Math.max(0, totalPages - 1));

	const paginatedRows = useMemo(
		() =>
			rowsPerPage === -1
				? rows
				: rows.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage),
		[rows, safePage, rowsPerPage],
	);

	const startRecord = totalCount === 0 ? 0 : rowsPerPage === -1 ? 1 : safePage * rowsPerPage + 1;
	const endRecord =
		totalCount === 0
			? 0
			: rowsPerPage === -1
				? totalCount
				: Math.min((safePage + 1) * rowsPerPage, totalCount);

	const pageItems = useMemo(() => {
		const pages: PageItem[] = [];

		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i += 1) pages.push(i);
		} else if (safePage <= 3) {
			pages.push(1, 2, 3, 4, "...", totalPages - 1, totalPages);
		} else if (safePage >= totalPages - 4) {
			pages.push(
				1,
				2,
				"...",
				totalPages - 3,
				totalPages - 2,
				totalPages - 1,
				totalPages,
			);
		} else {
			pages.push(1, 2, "...", safePage + 1, "...", totalPages - 1, totalPages);
		}

		return pages;
	}, [safePage, totalPages]);

	const renderPageButtons = ({
		renderNumberButton,
		renderEllipsis,
	}: RenderPageButtonsArgs) => {
		return pageItems.map((item, index) =>
			typeof item === "number"
				? renderNumberButton(item)
				: renderEllipsis(item, index),
		);
	};

	const handleChangeRowsPerPage = (e: SelectChangeEvent<number>) => {
		const value = Number(e.target.value);
		setRowsPerPage(value);
		setPage(0);
	};

	const goToPage = (pageNumber: number) => {
		setPage(pageNumber);
	};

	const goToPreviousPage = () => {
		setPage((prev) => Math.max(0, prev - 1));
	};

	const goToNextPage = () => {
		setPage((prev) => Math.min(totalPages - 1, prev + 1));
	};

	const resetPage = () => {
		setPage(0);
	};

	return {
		page: safePage,
		rowsPerPage,
		paginatedRows,
		totalCount,
		totalPages,
		startRecord,
		endRecord,
		pageItems,
		renderPageButtons,
		handleChangeRowsPerPage,
		goToPage,
		goToPreviousPage,
		goToNextPage,
		resetPage,
	};
}