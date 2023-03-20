import { Box, Grid } from "@mui/material";
import { CollectionCard, EmptyCard } from "views/common/CollectionCard";
import { projectIds } from "constants/projects";

export const LaunchpadPage = () => {
  return (
    <Box
      marginTop={10}
      justifyContent="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <EmptyCard />
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 1, sm: 1, md: 3, lg: 4 }}
        justifyContent="center"
        alignItems="center"
      >
        {projectIds.map((projectId) => (
          <CollectionCard collectionId={projectId} />
        ))}
      </Grid>
    </Box>
  );
};
