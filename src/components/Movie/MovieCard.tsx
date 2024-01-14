import { Movie } from "tmdb-ts-benlei-fork"
import { useQuery } from "@tanstack/react-query"
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
import { minBy } from "lodash"

export function MovieCard({ value }: { value: Movie }) {
  const { getImageUrl } = useTmdb()

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
        <Typography
          fontWeight="bold"
          gutterBottom
          variant="body1"
          component="div">
          {value.title}
        </Typography>
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
            {value.release_date}
          </Typography>
        </Box>
      </Stack>
    </Card>
  )
}
