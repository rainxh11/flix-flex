import { useTmdb } from "../../hooks/tmdb"
import { useQuery } from "@tanstack/react-query"
import { CircularProgress, Typography } from "@mui/material"
import { ContentSearch } from "../Shared/ContentSearch"
import { useEffect, useMemo, useState } from "react"
import { TvSeriesList } from "./TvSeriesList"

function PopularTvSeriesList(props: {
  searchQuery: string
  page: number
  onMaxPagesChanges: (val: number) => void
}) {
  const { tmdbClient } = useTmdb()

  const { data: series, isLoading } = useQuery({
    queryKey: ["series", "popular", props],
    queryFn: () =>
      props.searchQuery?.length > 0
        ? tmdbClient.search.tvShows({
            query: props.searchQuery,
            page: props.page,
          })
        : tmdbClient.tvShows.popular({ page: props.page }),
  })
  const maxPages = useMemo(
    () => series?.total_pages ?? 0,
    [series?.total_pages],
  )
  useEffect(() => {
    props.onMaxPagesChanges(maxPages)
  }, [maxPages])

  return isLoading ? (
    <CircularProgress variant="indeterminate" />
  ) : (
    <TvSeriesList series={series?.results} />
  )
}

export function PopularTvSeries() {
  const [maxPages, setMaxPages] = useState<number>(1)
  return (
    <>
      <Typography marginBottom="30px" variant="h4">
        Popular TV Shows
      </Typography>
      <ContentSearch maxPages={maxPages}>
        {(search, page) => (
          <PopularTvSeriesList
            onMaxPagesChanges={v => setMaxPages(v)}
            searchQuery={search}
            page={page}
          />
        )}
      </ContentSearch>
    </>
  )
}
