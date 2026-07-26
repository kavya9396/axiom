import { useState } from "react";
import type { tableData } from "../types/inbox.types";
import { useAppDispatch } from "../store/hooks";
import { claimTaskThunk } from "../store/thunks/claimTaskThunk";
import { useNavigate } from "react-router-dom";
import { getDRSPath, getGrievanceApplicationPath } from "../routes/routes";
import { roleMapper } from "../utils/config";
import type { MouseEvent } from "react";

export const useClaimTask = () => {
        const dispatch = useAppDispatch();
        const navigate = useNavigate();
        const [claimError, setClaimError] = useState("");
    
        const username = localStorage.getItem("username") ?? "";
        const password = localStorage.getItem("password") ?? "";

        const handleApplicationClick = async (
            e: MouseEvent<HTMLElement>,
            row: tableData,
        ) => {
            e.preventDefault();
            e.stopPropagation();
    
            const rawTaskId = String(row.taskId ?? "").trim();
            const [instanceFromTaskId = "", taskFromTaskId = ""] = rawTaskId.includes(".")
                ? rawTaskId.split(".")
                : ["", rawTaskId];
            const claimTaskId = taskFromTaskId;
            const rowData = row as unknown as Record<string, unknown>;
            const instanceId = String(rowData.instanceId ?? rowData.instanceID ?? instanceFromTaskId).trim();
            if (!claimTaskId) {
                setClaimError("Task id is missing. Unable to claim this case.");
                return;
            }
    
            try {
                const claimResponse = await dispatch(
                    claimTaskThunk({ username, password, taskId: claimTaskId }),
                ).unwrap();
    
                const isClaimed =
                    claimResponse.success === true ||
                    claimResponse.state?.toLowerCase() === "claimed";
    
                if (!isClaimed) {
                    setClaimError(claimResponse.message || "Failed to claim task.");
                    return;
                }
    
                const mappedRoleType =
                    roleMapper[row.roleType as keyof typeof roleMapper] ?? row.roleType;
    
                localStorage.setItem("roleType", mappedRoleType);
                localStorage.setItem("taskCompositeId", rawTaskId);
                localStorage.setItem("taskId", claimTaskId);
                if (instanceId) {
                    localStorage.setItem("instanceId", instanceId);
                }
                localStorage.setItem(
                    "selectedCaseContext",
                    JSON.stringify({
                        applicationNo: String(row.applicationNo ?? "").trim(),
                        roleType: String(row.roleType ?? "").trim(),
                        taskId: claimTaskId,
                        instanceId,
                        taskCompositeId: rawTaskId,
                    }),
                );
    
                const targetPath =
                    row.roleType === "Grievance Pool"
                        ? getGrievanceApplicationPath(row.applicationNo)
                        : getDRSPath(row.applicationNo);
    
                navigate(targetPath);
            } catch (error) {
                setClaimError(
                    error instanceof Error ? error.message : "Failed to claim task.",
                );
            }
        };

    return {
        claimError,
        setClaimError,
        handleApplicationClick
    }
}