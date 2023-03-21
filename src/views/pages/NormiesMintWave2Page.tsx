import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  InputAdornment,
  AccordionDetails,
  AccordionSummary,
  Accordion,
  Modal,
  Tabs,
  Tab,
  styled,
  useMediaQuery,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import { validate, Network } from "bitcoin-address-validation";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { questions } from "../../constants/questions";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import QRCode from "react-qr-code";
import { TabPanel } from "views/common/NormieTab";
import { theme } from "../../theme";
import { toastError, toastInfo } from "utils/toast";
import { btcDenominator } from "constants/projects";
import { useRouter } from "next/router";
import CollectionId from "../../../pages/launchpad/[collectionId]";

export enum PaymentType {
  Lightning,
  Chain,
}

export const NormiesMintWave2Page = () => {
  const [amountToBeMinted, setAmountToBeMinted] = useState<string>("1");
  const [address, setAddress] = useState<string>("");
  const [mintPrice, setMintPrice] = useState<number>();
  const [feePrice, setFeePrice] = useState<number>(); // divide by 10^10
  const [totalNormiesCount, setTotalNormiesCount] = useState<number>(21);
  const [mintedCount, setMintedCount] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>("");
  const [qrModal, setQrModal] = useState<boolean>(false);
  const [chainQrCode, setChainQrCode] = useState<string>("");
  const [lightningQrCode, setLightningQrCode] = useState<string>("");
  const [lightningExpirationDate, setLightningExpirationDate] =
    useState<number>(0);
  const [mintingStatus, setMintingStatus] = useState<string>("");
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>(
    PaymentType.Lightning
  );
  const [totalCost, setTotalCost] = useState<number>(0);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentPath, setCurrentPath] = useState<string>("");

  const router = useRouter();
  const { pathname } = router;

  let url = "https://ordinalsbot.com/api/collection?id=normies-wave-2";

  if (pathname != "/launchpad/normies-wave-2" && pathname != "/") {
    url = "https://ordinalsbot.com/api/collection?id=normies";
  }

  const isMintWave1 = () => {
    return currentPath != "/launchpad/normies-wave-2" && currentPath != "/";
  };

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const { price, serviceFee, totalCount, inscribedCount, status } = data;
        setMintPrice(price / btcDenominator);
        setFeePrice(serviceFee / btcDenominator);
        setTotalNormiesCount(totalCount);
        setMintedCount(inscribedCount);
        setMintingStatus(status);
        setCurrentPath(pathname);
      });
  }, [pathname]);

  const handleCheckOrder = () => {
    if (orderId == "") {
      toastError("Error", "Please, fill in a valid order ID!");
      return;
    }

    fetch(`https://ordinalsbot.com/api/order?id=${orderId}`)
      .then((response) => response.json())
      .then((data) => {
        const { charge, status } = data;

        if (status == "error") {
          toastError("Error", "Something went wrong! Please, try again!");
        }

        if (charge.status == "unpaid") {
          toastError(
            `Order status for ${orderId}`,
            `Order is ${charge.status}`
          );
        } else {
          toastInfo(`Order status for ${orderId}`, `Order is ${charge.status}`);
        }
      });
  };

  const handleMint = () => {
    const validAddress = validate(address, Network.mainnet);

    if (!validAddress) {
      toastError("Error", "Please, use a valid BTC address for receiving!");
      return;
    }

    fetch("https://ordinalsbot.com/api/collectionorder", {
      method: "POST",
      body: JSON.stringify({
        collection: {
          id: "normies-wave-2",
          count: amountToBeMinted,
        },
        receiveAddress: address,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const { charge, status } = data;

        if (status == "error") {
          toastError("Error", "Something went wrong! Please, try again!");
          return;
        }

        setOrderId(charge.id);
        setChainQrCode(charge.chain_invoice.address);
        setLightningQrCode(charge.lightning_invoice.payreq);
        setLightningExpirationDate(charge.lightning_invoice.expires_at);

        setTotalCost(charge.amount / btcDenominator);

        setQrModal(true);
      });
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value) < 0) return;
    if (parseInt(event.target.value) > 50) {
      setAmountToBeMinted("50");
      return;
    }
    setAmountToBeMinted(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderId(event.target.value);
  };

  const handleCopyOrderID = () => {
    navigator.clipboard.writeText(orderId);

    toastInfo("Order ID copied to clipboard!");
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);

    toastInfo("Address copied to clipboard!");
  };

  const handleCopyQrCode = () => {
    navigator.clipboard.writeText(
      selectedPaymentType == PaymentType.Chain ? chainQrCode : lightningQrCode
    );

    toastInfo(
      `${
        selectedPaymentType == PaymentType.Chain ? "Address" : "Invoice"
      } copied to clipboard!`
    );
  };

  const handleIncrement = () => {
    const amount: number = Number(amountToBeMinted);
    if (amount >= 50) {
      return;
    }

    setAmountToBeMinted((amount + 1).toString());
  };

  const handleDecrement = () => {
    const amount: number = Number(amountToBeMinted);
    if (amount <= 1) {
      return;
    }

    setAmountToBeMinted((amount - 1).toString());
  };

  const handleModalClose = () => {
    setQrModal(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedPaymentType(newValue);
  };

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Image
          src={
            isMintWave1()
              ? "/static/images/soldoutpage.png"
              : "/static/images/wave2.png"
          }
          alt="mint_wave"
          height={540}
          width={960}
        />
      </Box>
      <Box>
        <Typography marginTop={5} marginBottom={5}>
          Normies is a unique collection of 555 pixel characters created by
          Zoolaxy Labs and hosted on the Bitcoin Network using the Ordinals
          protocol. It is one of the first Ordinals projects with utility and
          includes a curated Ordinal NFT launchpad. The Normies Launchpad offers
          a wide range of services for fellow project builders as well as
          freelance artists to bring their work to life on Bitcoin.
        </Typography>
      </Box>
      <Box textAlign="center">
        <Typography
          variant={mintingStatus == "minting" ? null : "h1"}
          color={mintingStatus == "minting" ? null : "red"}
        >
          {mintingStatus == "minting"
            ? `Remaining: ${
                totalNormiesCount - mintedCount
              }/${totalNormiesCount}`
            : "MINTED OUT"}
        </Typography>
        {/* <Typography>Mint price: {mintPrice} BTC</Typography>
        <Typography>Inscription Fee: {feePrice} BTC</Typography> */}
        <Typography>
          Mint price: {isMintWave1() ? mintPrice : "0.007"} BTC
        </Typography>
        <Typography>
          Inscription Fee: {isMintWave1() ? feePrice : "0.0009"} BTC
        </Typography>
      </Box>

      {mintingStatus == "minting" && (
        <Box
          marginTop={5}
          justifyItems="center"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          display="flex"
        >
          <TextField
            value={amountToBeMinted}
            onChange={handleAmountChange}
            type="number"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            helperText="Number of Normies to be minted"
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box display="flex" flexDirection="column">
                    <AddIcon
                      onClick={handleIncrement}
                      sx={{ color: "white" }}
                    />
                    <RemoveIcon
                      onClick={handleDecrement}
                      sx={{ color: "white" }}
                    />
                  </Box>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            value={address}
            onChange={handleAddressChange}
            helperText="BTC Address to receive a Normie"
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ContentCopyIcon
                    onClick={handleCopyAddress}
                    sx={{ color: "white" }}
                  />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleMint}
            color="buttonBackground"
          >
            Mint now
          </Button>
        </Box>
      )}

      {mintingStatus == "minting" && (
        <Box
          marginTop={5}
          display="flex"
          flexDirection="column"
          justifyItems="center"
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            value={orderId}
            onChange={handleOrderChange}
            helperText="Order ID"
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ContentCopyIcon
                    onClick={handleCopyOrderID}
                    sx={{ color: "white" }}
                  />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleCheckOrder}
            color="buttonBackground"
          >
            Order status
          </Button>
        </Box>
      )}

      <Box textAlign="center" marginTop={20}>
        <Typography variant="h1">FAQ</Typography>
        {questions.map((question) => (
          <Accordion sx={{ backgroundColor: "#b86515" }}>
            <AccordionSummary>{question.question}</AccordionSummary>
            <AccordionDetails>{question.answer}</AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Modal open={qrModal} onClose={() => {}} style={{ overflow: "scroll" }}>
        <>
          <Typography
            variant="h1"
            style={{ right: 1, top: 1 }}
            position="fixed"
            onClick={handleModalClose}
          >
            X
          </Typography>
          <ModulBox
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#b86515",
              borderRadius: 0.5,
            }}
            textAlign="center"
          >
            <Typography variant={isMobile ? "h4" : "h2"}>
              Payment for order
            </Typography>
            <Typography variant={isMobile ? "body2" : "body1"} marginBottom={3}>
              {orderId}
            </Typography>

            <Tabs
              value={selectedPaymentType}
              onChange={handleTabChange}
              sx={
                isMobile
                  ? { marginBottom: 1 }
                  : { marginTop: 3, marginBottom: 3 }
              }
              indicatorColor="secondary"
              centered
              TabIndicatorProps={{
                style: { borderBottom: "4px solid #FFFFFF", color: "white" },
              }}
            >
              <Tab
                value={PaymentType.Chain}
                label="On-chain BTC"
                sx={isMobile ? { fontSize: 9 } : { fontSize: 11 }}
              />
              <Tab
                value={PaymentType.Lightning}
                label="Lightning"
                sx={isMobile ? { fontSize: 9 } : { fontSize: 11 }}
              />
            </Tabs>

            <TabPanel index={PaymentType.Chain} value={selectedPaymentType}>
              <Box marginTop={2} marginBottom={5}>
                <QRCode value={chainQrCode} />
              </Box>
              <Typography>Copy address below:</Typography>
              <TextField
                type="filled"
                value={chainQrCode}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <ContentCopyIcon
                        onClick={handleCopyQrCode}
                        sx={{ color: "white" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </TabPanel>

            <TabPanel index={PaymentType.Lightning} value={selectedPaymentType}>
              <Box marginTop={2} marginBottom={5}>
                <QRCode value={lightningQrCode} />
              </Box>
              <Typography>Copy invoice below:</Typography>
              <TextField
                value={lightningQrCode}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <ContentCopyIcon
                        onClick={handleCopyQrCode}
                        sx={{ color: "white" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </TabPanel>

            <Box marginTop={5}>
              <Typography>
                Inscription fee: {feePrice} BTC (
                {Math.round(feePrice * btcDenominator)} sats)
              </Typography>
              <Typography>
                Total amount: {totalCost} BTC ({totalCost * btcDenominator}{" "}
                sats)
              </Typography>
            </Box>
          </ModulBox>
        </>
      </Modal>
    </>
  );
};

const ModulBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    padding: 2,
  },
  [theme.breakpoints.down("md")]: {
    padding: 4,
  },
  [theme.breakpoints.down("lg")]: {
    padding: 5,
  },
  [theme.breakpoints.up("lg")]: {
    padding: 8,
  },
}));
