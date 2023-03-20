import styled from "@emotion/styled";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Drawer,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Footer } from "./Footer";
import { makeStyles } from "@material-ui/core/styles";
import { toastComingSoon } from "utils/toast";

const useStyles = makeStyles({
  paper: {
    background: "#b86515",
    color: "white",
  },
});

const StyledAppBar = styled(AppBar)`
  background: transparent;
  z-index: ${(props) => props.theme.zIndex.drawer + 1};
`;
type Props = {
  children: React.ReactNode;
};

const MenuButton = ({
  title,
  link,
  disabledParam,
}: {
  title: string;
  link: string;
  disabledParam?: boolean;
}) => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <Box paddingX={2}>
      <Button
        variant="text"
        onClick={disabledParam ? toastComingSoon : () => router.push(link)}
        style={{
          borderBottom: pathname == link ? "4px solid #FFFFFF" : "none",
          borderRadius: "0",
        }}
      >
        <Typography
          variant="body1"
          component="div"
          style={{ color: "#ffffff" }}
        >
          {title}
        </Typography>
      </Button>
    </Box>
  );
};

export const Navbar = observer((props: Props) => {
  const styles = useStyles();
  const { children } = props;

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Container fixed>
        <StyledAppBar position="static">
          <Toolbar style={{ paddingLeft: 0, paddingRight: 0 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flex={1}
            >
              <Box display="flex" alignItems="flex-end">
                <Box marginRight={2}>
                  {isMobile ? (
                    <Box display="flex">
                      <IconButton
                        edge="start"
                        onClick={toggleDrawer}
                        size="large"
                        sx={{ marginLeft: 3 }}
                      >
                        <MenuIcon fontSize="large" color="primary" />
                      </IconButton>

                      <Link href="/" passHref>
                        <Box component="a" display="flex">
                          <Image
                            src="/static/images/LOGO PNG.png"
                            width={100}
                            height={100}
                          />
                        </Box>
                      </Link>
                    </Box>
                  ) : (
                    <Link href="/" passHref>
                      <Box component="a" display="flex">
                        <Image
                          src="/static/images/LOGO PNG.png"
                          width={100}
                          height={100}
                        />
                      </Box>
                    </Link>
                  )}
                </Box>
                {isMobile ? null : (
                  <>
                    <MenuButton title="Mint Wave 2" link="/" />
                    <MenuButton title="Launchpad" link="/launchpad" />
                    <MenuButton title="Airdrop" link="/airdrop" />
                    <MenuButton title="Coming soon" link="" disabledParam />
                  </>
                )}
              </Box>
            </Box>
          </Toolbar>
        </StyledAppBar>
        <Box minHeight="100vh" marginTop={2}>
          <img
            src="/static/images/backgroundgif.gif"
            style={{
              minHeight: "100%",
              minWidth: "1024px",
              width: "100%",
              height: "auto",
              objectFit: "cover" as any,
              position: "fixed" as any,
              top: 0,
              left: 0,
              zIndex: -200,
            }}
          />

          {children}
          <Footer />
        </Box>
      </Container>
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
        classes={{ paper: styles.paper }}
        ModalProps={{ onBackdropClick: toggleDrawer }}
      >
        <Box display="flex">
          <IconButton
            edge="start"
            onClick={toggleDrawer}
            size="large"
            sx={{ marginLeft: 2 }}
          >
            <MenuIcon fontSize="large" color="primary" />
          </IconButton>
          <Link href="/" passHref>
            <Box component="a" display="flex">
              <Image src="/static/images/LOGO PNG.png" width={70} height={70} />
            </Box>
          </Link>
        </Box>

        <MenuButton title="Mint Wave 2" link="/" />
        <MenuButton title="Launchpad" link="/launchpad" />
        <MenuButton title="Airdrop" link="/airdrop" />
        <MenuButton title="Coming soon" link="" disabledParam />
      </Drawer>
    </>
  );
});
