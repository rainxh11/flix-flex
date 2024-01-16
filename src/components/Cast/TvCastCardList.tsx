import { Cast } from "tmdb-ts-benlei-fork"
import { Box, Stack } from "@mui/material"
import { TvCastCard } from "./TvCastCard"

export function TvCastCardList({
  castList,
}: {
  castList?: (Cast & { episodeCount: number })[]
}) {
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
            <TvCastCard cast={cast} />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
