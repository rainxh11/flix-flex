import { TV } from "tmdb-ts-benlei-fork"
import { TvSerieCard } from "./TvSerieCard"
import { Box } from "@mui/material"

export function TvSeriesList(props: { series: TV[] | undefined }) {
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
      {props.series?.map(serie => (
        <TvSerieCard key={serie.id} value={serie} />
      ))}
    </Box>
  )
}
