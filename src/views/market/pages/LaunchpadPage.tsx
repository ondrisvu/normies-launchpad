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

const btcDenominator = 100000000;
interface Question {
  question: string;
  answer: string;
}
const questions: Question[] = [
  {
    question: "Should I use Bitcoin onchain or Lightning Network to pay?",
    answer: `We recommend that you use Lightning to pay for the inscription as they are instant and free. On chain Bitcoin payments can take much longer as they need to wait for 1-confirmation on Bitcoin.
You can use Cash App , Wallet of Satoshi or any other Lightning wallet to pay Lightning invoices.`,
  },
  {
    question: "Can I pay from an exchange?",
    answer:
      "Yes, however, please remember that all exchanges take a fee, so you will need to compensate for this and make sure you send the correct amount shown on the invoice.",
  },
  {
    question: "What wallets can I use to pay?",
    answer:
      "You can use any BTC or Lightning wallet. The wallet you use to pay does not need to be the same as the one we sent your inscription to.",
  },
  {
    question: "What to do if I have underpaid for an order?",
    answer:
      "If you underpay due to any reason (exchange fees, miner fees etc.) your order status will show as underpaid and you'll be able to complete the payment or take a refund by following the link in the order checker.",
  },
  {
    question: "Can I receive multiple ordinals to 1 address?",
    answer:
      "It's perfectly fine to receive multiple ordinals to 1 address. You just need to be careful about doing coin control and making sure ordinals are safe when they're being moved.",
  },
  {
    question: "I paid, where is my inscription?",
    answer:
      "When your payment is confirmed, the bot will inscribe your Ordinal to an internal wallet, your order will then go into the delivery phase. You can use the order checker to see the current status of the delivery and set receive address if you haven't already.",
  },
  {
    question: "How do I check the status of my order?",
    answer: `You can use the Check order status button to check your order status

      OR
      
      On the main page of ordinalsbot.com, there is a form where you can input your order number to check the status of your order and set receive address if you haven't already.`,
  },
  {
    question: "What if I lost my order number?",
    answer:
      "If you lose your order number and need it to check your order, you will need to contact the Ordinalsbot.com team on Discord.",
  },
  {
    question: "Why is it taking so long to receive my inscription?",
    answer:
      "We inscribe your ordinal immediately as soon as we receive your payment however bitcoin blockchain prioritizes higher fee transactions. So if you've selected a low fee you may need to wait for a long time for inscription transaction to confirm depending on the state of the bitcoin mempool.",
  },
];

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
    const windowRef = window.open();

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
