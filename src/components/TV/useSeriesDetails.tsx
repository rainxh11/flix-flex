import { useQueries } from "@tanstack/react-query"
import { useTmdb } from "../../hooks/tmdb"
import { maxBy, orderBy } from "lodash"
import { useComputed } from "../../hooks"

export function useSeriesDetails({ seriesId }: { seriesId: number }) {
  const { tmdbClient } = useTmdb()
  const [details, images, videos, keywords, credits, reviews, similar] =
    useQueries({
      queries: [
        {
          queryKey: ["tv", seriesId, "details"],
          queryFn: () => tmdbClient.tvShows.details(seriesId),
        },
        {
          queryKey: ["tv", seriesId, "images"],
          queryFn: () => tmdbClient.tvShows.images(seriesId),
        },
        {
          queryKey: ["tv", seriesId, "videos"],
          queryFn: () => tmdbClient.tvShows.videos(seriesId),
        },
        {
          queryKey: ["tv", seriesId, "keywords"],
          queryFn: () => tmdbClient.tvShows.keywords(seriesId),
        },
        {
          queryKey: ["tv", seriesId, "credits"],
          queryFn: () => tmdbClient.tvShows.credits(seriesId),
        },
        {
          queryKey: ["tv", seriesId, "reviews"],
          queryFn: () => tmdbClient.tvShows.reviews(seriesId),
        },
        {
          queryKey: ["tv", seriesId, "similar"],
          queryFn: () => tmdbClient.tvShows.similar(seriesId),
        },
      ],
    })
  const lastSeason = useComputed(
    () =>
      details.data ? maxBy(details.data!.seasons!, x => x.season_number) : null,
    [details],
  )
  const [lastSeasonDetails, lastSeasonImages] = useQueries({
    queries: [
      {
        queryKey: [
          "tv",
          seriesId,
          "season",
          lastSeason?.season_number,
          "details",
        ],
        queryFn: () =>
          tmdbClient.tvSeasons.details({
            seasonNumber: lastSeason?.season_number ?? 1,
            tvShowID: seriesId,
          }),
      },
      {
        queryKey: [
          "tv",
          seriesId,
          "season",
          lastSeason?.season_number,
          "images",
        ],
        queryFn: () =>
          tmdbClient.tvSeasons.images({
            seasonNumber: lastSeason?.season_number ?? 1,
            tvShowID: seriesId,
          }),
      },
    ],
  })

  const seasonsDetails = useQueries({
    queries: orderBy(details.data?.seasons, x => x.season_number).map(
      season => ({
        queryKey: ["tv", seriesId, "season", season.season_number, "details"],
        queryFn: () =>
          tmdbClient.tvSeasons.details({
            seasonNumber: season.season_number,
            tvShowID: seriesId,
          }),
      }),
    ),
  })
  return {
    seasonsDetails,
    details,
    images,
    videos,
    keywords,
    credits,
    reviews,
    similar,
    lastSeasonDetails,
    lastSeasonImages,
    lastSeason,
    isLoading: [
      details,
      images,
      videos,
      keywords,
      credits,
      reviews,
      similar,
    ].some(x => x.isLoading || x.isFetching || x.isPending),
    errors: [
      details,
      images,
      videos,
      keywords,
      credits,
      reviews,
      similar,
      lastSeasonDetails,
      lastSeasonImages,
    ]
      .filter(x => !!x.error)
      .map(x => x.error!),
  }
}
