import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";

export const Error404Page = () => {
  return (
    <Box sx={{ height: "100hv" }} textAlign="center">
      <Typography variant="h1">Page not found</Typography>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Image
          src="/static/images/5.png"
          alt="Normie"
          height={150}
          width={150}
        />
        <Image
          src="/static/images/6.png"
          alt="Normie"
          height={150}
          width={150}
        />
        <Image
          src="/static/images/7.png"
          alt="Normie"
          height={150}
          width={150}
        />
      </Box>

      <Box display="flex" alignItems="center" justifyContent="center">
        <Image
          src="/static/images/7.png"
          alt="Normie"
          height={150}
          width={150}
        />
        <Image
          src="/static/images/5.png"
          alt="Normie"
          height={150}
          width={150}
        />
        <Image
          src="/static/images/6.png"
          alt="Normie"
          height={150}
          width={150}
        />
      </Box>

      <Box display="flex" alignItems="center" justifyContent="center">
        <Image
          src="/static/images/6.png"
          alt="Normie"
          height={150}
          width={150}
        />
        <Image
          src="/static/images/7.png"
          alt="Normie"
          height={150}
          width={150}
        />
        <Image
          src="/static/images/5.png"
          alt="Normie"
          height={150}
          width={150}
        />
      </Box>
    </Box>
  );
};
