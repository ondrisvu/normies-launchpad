import { Box } from "@mui/material";
import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box role="tabpanel" width="100%" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </Box>
  );
};
