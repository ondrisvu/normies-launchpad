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

const StyledAppBar = styled(AppBar)`
  background: transparent;
  z-index: ${(props) => props.theme.zIndex.drawer + 1};
`;
type Props = {
  children: React.ReactNode;
};

const MenuButton = ({ title, link }: { title: string; link: string }) => {
  const router = useRouter();
  const { pathname } = router;
  return (
    <Box paddingX={2}>
      <Button
        variant="text"
        onClick={() => router.push(link)}
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
  const { children } = props;

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
                <MenuButton title="Launchpad" link="/" />
                <MenuButton title="Coming soon" link="/marketplace" />
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
    </>
  );
});
