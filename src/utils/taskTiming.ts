import type { tableData, TaskTimingColumnKey, TaskTimingStatus } from "../types/inbox.types";
import { COLORS } from "./styles";

const ISO_TIME_ZONE_PATTERN = /(Z|[+-]\d{2}:?\d{2})$/i;
const IST_TIME_ZONE = "Asia/Kolkata";

export const TASK_TIMING_ROW_STYLES: Record<
    TaskTimingStatus,
    { backgroundColor: string; hoverColor: string; textColor: string }
> = {
    normal: {
        backgroundColor: "inherit",
        hoverColor: COLORS.aliceBlue,
        textColor: "inherit",
    },
    atRisk: {
        backgroundColor: COLORS.cream,
        hoverColor: COLORS.pastelYellow,
        textColor: COLORS.darkAmber,
    },
    due: {
        backgroundColor: COLORS.blush,
        hoverColor: COLORS.rose,
        textColor: COLORS.burgundy,
    },
};

export const TASK_TIMING_COLUMN_KEYS = new Set<TaskTimingColumnKey>(["start_time", "at_risk_time", "due_date"]);

export const taskTimingFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: IST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
});

const getTimestamp = (value?: string) => {
    const trimmedValue = value?.trim();
    if (!trimmedValue) return null;

    const utcValue = ISO_TIME_ZONE_PATTERN.test(trimmedValue) ? trimmedValue : `${trimmedValue}Z`;
    const timestamp = Date.parse(utcValue);
    return Number.isNaN(timestamp) ? null : timestamp;
};

export const formatTaskTimingValue = (value: unknown) => {
    if (typeof value !== "string") {
        return String(value ?? "");
    }

    const timestamp = getTimestamp(value);
    return timestamp === null ? value : `${taskTimingFormatter.format(new Date(timestamp))} IST`;
};

export const getTaskTimingStatus = (row: tableData, now: number): TaskTimingStatus => {
    const startTime = getTimestamp(row.start_time);
    const atRiskTime = getTimestamp(row.at_risk_time);
    const dueDate = getTimestamp(row.due_date);

    if (startTime !== null && now < startTime) {
        return "normal";
    }

    if (dueDate !== null && now >= dueDate) {
        return "due";
    }

    if (atRiskTime !== null && now >= atRiskTime) {
        return "atRisk";
    }

    return "normal";
};
