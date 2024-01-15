import { useTmdb } from "../../hooks/tmdb"
import { useQuery } from "@tanstack/react-query"
import { CircularProgress, Typography } from "@mui/material"
import { ContentSearch } from "../Shared/ContentSearch"
import { useEffect, useMemo, useState } from "react"
import { MovieList } from "./MovieList"
import { SpinnerWrapper } from "../Shared/Spinner"

function PopularMoviesList(props: {
  searchQuery: string
  page: number
  onMaxPagesChanges: (val: number) => void
}) {
  const { tmdbClient } = useTmdb()

  const { data: movies, isLoading } = useQuery({
    queryKey: ["movies", "popular", props],
    queryFn: () =>
      props.searchQuery?.length > 0
        ? tmdbClient.search.movies({
            query: props.searchQuery,
            page: props.page,
          })
        : tmdbClient.movies.popular({ page: props.page }),
  })
  const maxPages = useMemo(
    () => movies?.total_pages ?? 0,
    [movies?.total_pages],
  )
  useEffect(() => {
    props.onMaxPagesChanges(maxPages)
  }, [maxPages])

  return (
    <SpinnerWrapper show={isLoading}>
      <MovieList movies={movies?.results} />
    </SpinnerWrapper>
  )
}

export function PopularMovies() {
  const [maxPages, setMaxPages] = useState<number>(1)
  return (
    <>
      <Typography marginBottom="30px" variant="h4">
        Popular Movies
      </Typography>
      <ContentSearch maxPages={maxPages}>
        {(search, page) => (
          <PopularMoviesList
            onMaxPagesChanges={v => setMaxPages(v)}
            searchQuery={search}
            page={page}
          />
        )}
      </ContentSearch>
    </>
  )
}
