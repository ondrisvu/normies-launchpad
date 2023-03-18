import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  InputAdornment,
  AccordionDetails,
  AccordionSummary,
  Accordion,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import { validate, Network } from "bitcoin-address-validation";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { questions } from "../../../constants/questions";

const btcDenominator = 100000000;

export const LaunchpadPage = () => {
  const [amountToBeMinted, setAmountToBeMinted] = useState<string>("1");
  const [address, setAddress] = useState<string>("");
  const [mintPrice, setMintPrice] = useState<number>(700000 / btcDenominator);
  const [feePrice, setFeePrice] = useState<number>(65000 / btcDenominator); // divide by 10^10
  const [totalNormiesCount, setTotalNormiesCount] = useState<number>(21);
  const [mintedCount, setMintedCount] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>("");

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

    const windowRef = window.open();

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

        // workaround for opening tabs on mac/safari
        // window.open(charge.hosted_checkout_url, "_blank");
        windowRef.location = charge.hosted_checkout_url;
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

  const handleCopy = () => {
    console.log("COPIED");
    navigator.clipboard.writeText(orderId);

    toast(() => (
      <Box display="flex" flexDirection="column">
        <Typography variant="h4" className="nes-text">
          Order ID copied to clipboard!
        </Typography>
      </Box>
    ));
  };

  return (
    <>
      <ResponsiveBox display="flex" justifyContent="center">
        <Image
          src="/static/images/mintwave.png"
          alt="mint_wave"
          height={540}
          width={960}
        />
      </ResponsiveBox>
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
      <ResponsiveBox>
        <ResponsiveTextField
          value={amountToBeMinted}
          onChange={handleAmountChange}
          type="number"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          helperText="Number of Normies to be minted"
          variant="filled"
        />
        <ResponsiveTextField
          value={address}
          onChange={handleAddressChange}
          helperText="BTC Address to receive a Normie"
          variant="filled"
        />
        <Button
          variant="contained"
          onClick={handleMint}
          color="buttonBackground"
        >
          Mint
        </Button>
      </ResponsiveBox>

      <ResponsiveBox textAlign="center" marginTop={10}>
        <ResponsiveTextField
          value={orderId}
          onChange={handleOrderChange}
          helperText="Order ID"
          variant="filled"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <ContentCopyIcon onClick={handleCopy} sx={{ color: "white" }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleCheckOrder}
          color="buttonBackground"
        >
          Check order status
        </Button>
      </ResponsiveBox>

      <Box textAlign="center" marginTop={20}>
        <Typography>FAQ</Typography>
        {questions.map((question) => (
          <Accordion sx={{ backgroundColor: "#b86515" }}>
            <AccordionSummary>{question.question}</AccordionSummary>
            <AccordionDetails>{question.answer}</AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </>
  );
};

const ResponsiveBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
  marginTop: 5,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
  [theme.breakpoints.down("lg")]: {},
}));

const ResponsiveTextField = styled(TextField)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    marginTop: 10,
    marginBottom: 10,
  },
  [theme.breakpoints.down("md")]: {
    marginTop: 10,
    marginBottom: 10,
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
