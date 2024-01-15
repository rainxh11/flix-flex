import { useQueries } from "@tanstack/react-query"
import { useTmdb } from "../../hooks/tmdb"

export function useMovieDetails({ movieId }: { movieId: number }) {
  const { tmdbClient } = useTmdb()
  const [details, images, videos, keywords, credits, reviews, similar] =
    useQueries({
      queries: [
        {
          queryKey: ["movie", movieId, "details"],
          queryFn: () => tmdbClient.movies.details(movieId),
        },
        {
          queryKey: ["movie", movieId, "images"],
          queryFn: () => tmdbClient.movies.images(movieId),
        },
        {
          queryKey: ["movie", movieId, "videos"],
          queryFn: () => tmdbClient.movies.videos(movieId),
        },
        {
          queryKey: ["movie", movieId, "keywords"],
          queryFn: () => tmdbClient.movies.keywords(movieId),
        },
        {
          queryKey: ["movie", movieId, "credits"],
          queryFn: () => tmdbClient.movies.credits(movieId),
        },
        {
          queryKey: ["movie", movieId, "reviews"],
          queryFn: () => tmdbClient.movies.reviews(movieId),
        },
        {
          queryKey: ["movie", movieId, "similar"],
          queryFn: () => tmdbClient.movies.similar(movieId),
        },
      ],
    })
  return {
    details,
    images,
    videos,
    keywords,
    credits,
    reviews,
    similar,
    isLoading: [
      details,
      images,
      videos,
      keywords,
      credits,
      reviews,
      similar,
    ].some(x => x.isLoading || x.isFetching || x.isPending),
    errors: [details, images, videos, keywords, credits, reviews, similar]
      .filter(x => !!x.error)
      .map(x => x.error!),
  }
}
