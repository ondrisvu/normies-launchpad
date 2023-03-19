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
  Popover,
  Alert,
  Drawer,
} from "@mui/material";
import { Routes } from "constants/Routes";
import { includes } from "lodash";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo, useState, useEffect } from "react";
import { Footer } from "./Footer";
import { Extension } from "@terra-money/terra.js";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import MuiDrawer from "@mui/material/Drawer";

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
        onClick={
          disabledParam
            ? () =>
                toast(
                  () => (
                    <Box display="flex" flexDirection="column">
                      <Typography variant="h4" className="nes-text">
                        Coming soon!
                      </Typography>
                    </Box>
                  ),
                  { icon: "🍻" }
                )
            : () => router.push(link)
        }
        style={{
          borderBottom: pathname == link ? "4px solid #A3A1FF" : "none",
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
  const [anchorEl, setAnchorEl] = useState<HTMLElement>(null);

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
                    <IconButton
                      edge="start"
                      onClick={toggleDrawer}
                      size="large"
                    >
                      <MenuIcon fontSize="large" />
                    </IconButton>
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
                {isMobile ? (
                  <></>
                ) : (
                  <>
                    <MenuButton title="Launchpad" link="/" />
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
      >
        <IconButton edge="start" onClick={toggleDrawer} size="large">
          <MenuIcon fontSize="large" />
        </IconButton>
        <MenuButton title="Launchpad" link="/" />
        <MenuButton title="Airdrop" link="/airdrop" />
        <MenuButton title="Coming soon" link="" disabledParam />
      </Drawer>
    </>
  );
});
