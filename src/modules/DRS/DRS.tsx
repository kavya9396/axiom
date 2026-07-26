import { useNavigate } from "react-router-dom";
import BackButton from "../../components/layout/BackButton";
import { getInboxPath } from "../../routes/routes";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

const DRS = () => {
    const navigate = useNavigate();
    const roleType = localStorage.getItem("roleType") ?? "";

    return (
        <>
            <BackButton
                label="Back to inbox"
                justify="flex-start"
                onClick={() => navigate(getInboxPath())}
                rightSlot={roleType != 'MMT Pool' ?
                    <Box style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                        <Box style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                            <Typography
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: 800,
                                    color: "#161616",
                                    lineHeight: 1,
                                }}
                            >
                                Application No. : 
                                {/* {safeApplicationNumber} */}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    color: "#0f4c81",
                                    backgroundColor: "#dcefff",
                                    border: "1px solid #b8d8f4",
                                    borderRadius: "999px",
                                    px: 1.5,
                                    py: 0.5,
                                    lineHeight: 1,
                                }}
                            >
                                Business Type : 
                                {/* {safeBusinessType.toUpperCase()} */}
                            </Typography>
                        </Box>
                    </Box> : ''
                }
            />
        </>
    )
}

export default DRS