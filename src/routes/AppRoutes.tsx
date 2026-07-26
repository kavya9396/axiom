import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../modules/Login/Login";
import { PATHS } from "./paths";
import RootLayout from "./RootLayout";
import Inbox from "../modules/Inbox/Inbox";
import ProtectedRoute from "./ProtectedRoute";

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
            </Route>

            {/* FALLBACK */}
            <Route path="*" element={<div>Not Found</div>} />
        </Routes>
    );
}