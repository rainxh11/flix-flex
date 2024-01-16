import { Cast } from "tmdb-ts-benlei-fork"
import { Card, CardMedia, CardContent, Typography } from "@mui/material"
import { useTmdb } from "../../hooks/tmdb"

export function TvCastCard({
  cast,
}: {
  cast: Cast & { episodeCount: number }
}) {
  const { getImageUrl } = useTmdb()

  return (
    <Card sx={{ minWidth: "150px", height: "420px" }}>
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
          {cast.character}
        </Typography>
        <Typography fontWeight="200" variant="subtitle1">
          {cast.episodeCount} {" Episodes"}
        </Typography>
      </CardContent>
    </Card>
  )
}
