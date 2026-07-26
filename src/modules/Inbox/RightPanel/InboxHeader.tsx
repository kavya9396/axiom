import { Box, Typography } from "@mui/material";
import CustomButton from "../../../components/ui/Button/Button";
import { COLORS, commonFlexBetween } from "../../../utils/styles";

type InboxHeaderProps = {
  selectedPool: string;
};

export default function InboxHeader({
  selectedPool,
}: InboxHeaderProps) {
  return (
    <Box
      sx={{
        ...commonFlexBetween,
        p: 0.7,
        pl: 2,
        borderRadius: "20px 20px 0 0",
        backgroundColor: COLORS.secondary,
        color: COLORS.white,
      }}
    >
      <Typography component="span">
        {selectedPool ? selectedPool.replace(/_/g, " ") : ""}
      </Typography>

      {(selectedPool === "Leave Management" ||
        selectedPool === "UW Details") && (
          <CustomButton
            variant="contained"
            size="small"
            sx={{
              backgroundColor: COLORS.white,
              color: COLORS.secondary,
              fontWeight: 700,
              fontSize: "14px",
              "&:hover": {
                backgroundColor: COLORS.white,
              },
              mr: 2,
            }}
          >
            + Add
          </CustomButton>
        )}
    </Box>
  );
}