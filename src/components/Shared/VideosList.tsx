import { Video } from "tmdb-ts-benlei-fork"
import { Box, Stack } from "@mui/material"
import { YoutubeEmbed } from "./YoutubeEmbed"

export function VideosList({ videos }: { videos?: Video[] }) {
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
          {videos
            ?.filter(x => !!x.key)
            .map(video => (
              <YoutubeEmbed videoKey={video.key!} height={200} width={300} />
            ))}
        </Stack>
      </Box>
    </Box>
  )
}
