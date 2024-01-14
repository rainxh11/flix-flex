import { Movie } from "tmdb-ts-benlei-fork"
import { parse, format } from "date-fns"
import {
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  Stack,
  Box,
} from "@mui/material"
import { CircularProgressWithLabel } from "../Shared/CircularProgressWithLabel"
import { useTmdb } from "../../hooks/tmdb"
import { useMemo } from "react"
import { useFavStore } from "../../contexts/favorites"
import { FavButton } from "../Shared/FavButton"
import { useComputed } from "../../hooks"

export function MovieCard({ value }: { value: Movie }) {
  const initialComponentKey = Math.random()
  const { addOrRemoveFromFavorites, isInFavorites, lastChangeId } =
    useFavStore<Movie>()
  const isFavorite = useComputed(
    () => isInFavorites(value.id, "movie"),
    [lastChangeId, initialComponentKey],
  )
  const { getImageUrl } = useTmdb()
  const releaseDate = useMemo(() => {
    try {
      return format(
        parse(value.release_date, "yyyy-MM-dd", new Date()),
        "MMM d, yyyy",
      )
    } catch {
      return "N/A"
    }
  }, [])

  return (
    <Card
      sx={{
        width: 200,
        height: 440,
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
      }}>
      <CardActionArea sx={{ height: "max-content" }}>
        <CardMedia
          component="img"
          width="100"
          image={getImageUrl(value.poster_path, 200)}
          alt={value.title}
        />
      </CardActionArea>
      <Stack
        width="-webkit-fill-available"
        display="flex"
        margin="10px"
        direction="column"
        flex={1}
        justifyContent="space-between"
        alignItems="start"
        spacing={0}>
        <Box
          width="-webkit-fill-available"
          display="flex"
          flexDirection="row"
          alignContent="center"
          justifyContent="space-between"
          alignSelf="start">
          <Typography
            width="-webkit-fill-available"
            flexGrow={1}
            fontWeight="bold"
            gutterBottom
            variant="body1"
            component="div">
            {value.title}
          </Typography>
          <FavButton
            size="large"
            value={isFavorite}
            defaultValue={isFavorite}
            onChange={v =>
              addOrRemoveFromFavorites(value.id, "movie", value, v)
            }
          />
        </Box>
        <Box
          width="-webkit-fill-available"
          display="flex"
          flexDirection="row"
          alignContent="center"
          justifyContent="space-between"
          alignSelf="start">
          <CircularProgressWithLabel
            color={
              value.vote_average >= 7
                ? "success"
                : value.vote_average <= 5
                ? "error"
                : "primary"
            }
            value={value.vote_average * 10}
            label={value.vote_average.toFixed(1)}
          />

          <Typography
            alignSelf="end"
            gutterBottom
            variant="subtitle1"
            component="div">
            {releaseDate}
          </Typography>
        </Box>
      </Stack>
    </Card>
  )
}
