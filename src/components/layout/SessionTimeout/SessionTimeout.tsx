import { Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../utils/auth";
import { SessionTimeoutContext } from "./sessionTimeoutContext";
import CustomDialog from "../../ui/Dialog/Dialog";
import CustomButton from "../../ui/Button/Button";
import { COLORS } from "../../../utils/styles";

const COUNTDOWN_TICK_MS = 1000;

const SESSION_TIMEOUT_MINUTES = 15;
const WARNING_MINUTES = 1;

const LOGOUT_TIME_MS = SESSION_TIMEOUT_MINUTES * 60 * 1000;
const WARNING_BEFORE_LOGOUT_MS = WARNING_MINUTES * 60 * 1000;

const activityEvents = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"] as const;

const SessionTimeout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const warningTimerRef = useRef<number | undefined>(undefined);
  const logoutTimerRef = useRef<number | undefined>(undefined);
  const countdownTimerRef = useRef<number | undefined>(undefined);
  const logoutAtRef = useRef(0);
  const [showWarning, setShowWarning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(LOGOUT_TIME_MS);

  const clearTimers = useCallback(() => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = undefined;
    }

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = undefined;
    }

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = undefined;
    }
  }, []);

  const logoutUser = useCallback(() => {
    clearTimers();
    setShowWarning(false);
    auth.logout();
    navigate("/login", { replace: true });
  }, [clearTimers, navigate]);

  const startInactivityTimer = useCallback(() => {
    clearTimers();
    logoutAtRef.current = Date.now() + LOGOUT_TIME_MS;

    warningTimerRef.current = window.setTimeout(() => {
      setShowWarning(true);

      countdownTimerRef.current = window.setInterval(() => {
        setRemainingMs(Math.max(logoutAtRef.current - Date.now(), 0));
      }, COUNTDOWN_TICK_MS);
    }, LOGOUT_TIME_MS - WARNING_BEFORE_LOGOUT_MS);

    logoutTimerRef.current = window.setTimeout(logoutUser, LOGOUT_TIME_MS);

    countdownTimerRef.current = window.setInterval(() => {
      setRemainingMs(Math.max(logoutAtRef.current - Date.now(), 0));
    }, COUNTDOWN_TICK_MS);
  }, [clearTimers, logoutUser]);

  const resetInactivityTimer = useCallback(() => {
    setShowWarning(false);
    setRemainingMs(LOGOUT_TIME_MS);
    startInactivityTimer();
  }, [startInactivityTimer]);

  const sessionTimeoutContextValue = useMemo(
    () => ({
      remainingMs,
    }),
    [remainingMs],
  );

  useEffect(() => {
    startInactivityTimer();

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer);
    });

    return () => {
      clearTimers();
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer);
      });
    };
  }, [clearTimers, resetInactivityTimer, startInactivityTimer]);

  return (
    <SessionTimeoutContext.Provider value={sessionTimeoutContextValue}>
      {children}
      <CustomDialog
        open={showWarning}
        onClose={resetInactivityTimer}
        title={
          <Typography sx={{ fontSize: "16px", fontWeight: 700, color: COLORS.secondary }}>
            Session Timeout Warning
          </Typography>
        }
        actionsSx={{ justifyContent: "center", pb: 2 }}
        actions={
          <CustomButton onClick={resetInactivityTimer} sx={{ borderRadius: "50px", px: 4 }}>
            Stay Logged In
          </CustomButton>
        }
      >
        <Typography sx={{ fontSize: "12px", color: COLORS.charcoal }}>
          You will be logged out after {WARNING_MINUTES} minute due to inactivity.
        </Typography>
      </CustomDialog>
    </SessionTimeoutContext.Provider>
  );
};

export default SessionTimeout;