// import App, { AppProps, AppContext } from 'next/app'

import "react-toastify/dist/ReactToastify.css";
import "./../src/styles.css";

import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import {
  StylesProvider,
  ThemeProvider as MaterialThemeProvider,
} from "@mui/styles";
import { GlobalStyle } from "GlobalStyle";
import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { theme } from "theme";
import { Navbar } from "views/common/Navbar";
import ReactGA from "react-ga";
import { ToastifyCloseButton } from "utils/toast";

if (typeof window !== "undefined") {
  ReactGA.initialize(process.env.NEXT_PUBLIC_GA);
  ReactGA.pageview(window.location.pathname + window.location.search);
}
const CustomApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>The Normal Launchpad - NORMIES</title>
      </Head>
      <GlobalStyle />
      <StylesProvider injectFirst>
        <MaterialThemeProvider theme={theme}>
          <EmotionThemeProvider theme={theme}>
            <CssBaseline />
            <ToastContainer
              position="top-right"
              hideProgressBar
              pauseOnFocusLoss={false}
              closeButton={ToastifyCloseButton}
              icon={true}
              autoClose={10000}
              newestOnTop
              closeOnClick={false}
              toastStyle={{ backgroundColor: "#b86515" }}
            />
            <Navbar>
              <Component {...pageProps} />
            </Navbar>
          </EmotionThemeProvider>
        </MaterialThemeProvider>
      </StylesProvider>
    </>
  );
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// CustomApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default CustomApp;
