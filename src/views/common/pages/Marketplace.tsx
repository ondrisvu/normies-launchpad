import dayjs from "dayjs";
import { Box, Button, Grid, Typography } from "@mui/material";
import { AuctionNft } from "interfaces/auction.interface";
import { Nft } from "interfaces/nft.interface";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect, useMemo } from "react";
import { determineAuctionState } from "utils/auction.util";
import { useConnectedWallet } from "@terra-money/wallet-provider";
import { KnowhereTab, KnowhereTabs, TabPanel } from "../KnowhereTab";
import { EmptyState } from "../EmptyState";
import { maskAddress } from "utils/address.util";
import { styled } from "@mui/material/styles";

enum TabIndex {
  NFT,
  Selling,
  Claim,
}
const NftButton = ({ nft, type }: { type: "nft"; nft: Nft | AuctionNft }) => {
  const router = useRouter();
  const auctionState =
    "end_time" in nft &&
    determineAuctionState(
      dayjs(new Date(+nft.end_time * 1000)),
      dayjs(),
      nft?.is_settled
    );
  const readyToSettle = auctionState === "ready_for_settlement";
  const isSettled = "is_settled" in nft ? nft?.is_settled : false;
  const isListing =
    auctionState === "not_started" || auctionState === "bidding";

  const onSelling = () => {
    router.push(`/my-nft/${type}/${nft?.token_id}`);
  };

  const goToAuction = () => {
    if (!("auction_id" in nft)) return;
    router.push(`/auction/${nft.auction_id}`);
  };

  const renderButtonFromState = () => {
    if (isSettled) {
      return (
        <button
          type="button"
          className="nes-btn is-disable"
          style={{ width: "100%", height: "40px" }}
          disabled
        >
          <Typography>Settled</Typography>
        </button>
      );
    }
    if (readyToSettle) {
      return (
        <button
          type="button"
          className="nes-btn is-primary"
          style={{ width: "100%", height: "40px" }}
          onClick={goToAuction}
        >
          <Typography>Settle</Typography>
        </button>
      );
    }
    if (isListing) {
      return (
        <>
          <button
            type="button"
            className="nes-btn is-warning"
            style={{
              width: "40px",
              height: "40px",
              marginRight: "5px",
              color: "white",
            }}
            onClick={goToAuction}
          >
            <Box style={{ marginTop: "-10px" }}>
              <Typography>fdsfsd</Typography>
            </Box>
          </button>
          <button
            type="button"
            className={`nes-btn ${
              auctionState === "not_started" ? "is-error" : "is-disabled"
            }`}
            style={{ width: "100%", height: "40px", marginLeft: "5px" }}
            disabled={auctionState !== "not_started"}
          >
            <Typography>Delist</Typography>
          </button>
        </>
      );
    }
    return (
      <button
        type="button"
        className="nes-btn is-success"
        style={{ width: "100%", height: "40px" }}
        onClick={onSelling}
      >
        <Typography>Sell now</Typography>
      </button>
    );
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      paddingX={3}
      paddingY={2}
      style={{ gap: "8px" }}
      flex={1}
    >
      <Box flex={1} display="flex" alignItems="flex-end">
        {renderButtonFromState()}
      </Box>
    </Box>
  );
};

export const Marketplace = () => {
  const [value, setValue] = useState(TabIndex.NFT);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box textAlign="center">
        <Typography
          fontSize={50}
          color="textPrimary"
          component="div"
          marginTop={5}
          marginBottom={5}
        >
          Coming soon
        </Typography>

        <Box display="flex" justifyContent="center" marginBottom={5}>
          <ResponsiveImage
            src="/static/images/comingsoon.png"
            alt="coming_soon"
            layout="fixed"
            height={540}
            width={960}
          />
        </Box>
        <Button variant="contained" color="buttonBackground">
          CLAIM $FOMO
        </Button>
      </Box>
      {/* <Box marginTop={2}>
        <KnowhereTabs value={value} onChange={handleChange}>
          <KnowhereTab value={TabIndex.NFT} label="NFT" />
          <KnowhereTab value={TabIndex.Selling} label="Selling" />
          <KnowhereTab value={TabIndex.Claim} label="Claim Your NFT" />
        </KnowhereTabs>
        <Box marginTop={4}>
          <TabPanel value={value} index={TabIndex.NFT}>
            <Grid container spacing={3.5}>
              {nfts.map((data) => (
                <Grid key={data?.token_id} item xs={6} md={3}>
                  <NftCard nft={data} />
                </Grid>
              ))}
              {nfts.length === 0 && <EmptyState />}
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={TabIndex.Selling}>
            <Grid container spacing={3.5}>
              {selling.map((data) => (
                <Grid key={data.token_id} item xs={6} md={3}>
                  <NftCard nft={data as AuctionNft} />
                </Grid>
              ))}
              {selling.length === 0 && <EmptyState />}
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={TabIndex.Claim}>
            <Grid container spacing={3.5}>
              {waitingNfts.map((data) => (
                <Grid key={data.token_id} item xs={6} md={3}>
                  <NftCard nft={data as AuctionNft} />
                </Grid>
              ))}
              {waitingNfts.length === 0 && <EmptyState />}
            </Grid>
          </TabPanel>
        </Box>
      </Box> */}
    </Box>
  );
};

const ResponsiveImage = styled(Image)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    height: 270,
    width: 480,
  },
  [theme.breakpoints.down("md")]: {
    height: 270,
    width: 480,
  },
  [theme.breakpoints.down("lg")]: {},
}));
