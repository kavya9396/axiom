import { Box, Grid } from "@mui/material"
import LeftPanel, { ALL_CASES_POOL } from "../LeftPanel/LeftPanel"
import { useCallback, useEffect, useRef, useState } from "react";
import type { tableData } from "../../../types/inbox.types";
import { useAppDispatch } from "../../../store/hooks";
import { fetchInboxThunk } from "../../../store/thunks/inboxThunk";
import RightPanel from "../RightPanel/RightPanel";

const Inbox = () => {
  const dispatch = useAppDispatch();
  const [toggle, setToggle] = useState(false);
  const [selectedPool, setSelectedPool] = useState("");
  const [poolData, setPoolData] = useState<Record<string, tableData[]>>({});
  const isRefreshing = useRef(false);
  const allRows = Object.values(poolData).flat();

  const loadData = useCallback(async () => {
    if (isRefreshing.current) return;
    isRefreshing.current = true;

    try {
      const username = localStorage.getItem("username") ?? "";
      const password = localStorage.getItem("password") ?? "";
      const roleResponse = await dispatch(fetchInboxThunk({ username, password })).unwrap();
      const poolDataFromAPI = roleResponse.poolData ?? {};
      const hasPools = Object.keys(poolDataFromAPI).length > 0;

      setPoolData(poolDataFromAPI);
      setSelectedPool((previousPool) => {
        if (previousPool === ALL_CASES_POOL && hasPools) {
          return ALL_CASES_POOL;
        }
        if (previousPool && poolDataFromAPI[previousPool]) {
          return previousPool;
        }
        return hasPools ? ALL_CASES_POOL : "";
      });
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      isRefreshing.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    const initialLoadTimeoutId = window.setTimeout(() => {
      loadData();
    }, 0);

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    }, 30000);

    return () => {
      window.clearTimeout(initialLoadTimeoutId);
      window.clearInterval(intervalId);
    };
  }, [loadData]);

  return (
    <Box>
      <Grid container sx={{ flexWrap: "nowrap" }}>
        <LeftPanel
          selectedPool={selectedPool}
          toggle={toggle}
          setToggle={setToggle}
          onSelectPool={setSelectedPool}
          poolData={poolData}
        />
        <Box sx={{ flex: 1 }}>
          <RightPanel 
            selectedPool={selectedPool}
            rows={selectedPool === ALL_CASES_POOL ? allRows : (poolData[selectedPool] ?? [])}
          />
        </Box>
      </Grid>
    </Box>
  )
}

export default Inbox