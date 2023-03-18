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
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Remove } from "@mui/icons-material";

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

      <Box
        marginTop={10}
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
          Mint
        </Button>
      </Box>

      <Box
        marginTop={10}
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
    </>
  );
};

const ResponsiveBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
  marginTop: 5,
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
  [theme.breakpoints.down("lg")]: {},
}));
