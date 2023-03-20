import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";
import { btcDenominator } from "constants/projects";
import { useRouter } from "next/router";
import { toastComingSoon } from "utils/toast";
import Link from "next/link";

export const CollectionCard = ({ collectionId }) => {
  const [collectionName, setCollectionName] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [mintedCount, setMintedCount] = useState<number>(0);
  const [coverImage, setCoverImage] = useState<string>(""); // cover
  const [mintPrice, setMintPrice] = useState<number>(0);
  const [collectionStatus, setCollectionStatus] = useState<string>("");

  const imageLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  const handleRoute = () => {
    if (collectionId == "normies-wave-2") {
      router.push("/");
    } else {
      router.push(`/launchpad/${collectionId}`);
    }
  };

  const router = useRouter();

  useEffect(() => {
    fetch(`https://ordinalsbot.com/api/collection?id=${collectionId}`)
      .then((response) => response.json())
      .then((data) => {
        const { name, inscribedCount, totalCount, status, price, cover } = data;
        setCollectionName(name);
        setTotalCount(totalCount);
        setMintedCount(inscribedCount);
        setCoverImage(cover);
        setMintPrice(price);
        setCollectionStatus(status);
      });
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#b86515",
        margin: 1,
        "&:hover": { transform: "scale3d(1.1, 1.1, 1)" },
        marginTop: 5,
      }}
      display="flex"
      flexDirection="column"
      borderRadius={0.5}
      onClick={handleRoute}
      alignItems="center"
      justifyContent="center"
    >
      <Box
        display="flex"
        sx={{
          position: "relative",
          width: 200,
          height: 200,
        }}
      >
        <Image
          loader={imageLoader}
          src={
            collectionId == "normies"
              ? "https://ordinalsbot.s3.us-west-2.amazonaws.com/90843eca-3cd6-47c0-8ccb-5eb41cf6ff50_featured.png?w=1920&q=75"
              : coverImage
          }
          alt={`${collectionId}-cover`}
          style={{
            objectFit: "cover",
          }}
        />
      </Box>
      <Box width="100%">
        <Typography textAlign="center">{collectionName}</Typography>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="space-around">
            <Typography variant="caption">
              {collectionStatus == "minting" ? "Remaining" : ""}
            </Typography>
            <Typography variant="caption">Price</Typography>
          </Box>
          <Box display="flex" justifyContent="space-around">
            <Typography variant="caption">
              {collectionStatus == "minting"
                ? `${totalCount - mintedCount}/${totalCount}`
                : "Minted"}
            </Typography>
            <Typography variant="caption">
              {mintPrice / btcDenominator} BTC
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const EmptyCard = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#b86515",
        margin: 1,
        "&:hover": { transform: "scale3d(1.1, 1.1, 1)" },
      }}
      display="flex"
      flexDirection="column"
      borderRadius={0.5}
      height={200}
      width={200}
      textAlign="center"
      justifyContent="center"
      onClick={toastComingSoon}
    >
      <Typography>+Create collection</Typography>
    </Box>
  );
};
