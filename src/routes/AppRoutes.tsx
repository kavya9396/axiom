import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../modules/Login/Login";
import { PATHS } from "./paths";
import RootLayout from "./RootLayout";
import Inbox from "../modules/Inbox/Inbox";

export default function AppRoutes() {
    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path={PATHS.INBOX} element={<RootLayout />}>
                    <Route index element={<Inbox />} />
            </Route>

            {/* FALLBACK */}
            <Route path="*" element={<div>Not Found</div>} />
        </Routes>
    );
}