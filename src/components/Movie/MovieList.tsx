import { Movie } from "tmdb-ts-benlei-fork"
import { MovieCard } from "../Movie/MovieCard"
import { Box } from "@mui/material"

export function MovieList(props: { movies: Movie[] | undefined }) {
  return (
    <Box
      marginY="10px"
      display="flex"
      flexDirection="row"
      flexWrap="wrap-reverse"
      columnGap="10px"
      rowGap="20px"
      justifyContent="start"
      alignItems="center">
      {props.movies?.map(movie => (
        <MovieCard key={movie.id} value={movie} />
      ))}
    </Box>
  )
}
