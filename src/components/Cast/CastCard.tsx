import { Cast } from "tmdb-ts-benlei-fork"
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Stack,
  Container,
} from "@mui/material"
import { useTmdb } from "../../hooks/tmdb"

export function CastCard({ cast }: { cast: Cast }) {
  const { getImageUrl } = useTmdb()

  return (
    <Card sx={{ minWidth: "150px", height: "370px" }}>
      <CardMedia
        component="img"
        loading="lazy"
        image={getImageUrl(cast.profile_path, 200)}
      />
      <CardContent>
        <Typography variant="subtitle1" fontWeight="900">
          {cast.original_name}
        </Typography>
        <Typography fontWeight="200" variant="subtitle1">
          {cast.name}
        </Typography>
      </CardContent>
    </Card>
  )
}

export function CastCardList({ castList }: { castList?: Cast[] }) {
  return (
    <Container
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
            <CastCard cast={cast} />
          ))}
        </Stack>
      </Box>
    </Container>
  )
}
