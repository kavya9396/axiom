import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../modules/Login/Login";
import { PATHS } from "./paths";
import RootLayout from "./RootLayout";
import Inbox from "../modules/Inbox/RightPanel/Inbox";
import ProtectedRoute from "./ProtectedRoute";
import SearchApplication from "../modules/Inbox/LeftPanel/SearchApplication";
import DRS from "../modules/DRS/DRS";

export default function AppRoutes() {
    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* PROTECTED */}
            <Route element={<ProtectedRoute />}>
                <Route path={PATHS.INBOX} element={<RootLayout />}>
                    <Route index element={<Inbox />} />
                </Route>

                <Route path={PATHS.SEARCH_APPLICATION} element={<RootLayout />}>
                    <Route index element={<SearchApplication />} />
                </Route>

                <Route path={PATHS.DRS} element={<RootLayout />}>
                    <Route index element={<DRS />} />
                </Route>
            </Route>

            {/* FALLBACK */}
            <Route path="*" element={<div>Not Found</div>} />
        </Routes>
    );
}