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
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import { validate, Network } from "bitcoin-address-validation";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { questions } from "../../../constants/questions";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import QRCode from "react-qr-code";
import { TabPanel } from "views/common/NormieTab";
import { FocusOn } from "react-focus-on";

const btcDenominator = 100000000;

enum PaymentType {
  Lightning,
  Chain,
}

export const LaunchpadPage = () => {
  const [amountToBeMinted, setAmountToBeMinted] = useState<string>("1");
  const [address, setAddress] = useState<string>("");
  const [mintPrice, setMintPrice] = useState<number>(700000 / btcDenominator);
  const [feePrice, setFeePrice] = useState<number>(65000 / btcDenominator); // divide by 10^10
  const [totalNormiesCount, setTotalNormiesCount] = useState<number>(21);
  const [mintedCount, setMintedCount] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>("");
  const [qrModal, setQrModal] = useState<boolean>(false);
  const [chainQrCode, setChainQrCode] = useState<string>("");
  const [lightningQrCode, setLightningQrCode] = useState<string>("");
  const [lightningExpirationDate, setLightningExpirationDate] =
    useState<number>(0);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>(
    PaymentType.Lightning
  );
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    fetch("https://ordinalsbot.com/api/collection?id=normies-wave-2")
      .then((response) => response.json())
      .then((data) => {
        const { price, serviceFee, totalCount, inscribedCount } = data;
        setMintPrice(price / btcDenominator);
        setFeePrice(serviceFee / btcDenominator);
        setTotalNormiesCount(totalCount);
        setMintedCount(inscribedCount);
      });
  }, []);

  const handleCheckOrder = () => {
    if (orderId == "") {
      toast.error(() => (
        <Box display="flex" flexDirection="column">
          <Typography variant="h4" className="nes-text">
            Error
          </Typography>
          <Typography variant="subtitle2">
            Please, fill in a valid order ID!
          </Typography>
        </Box>
      ));

      return;
    }

    fetch(`https://ordinalsbot.com/api/order?id=${orderId}`)
      .then((response) => response.json())
      .then((data) => {
        const { charge, status } = data;

        if (status == "error") {
          toast.error(() => (
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" className="nes-text">
                Error
              </Typography>
              <Typography variant="subtitle2">
                Something went wrong! Please, try again!
              </Typography>
            </Box>
          ));
        }

        if (charge.status == "unpaid") {
          toast.error(() => (
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" className="nes-text">
                Order status for {orderId}
              </Typography>
              <Typography variant="subtitle2">
                Order is {charge.status}
              </Typography>
            </Box>
          ));
        } else {
          toast(() => (
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" className="nes-text">
                Order status for {orderId}
              </Typography>
              <Typography variant="subtitle2">
                Order is {charge.status}
              </Typography>
            </Box>
          ));
        }
      });
  };

  const handleMint = () => {
    const validAddress = validate(address, Network.mainnet);

    if (!validAddress) {
      toast.error(() => (
        <Box display="flex" flexDirection="column">
          <Typography variant="h4" className="nes-text">
            Error
          </Typography>
          <Typography variant="subtitle2">
            Please, use a valid BTC address for receiving!
          </Typography>
        </Box>
      ));

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
        console.log(data);

        if (status == "error") {
          toast.error(() => (
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" className="nes-text">
                Error
              </Typography>
              <Typography variant="subtitle2">
                Something went wrong! Please, try again!
              </Typography>
            </Box>
          ));

          return;
        }

        setOrderId(charge.id);
        setChainQrCode(charge.chain_invoice.address);
        setLightningQrCode(charge.lightning_invoice.payreq);
        setLightningExpirationDate(charge.lightning_invoice.expires_at);

        setTotalCost(charge.amount / btcDenominator);

        setQrModal(true);

        // workaround for opening tabs on mac/safari
        // window.open(charge.hosted_checkout_url, "_blank");
        // windowRef.location = charge.hosted_checkout_url;
      });
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value) < 0) return;
    if (parseInt(event.target.value) > 50) {
      setAmountToBeMinted("50");
      console.log("New amount is:");
      console.log(amountToBeMinted);
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

    toast(() => (
      <Box display="flex" flexDirection="column">
        <Typography variant="h4" className="nes-text">
          Order ID copied to clipboard!
        </Typography>
      </Box>
    ));
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);

    toast(() => (
      <Box display="flex" flexDirection="column">
        <Typography variant="h4" className="nes-text">
          Address copied to clipboard!
        </Typography>
      </Box>
    ));
  };

  const handleCopyQrCode = () => {
    navigator.clipboard.writeText(
      selectedPaymentType == PaymentType.Chain ? chainQrCode : lightningQrCode
    );

    toast(() => (
      <Box display="flex" flexDirection="column">
        <Typography variant="h4" className="nes-text">
          {selectedPaymentType == PaymentType.Chain ? "Address" : "Invoice"}{" "}
          copied to clipboard!
        </Typography>
      </Box>
    ));
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
    console.log("Modal closed");

    setQrModal(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedPaymentType(newValue);
  };

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Image
          src="/static/images/wave2.png"
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
        <Typography>
          Remaining: {totalNormiesCount - mintedCount}/{totalNormiesCount}
        </Typography>
        <Typography>Mint price: {mintPrice} BTC</Typography>
        <Typography>Service Fee: {feePrice} BTC</Typography>
      </Box>

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
                  <AddIcon onClick={handleIncrement} sx={{ color: "white" }} />
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

      <Box textAlign="center" marginTop={20}>
        <Typography>FAQ</Typography>
        {questions.map((question) => (
          <Accordion sx={{ backgroundColor: "#b86515" }}>
            <AccordionSummary>{question.question}</AccordionSummary>
            <AccordionDetails>{question.answer}</AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Modal open={qrModal} onClose={() => {}} style={{ overflow: "scroll" }}>
        <FocusOn>
          <Typography
            variant="h1"
            style={{ right: 1, top: 1 }}
            position="fixed"
            onClick={handleModalClose}
          >
            X
          </Typography>
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#b86515",
            }}
            textAlign="center"
            padding={5}
          >
            <Typography variant="h1">Payment for order</Typography>
            <Typography variant="body1" marginBottom={3}>
              {orderId}
            </Typography>

            <Tabs
              value={selectedPaymentType}
              onChange={handleTabChange}
              sx={{ marginTop: 3, marginBottom: 3 }}
              indicatorColor="secondary"
              centered
              TabIndicatorProps={{
                style: { borderBottom: "4px solid #FFFFFF", color: "white" },
              }}
            >
              <Tab
                value={PaymentType.Chain}
                label="Pay on chain BTC"
                sx={{ fontSize: 11 }}
              />
              <Tab
                value={PaymentType.Lightning}
                label="Pay with Lightning"
                sx={{ fontSize: 11 }}
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
                Service fee: {feePrice} BTC ({feePrice * btcDenominator} sats)
              </Typography>
              <Typography>
                Total amount: {totalCost} BTC ({totalCost * btcDenominator}{" "}
                sats)
              </Typography>
            </Box>
          </Box>
        </FocusOn>
      </Modal>
    </>
  );
};

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
