import { Box, Container } from "@mui/material";
import CustomButton from "../ui/Button/Button";
import { COLORS } from "../../utils/styles";

interface ExpandAllAccordionProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
  isAllExpanded: boolean;
}

const ExpandAllAccordions: React.FC<ExpandAllAccordionProps> = ({
  onExpandAll,
  onCollapseAll,
  isAllExpanded,
}) => {
  return (
    <Container disableGutters>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <CustomButton
          variant="text"
          sx={{
            color: COLORS.darkGray,
            textDecoration: "underline",
            "&:hover": {
              textDecoration: "underline",
              backgroundColor: "transparent",
            },
          }}
          onClick={() => (isAllExpanded ? onCollapseAll() : onExpandAll())}
        >
          {isAllExpanded ? "Collapse All" : "Expand All"}
        </CustomButton>
      </Box>
    </Container>
  );
};

export default ExpandAllAccordions;
