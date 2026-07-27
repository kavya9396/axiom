import { Box, Typography } from "@mui/material";
import type { TableColumn, tableData } from "../../../types/inbox.types";
import { columnFlex } from "../../../utils/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useColumnConfig } from "../../../hooks/useColumnConfig";
import { allColumns } from "../../../store/inbox.columns";
import { downloadRowsAsExcel } from "../../../utils/excelExport";
import FilterTable from "./FilterTable";
import InboxTable from "./InboxTable";
import SearchApplication from "../LeftPanel/SearchApplication";
import CustomSnackbar from "../../../components/ui/Alert/Alert";
import { useClaimTask } from "../../../hooks/useClaimTask";
import { useInboxPagination } from "../../../hooks/useInboxPagination";
import { useColumnTransfer } from "../../../hooks/useColumnTransfer";
import { useInboxFilters } from "../../../hooks/useInboxFilters";
import { useInboxSorting } from "../../../hooks/useInboxSorting";
import ColumnDialog from "./ColumnDialog";
import TablePaginationFooter from "./TablePaginationFooter";
import InboxHeader from "./InboxHeader";
import InboxToolbar from "./InboxToolbar";
import { getExportColumnKeys } from "../../../utils/getExportColumnKeys";

const RightPanel = ({
    selectedPool,
    rows,
}: {
    selectedPool: string;
    rows: tableData[];
}) => {
    const username = useMemo(
        () => localStorage.getItem("username") ?? "",
        [],
    );
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [openTransferDialog, setOpenTransferDialog] = useState(false);
    const [openFilterDialog, setOpenFilterDialog] = useState<boolean>(false);

    /** ------------------HOOKS------------------ */
    const { claimError, setClaimError, handleApplicationClick } = useClaimTask();

    const {
        config,
        updateConfig,
        maxVisibleColumns,
        isConfigLoading,
        configError,
    } = useColumnConfig(username, selectedPool, rows);

    const columnByKey = useMemo(
        () => new Map(allColumns.map((column) => [String(column.key), column])),
        [],
    );

    const visibleColumns = useMemo(() => {
        return config.visible
            .map(columnKey => columnByKey.get(columnKey))
            .filter(Boolean) as TableColumn<tableData>[];
    }, [config.visible, columnByKey]);

    const exportColumnKeys = useMemo(() => getExportColumnKeys(rows), [rows]);
    const exportColumnLabels = useMemo(
        () => new Map(allColumns.map((column) => [String(column.key), column.label])),
        [],
    );
    const hasTableData = rows.length > 0;

    const {
        left,
        right,
        checked,
        openDialog,
        moveRight,
        moveLeft,
        toggle,
        save,
    } = useColumnTransfer({
        maxVisibleColumns,
        onError: setClaimError,
        onSave: updateConfig,
    });

    const {
        filteredRows,
        setSearchText,
        filterValues,
        setFilterValues,
    } = useInboxFilters({ rows, visibleColumns });

    const {
        sortKey,
        sortDirection,
        handleSort,
        getSortIndicator,
        sortedRows,
    } = useInboxSorting({ rows: filteredRows, visibleColumns });

    const {
        page,
        rowsPerPage,
        paginatedRows,
        totalCount,
        totalPages,
        startRecord,
        endRecord,
        handleChangeRowsPerPage,
        goToPage,
        goToPreviousPage,
        goToNextPage,
        resetPage,
    } = useInboxPagination(sortedRows);

    useEffect(() => {
        resetPage();
    }, [sortKey, sortDirection, resetPage]);

    useEffect(() => {
        if (configError) {
            setClaimError(configError);
        }
    }, [configError, setClaimError]);

    const handleTableApplicationClick = useCallback(
        (e: React.MouseEvent<HTMLElement>, row: tableData) => {
            void handleApplicationClick(e, row);
        },
        [handleApplicationClick],
    );

    const handleApply = useCallback(async () => {
        try {
            await save();
            setOpenTransferDialog(false);
        } catch (error) {
            setClaimError(
                error instanceof Error
                    ? error.message
                    : "Failed to save column sequence."
            );
        }
    }, [save, setClaimError]);

    // ---------------- OPEN DIALOG ----------------
    const openColumnDialog = useCallback(() => {
        openDialog(config.hidden, config.visible);
        setOpenTransferDialog(true);
    }, [config.hidden, config.visible, openDialog]);

    const handleDownloadExcel = useCallback(() => {
        if (!sortedRows.length || !exportColumnKeys.length) return;

        downloadRowsAsExcel({
            rows: sortedRows,
            columnKeys: exportColumnKeys,
            columnLabels: exportColumnLabels,
            selectedPool,
        });
    }, [
        sortedRows,
        exportColumnKeys,
        exportColumnLabels,
        selectedPool,
    ]);

    return (
        <>
            <Box
                sx={{
                    ...columnFlex,
                    margin: 2,
                }}
            >
                <InboxHeader
                    selectedPool={selectedPool}
                />
                {selectedPool !== "Search Applications" && (
                    <>
                        <InboxToolbar
                            canDownload={sortedRows.length > 0}
                            hasTableData={hasTableData}
                            isSearchOpen={isSearchOpen}
                            onDownloadExcel={handleDownloadExcel}
                            onSearch={setSearchText}
                            onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
                            onOpenFilter={() => setOpenFilterDialog(true)}
                            onOpenSettings={openColumnDialog}
                        />
                        <Box
                            sx={{
                                height: "calc(100vh - 180px)",
                                width: "100%",
                                ...columnFlex,
                                borderRadius: "0 0 20px 20px",
                            }}
                        >
                            {isConfigLoading ? (
                                <Box
                                    sx={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Typography sx={{ color: "#666" }}>
                                        Loading saved columns...
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    <InboxTable
                                        hasTableData={hasTableData}
                                        visibleColumns={visibleColumns}
                                        paginatedRows={paginatedRows}
                                        onSort={handleSort}
                                        getSortIndicator={getSortIndicator}
                                        onApplicationClick={handleTableApplicationClick}
                                    />
                                    {/* Footer Pagination */}
                                    {paginatedRows.length > 0 && (
                                        <TablePaginationFooter
                                            page={page}
                                            rowsPerPage={rowsPerPage}
                                            totalPages={totalPages}
                                            totalCount={totalCount}
                                            startRecord={startRecord}
                                            endRecord={endRecord}
                                            onPrevious={goToPreviousPage}
                                            onNext={goToNextPage}
                                            onPageChange={goToPage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    )}
                                </>
                            )}
                        </Box>

                        {/*  ------- Filter table ------------ */}

                        <FilterTable
                            openFilterDialog={openFilterDialog}
                            setOpenFilterDialog={setOpenFilterDialog}
                            filterValues={filterValues}
                            setFilterValues={setFilterValues}
                            visibleColumns={visibleColumns}
                            rows={rows}
                            onApply={resetPage}
                        />
                        {/*  ------- Custom table ------------ */}
                        <ColumnDialog
                            open={openTransferDialog}
                            onClose={() => setOpenTransferDialog(false)}
                            left={left}
                            right={right}
                            checked={checked}
                            maxVisibleColumns={maxVisibleColumns}
                            columnByKey={columnByKey}
                            onToggle={toggle}
                            onMoveRight={moveRight}
                            onMoveLeft={moveLeft}
                            onApply={handleApply}
                        />
                    </>
                )}
                {selectedPool === "Search Applications" && <SearchApplication />}
            </Box>

            <CustomSnackbar
                open={Boolean(claimError)}
                onClose={() => setClaimError("")}
                message={claimError}
                severity="error"
            />
        </>
    )
}

export default RightPanel