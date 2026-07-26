import { Box, List, ListItem, Paper, Typography } from "@mui/material";
import type { TableColumn, tableData } from "../../../types/inbox.types";
import { modalTitleStyles } from "../../../utils/styles";
import CustomButton from "../../../components/ui/Button/Button";
import CustomDialog from "../../../components/ui/Dialog/Dialog";
import CustomCheckbox from "../../../components/ui/Checkbox/Checkbox";

type ColumnDialogProps = {
	open: boolean;
	onClose: () => void;
	left: string[];
	right: string[];
	checked: string[];
	maxVisibleColumns: number;
	columnByKey: Map<string, TableColumn<tableData>>;
	onToggle: (item: string) => void;
	onMoveRight: () => void;
	onMoveLeft: () => void;
	onApply: () => void;
};

const ColumnDialog = ({
	open,
	onClose,
	left,
	right,
	checked,
	maxVisibleColumns,
	columnByKey,
	onToggle,
	onMoveRight,
	onMoveLeft,
	onApply,
}: ColumnDialogProps) => {
	const customList = (title: string, items: string[]) => {
		const isAvailableList = title === "Available";

		return (
			<Paper
				sx={{
					width: 300,
					height: 400,
					overflow: "hidden",
				}}
			>
				<Box sx={{ px: 2, py: 1, backgroundColor: "#f5f5f5" }}>
					<Typography variant="subtitle1">{title}</Typography>
				</Box>

				<List dense>
					{items.map((item) => (
						<ListItem key={item} disablePadding>
							<Box sx={{ px: 2 }}>
								<CustomCheckbox
									label={columnByKey.get(item)?.label ?? item}
									checked={checked.includes(item)}
									disabled={
										isAvailableList &&
										right.length >= maxVisibleColumns &&
										!checked.includes(item)
									}
									onChange={() => onToggle(item)}
								/>
							</Box>
						</ListItem>
					))}
				</List>
			</Paper>
		);
	};

	return (
		<CustomDialog
			open={open}
			onClose={onClose}
			title="Customize Columns"
			maxWidth="md"
			fullWidth
			titleSx={{ ...modalTitleStyles }}
			contentSx={{ p: 3 }}
			actionsSx={{ justifyContent: "center", pb: 3 }}
			actions={
				<CustomButton
					variant="contained"
					onClick={onApply}
					sx={{ width: "150px", borderRadius: "50px" }}
				>
					Apply
				</CustomButton>
			}
		>
			<Box
				sx={{
					display: "flex",
					gap: 2,
					justifyContent: "center",
					alignItems: "center",
					flexWrap: "wrap",
				}}
			>
				{customList("Available", left)}

				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 1,
						mt: 2,
					}}
				>
					<CustomButton
						sx={{ my: 1 }}
						variant="outlined"
						size="small"
						onClick={onMoveRight}
						disabled={
							checked.filter((item) => left.includes(item)).length === 0 ||
							right.length >= maxVisibleColumns
						}
					>
						<Box component="span">›</Box>
					</CustomButton>
					<CustomButton
						sx={{ my: 1 }}
						variant="outlined"
						size="small"
						disabled={checked.filter((item) => right.includes(item)).length === 0}
						onClick={onMoveLeft}
					>
						<Box component="span">‹</Box>
					</CustomButton>
				</Box>

				{customList("Visible", right)}
			</Box>
		</CustomDialog>
	);
};

export default ColumnDialog;
