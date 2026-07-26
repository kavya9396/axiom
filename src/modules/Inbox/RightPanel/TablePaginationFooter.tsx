import {
    Box,
    MenuItem,
    Select,
    Typography,
    type SelectChangeEvent,
} from "@mui/material";
import { COLORS } from "../../../utils/styles";
import CustomButton from "../../../components/ui/Button/Button";
import { KeyLeftArrowIcon, KeyRightArrowIcon } from "../../../icons/Icons";
import { getPaginationItems } from "../../../utils/paginationUtils";

type Props = {
    page: number;
    rowsPerPage: number;
    totalPages: number;
    totalCount: number;
    startRecord: number;
    endRecord: number;

    onPrevious: () => void;
    onNext: () => void;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (e: SelectChangeEvent<number>) => void;
};

export default function TablePaginationFooter({
    page,
    rowsPerPage,
    totalPages,
    totalCount,
    startRecord,
    endRecord,
    onPrevious,
    onNext,
    onPageChange,
    onRowsPerPageChange,
}: Props) {
    const paginationItems = getPaginationItems(page + 1, totalPages);

    return (
        <Box
            sx={{
                borderTop: "1px solid #e0e0e0",
                px: 2,
                py: 1.5,
                borderRadius: "0 0 20px 20px",
                backgroundColor: COLORS.white,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px"}}>Show</Typography>

                    <Select
                        size="small"
                        value={rowsPerPage}
                        onChange={onRowsPerPageChange}
                    >
                        {[10, 25, 50, 100].map((value) => (
                            <MenuItem sx={{ fontSize: "14px"}} key={value} value={value}>
                                {value}
                            </MenuItem>
                        ))}

                        <MenuItem value={-1} sx={{ fontSize: "14px"}}>All</MenuItem>
                    </Select>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CustomButton
                        disabled={page === 0}
                        onClick={onPrevious}
                    >
                        <KeyLeftArrowIcon />
                        Previous
                    </CustomButton>

                    {paginationItems.map((item, index) =>
                        item === "..." ? (
                            <Typography key={index}>...</Typography>
                        ) : (
                            <CustomButton
                                key={item}
                                variant={item === page + 1 ? "outlined" : "text"}
                                onClick={() => onPageChange(item - 1)}
                                sx={{
                                    minWidth: 32,
                                    borderRadius: "134px",
                                    px: "10px",
                                    py: "6px",
                                    fontWeight: item === page + 1 ? 600 : 400,
                                }}
                            >
                                {item}
                            </CustomButton>
                        )
                    )}

                    <CustomButton
                        disabled={page >= totalPages - 1}
                        onClick={onNext}
                    >
                        Next
                        <KeyRightArrowIcon />
                    </CustomButton>
                </Box>

                <Typography sx={{ fontSize: "14px"}}>
                    Showing {startRecord}-{endRecord} of {totalCount}
                </Typography>
            </Box>
        </Box>
    );
}