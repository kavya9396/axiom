import { Typography } from "@mui/material";
import React from "react";
import { getDayWithOrdinal } from "../../utils/helpers";

type LastLoginProps = {
  lastLogin: string | Date;
};


const formatLastLogin = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);

  const day = getDayWithOrdinal(date.getDate());
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear().toString().slice(-2);
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `Last login: ${day} ${month} ’${year} ; ${time.toLowerCase()}`;
};

const LastLogin: React.FC<LastLoginProps> = ({ lastLogin }) => {
  return <Typography sx={{ fontSize: 12, color: "#999" }}>{formatLastLogin(lastLogin)}</Typography>;
};

export default LastLogin;