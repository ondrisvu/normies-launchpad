import { Box, Typography } from "@mui/material";
import { quotes } from "constants/quote";

import Image from "next/image";
import { useMemo } from "react";

export const EmptyState = () => {
  // const randomQuote = useMemo(() => {
  //   const quoteIndex = Math.floor(Math.random() * quotes.length);
  //   return quotes[quoteIndex];
  // }, []);

  return (
    <Box
      display="flex"
      marginTop="80px"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Image
        src="/static/images/5.png"
        alt="empty_state"
        layout="fixed"
        height={250}
        width={250}
      />

      <Image
        src="/static/images/6.png"
        alt="empty_state"
        layout="fixed"
        height={250}
        width={250}
      />

      <Image
        src="/static/images/7.png"
        alt="empty_state"
        layout="fixed"
        height={250}
        width={250}
      />

      <Typography marginTop="40px" key="quote">
        {/* {randomQuote} */}
      </Typography>
    </Box>
  );
};
