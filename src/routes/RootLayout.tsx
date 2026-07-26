import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import { Box } from "@mui/material";
import { COLORS } from "../utils/styles";
// import QuickLinks from "../modules/DRS/QuickLinks";

export default function RootLayout() {
    // const { pathname } = useLocation();
    // const isInboxPage = pathname === "/inbox";
    // const isLoginPage = pathname === "/login";
    // const isMainDrsPage = /\/[^/]+\/app\/[^/]+\/drs$/.test(pathname);
    // const shouldShowQuickLinks = !isInboxPage && !isLoginPage && !isMainDrsPage;

    return (
        <>
            <header>
                <Header />
            </header>
            <Box
                component="main"
                sx={{
                    bgcolor: COLORS.frost,
                    minHeight: "calc(100vh - 64px)",
                }}
            >
                <Outlet />
                {/* {shouldShowQuickLinks && <QuickLinks />} */}
            </Box>
        </>
    );
}