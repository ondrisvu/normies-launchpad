import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";

export const Marketplace = () => {
  return (
    <Box>
      <Box textAlign="center">
        <Typography
          fontSize={50}
          color="textPrimary"
          component="div"
          marginTop={5}
          marginBottom={5}
        >
          Coming soon
        </Typography>

        <Box display="flex" justifyContent="center" marginBottom={5}>
          <ResponsiveImage
            src="/static/images/comingsoon.png"
            alt="coming_soon"
            layout="fixed"
            height={540}
            width={960}
          />
        </Box>
        <Button variant="contained" color="buttonBackground">
          CLAIM $FOMO
        </Button>
      </Box>
    </Box>
  );
};

const ResponsiveImage = styled(Image)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    height: 270,
    width: 480,
  },
  [theme.breakpoints.down("md")]: {
    height: 270,
    width: 480,
  },
  [theme.breakpoints.down("lg")]: {},
}));
