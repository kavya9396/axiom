import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState, type MouseEvent } from "react";
import type { TableColumn, tableData, TaskTimingColumnKey } from "../../../types/inbox.types";
import Badge from "../../../components/ui/Badge/Badge";
import { formatTaskTimingValue, getTaskTimingStatus, TASK_TIMING_COLUMN_KEYS, TASK_TIMING_ROW_STYLES } from "../../../utils/taskTiming";

type InboxTableProps = {
	hasTableData: boolean;
	visibleColumns: TableColumn<tableData>[];
	paginatedRows: tableData[];
	onSort: (columnKey: keyof tableData) => void;
	getSortIndicator: (columnKey: keyof tableData) => string;
	onApplicationClick: (e: MouseEvent<HTMLElement>, row: tableData) => void;
};

const InboxTable = ({
	hasTableData,
	visibleColumns,
	paginatedRows,
	onSort,
	getSortIndicator,
	onApplicationClick,
}: InboxTableProps) => {
	const [currentTimeMs, setCurrentTimeMs] = useState(() => Date.now());

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setCurrentTimeMs(Date.now());
		}, 30000);

		return () => window.clearInterval(intervalId);
	}, []);

	return (
		<TableContainer
			component={Paper}
			sx={{
				flexGrow: 1,
				overflowX: "auto",
			}}
		>
			<Table sx={{ tableLayout: "auto", minWidth: "max-content" }} stickyHeader>
				{hasTableData && (
					<TableHead sx={{ backgroundColor: "#E9EEF3" }}>
						<TableRow
							sx={{
								"&:hover": {
									backgroundColor: "#f5faff",
									cursor: "pointer",
								},
							}}
						>
							{visibleColumns.map((column: TableColumn<tableData>) => (
								<TableCell
									key={String(column.key)}
									variant="head"
									align={column.numeric ? "right" : "left"}
									onClick={() => onSort(column.key)}
									sx={{
										backgroundColor: "#E9EEF3",
										px: 1,
										fontWeight: "bold",
										fontSize: "13px",
										width: column.width,
										padding: 0.5,
										userSelect: "none",
										whiteSpace: "nowrap",
									}}
								>
									<Box
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: column.numeric ? "flex-end" : "flex-start",
											gap: "4px",
											flexWrap: "nowrap",
										}}
									>
										<Typography
											component="span"
											sx={{
												fontSize: "13px",
												fontWeight: "bold",
												whiteSpace: "nowrap",
											}}
										>
											{column.label}
										</Typography>
										<Typography
											component="span"
											sx={{ fontSize: "11px", color: "#4A4A4A" }}
										>
											{getSortIndicator(column.key)}
										</Typography>
									</Box>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
				)}
				<TableBody>
					{paginatedRows.map((row) => {
						const taskTimingStatus = getTaskTimingStatus(row, currentTimeMs);
						const taskTimingRowStyle = TASK_TIMING_ROW_STYLES[taskTimingStatus];

						return (
							<TableRow
								key={row.id}
								hover
								sx={{
									cursor: "pointer",
									backgroundColor: taskTimingRowStyle.backgroundColor,
									"& td": {
										color: taskTimingRowStyle.textColor,
									},
									"&:hover": {
										backgroundColor: taskTimingRowStyle.hoverColor,
									},
								}}
							>
								{visibleColumns.map((col) => {
									const cellValue = row[col.key];
									const displayValue = TASK_TIMING_COLUMN_KEYS.has(col.key as TaskTimingColumnKey)
										? formatTaskTimingValue(cellValue)
										: String(cellValue ?? "");

									return (
										<TableCell
											key={String(col.key)}
											sx={{ p: 1.5, pl: 2, fontSize: "13px" }}
										>
											{col.key === "drc" ? (
												<Badge
													label={row.drc}
													variant={
														row.drc === "Medium"
															? "Medium"
															: row.drc === "Low"
																? "Low"
																: "High"
													}
												/>
											) : col.key === "applicationNo" ? (
												<Typography
													sx={{
														cursor: "pointer",
														fontWeight: 600,
														fontSize: "13px",
														color: taskTimingStatus === "normal" ? "#0E3762" : taskTimingRowStyle.textColor,
														"&:hover": { textDecoration: "underline" },
													}}
													onClick={(e) => {
														onApplicationClick(e, row);
													}}
												>
													{row.applicationNo}
												</Typography>
											) : (
												displayValue
											)}
										</TableCell>
									);
								})}
							</TableRow>
						);
					})}
					{paginatedRows.length <= 0 && (
						<TableRow>
							<TableCell
								colSpan={visibleColumns.length}
								sx={{
									height: "60vh",
									textAlign: "center",
									verticalAlign: "middle",
								}}
							>
								No Data Found!
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default InboxTable;
