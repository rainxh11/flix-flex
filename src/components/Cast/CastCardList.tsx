import { Cast } from "tmdb-ts-benlei-fork"
import { Box, Stack } from "@mui/material"
import { CastCard } from "./CastCard"

export function CastCardList({ castList }: { castList?: Cast[] }) {
  return (
    <Box
      sx={{
        position: "relative",
      }}>
      <Box maxWidth="100%" overflow="auto" padding={1} borderRadius="20px">
        <Stack
          display="flex"
          flexDirection="row"
          flex={1}
          justifyContent="start"
          columnGap="10px"
          alignItems="center">
          {castList?.map(cast => (
            <CastCard key={cast.credit_id} cast={cast} />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
