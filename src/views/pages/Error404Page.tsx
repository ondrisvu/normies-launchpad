import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";

export const Error404Page = () => {
  return (
    <Box sx={{ height: "100hv" }} textAlign="center">
      <Typography variant="h1">Error 404: Page not found</Typography>
      <Box display="flex" justifyContent="center">
        <Image
          src="/static/images/error.png"
          alt="mint_wave"
          height={540}
          width={960}
        />
      </Box>
    </Box>
  );
};
