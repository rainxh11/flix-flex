import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Box, Tab } from "@mui/material"
import { useState } from "react"
import { useFavStore } from "../../contexts/favorites"
import { useComputed, useIntervalComputed } from "../../hooks"
import { MovieList } from "../Movie/MovieList"
import { TvSeriesList } from "../TV/TvSeriesList"
import { Movie, TV } from "tmdb-ts-benlei-fork"

type TabType = "movie" | "tv"
export function FavoritesList() {
  const [selectedTab, setSelectedTab] = useState<TabType>("movie")
  const { getUserFavorites, lastChangeId } = useFavStore()
  const tvFavs = useIntervalComputed(
    () => {
      return getUserFavorites()
        .filter(x => x.type === "tv")
        .map(x => x.value as TV)
    },
    [lastChangeId],
    500,
  )
  const movieFavs = useIntervalComputed(
    () => {
      return getUserFavorites()
        .filter(x => x.type === "movie")
        .map(x => x.value as Movie)
    },
    [lastChangeId],
    500,
  )

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={selectedTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={(_, t) => setSelectedTab(t)}
            aria-label="lab API tabs example">
            <Tab label="Movies" value="movie" />
            <Tab label="TV Series" value="tv" />
          </TabList>
        </Box>
        <TabPanel value="movie">
          <MovieList movies={movieFavs} />
        </TabPanel>
        <TabPanel value="tv">
          <TvSeriesList series={tvFavs} />
        </TabPanel>
      </TabContext>
    </Box>
  )
}
