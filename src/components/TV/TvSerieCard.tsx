import { TV } from "tmdb-ts-benlei-fork"
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
import { FavButton } from "../Shared/FavButton"
import { useFavStore } from "../../contexts/favorites"
import { useComputed } from "../../hooks"
import { Link } from "@tanstack/react-router"

export function TvSerieCard({ value }: { value: TV }) {
  const initialComponentKey = Math.random()

  const { getImageUrl } = useTmdb()
  const { addOrRemoveFromFavorites, isInFavorites, lastChangeId } =
    useFavStore<TV>()
  const isFavorite = useComputed(() => {
    return isInFavorites(value.id, "tv")
  }, [lastChangeId, initialComponentKey])
  const firstAirDate = useMemo(() => {
    try {
      return format(
        parse(value.first_air_date, "yyyy-MM-dd", new Date()),
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
      <Link to="/series/$seriesId" params={{ seriesId: value.id.toString() }}>
        <CardActionArea sx={{ height: "max-content" }}>
          <CardMedia
            component="img"
            width="100"
            image={getImageUrl(value.poster_path, 200)}
            alt={value.name}
          />
        </CardActionArea>
      </Link>
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
          <Link
            style={{ textDecoration: "none" }}
            to="/series/$seriesId"
            params={{ seriesId: value.id.toString() }}>
            <Typography
              sx={{ color: "CaptionText", "&:hover": { color: "grey" } }}
              width="-webkit-fill-available"
              flexGrow={1}
              fontWeight="bold"
              gutterBottom
              variant="body1"
              component="div">
              {value.name}
            </Typography>
          </Link>

          <FavButton
            size="large"
            value={isFavorite}
            defaultValue={isFavorite}
            onChange={v => addOrRemoveFromFavorites(value.id, "tv", value, v)}
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
            {firstAirDate}
          </Typography>
        </Box>
      </Stack>
    </Card>
  )
}
