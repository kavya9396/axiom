import { Box } from "@mui/material";
import { COLORS, commonFlexBetween } from "../../../utils/styles";
import CustomButton from "../../../components/ui/Button/Button";
import SearchBar from "../../../components/ui/SearchBar/SearchBar";
import { FilterIcon, SearchIcon, SettingsIcon } from "../../../icons/Icons";

type InboxToolbarProps = {
	canDownload: boolean;
	hasTableData: boolean;
	isSearchOpen: boolean;
	onDownloadExcel: () => void;
	onSearch: (value: string) => void;
	onToggleSearch: () => void;
	onOpenFilter: () => void;
	onOpenSettings: () => void;
};

const InboxToolbar = ({
	canDownload,
	hasTableData,
	isSearchOpen,
	onDownloadExcel,
	onSearch,
	onToggleSearch,
	onOpenFilter,
	onOpenSettings,
}: InboxToolbarProps) => {
	return (
		<Box
			sx={{
				...commonFlexBetween,
				top: 8,
				right: 24,
				gap: 1,
				backgroundColor: COLORS.white,
				px: 2,
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
					width: "100%",
					justifyContent: "flex-end",
				}}
			>
				<CustomButton
					size="small"
					variant="outlined"
					onClick={onDownloadExcel}
					disabled={!canDownload}
					sx={{
						mr: 1,
						whiteSpace: "nowrap",
						backgroundColor: "#FFFFFF",
					}}
				>
					Download Excel
				</CustomButton>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-end",
						flex: 1,
					}}
				>
					<Box
						sx={{
							width: isSearchOpen ? 280 : 0,
							opacity: isSearchOpen ? 1 : 0,
							overflow: "hidden",
							whiteSpace: "nowrap",
							transition: "width 300ms ease-in-out, opacity 200ms ease-in-out",
							ml: isSearchOpen ? 1 : 0,
							mr: isSearchOpen ? 2 : 0,
							pointerEvents: isSearchOpen ? "auto" : "none",
							willChange: "width, opacity",
						}}
					>
						<SearchBar onSearch={onSearch} />
					</Box>

					<Box
						sx={{
							width: 40,
							display: "flex",
							justifyContent: "center",
							flexShrink: 0,
							cursor: hasTableData ? "pointer" : "not-allowed",
							opacity: hasTableData ? 1 : 0.4,
						}}
						onClick={() => {
							if (!hasTableData) return;
							onToggleSearch();
						}}
						data-testid="search-toggle"
					>
						<SearchIcon />
					</Box>
				</Box>

				<Box
					sx={{
						cursor: hasTableData ? "pointer" : "not-allowed",
						opacity: hasTableData ? 1 : 0.4,
						mt: 0.7,
					}}
					onClick={() => {
						if (!hasTableData) return;
						onOpenFilter();
					}}
					aria-disabled={!hasTableData}
					data-testid="filter-toggle"
				>
					<FilterIcon />
				</Box>

				<Box
					sx={{
						cursor: hasTableData ? "pointer" : "not-allowed",
						opacity: hasTableData ? 1 : 0.4,
						mt: 0.7,
					}}
					onClick={() => {
						if (!hasTableData) return;
						onOpenSettings();
					}}
					aria-disabled={!hasTableData}
					data-testid="settings-toggle"
				>
					<SettingsIcon />
				</Box>
			</Box>
		</Box>
	);
};

export default InboxToolbar;
