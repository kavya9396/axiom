import {
  Alert,
  Snackbar,
  type AlertColor,
  type AlertProps,
  type SnackbarProps,
  type SxProps,
  type Theme,
} from "@mui/material";
import type { ReactNode } from "react";

interface CustomSnackbarProps
  extends Omit<SnackbarProps, "message" | "children"> {
  message: ReactNode;
  severity?: AlertColor;
  variant?: AlertProps["variant"];

  alertSx?: SxProps<Theme>;
  snackbarSx?: SxProps<Theme>;

  onClose: () => void;
}

const CustomSnackbar = ({
  open,
  onClose,
  message,
  severity = "success",
  variant = "filled",
  autoHideDuration = 3000,
  anchorOrigin = { vertical: "top", horizontal: "center" },
  alertSx,
  snackbarSx,
  ...rest
}: CustomSnackbarProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      sx={snackbarSx}
      {...rest}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant={variant}
        sx={{
          width: "100%",
          ...alertSx,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;