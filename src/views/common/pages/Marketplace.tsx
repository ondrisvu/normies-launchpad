import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";

export const Marketplace = () => {
  const handleClaimFomo = () => {
    toast(
      () => (
        <Box display="flex" flexDirection="column">
          <Typography variant="h4" className="nes-text">
            Coming soon!
          </Typography>
        </Box>
      ),
      { icon: "🍻" }
    );
  };

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

        <ImageWrapper display="flex" justifyContent="center" marginBottom={5}>
          {
            <Image
              src="/static/images/gifclaimfomo.gif"
              alt="coming_soon"
              height={540}
              width={960}
            />
          }
        </ImageWrapper>
        <Button
          variant="contained"
          color="buttonBackground"
          onClick={handleClaimFomo}
        >
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

const ImageWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    maxHeight: 270,
    maxWidth: 480,
  },
  [theme.breakpoints.down("md")]: {
    maxHeight: 270,
    maxWidth: 480,
  },
  [theme.breakpoints.down("lg")]: {
    maxHeight: 540,
    maxWidth: 960,
  },
}));
