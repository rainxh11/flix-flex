import { useContext } from "react"
import { TmdbContext } from "../contexts/tmdb"

export function useTmdb() {
  const tmdbClient = useContext(TmdbContext)
  return {
    tmdbClient,
    getImageUrl: (path: string, width: number = 200) =>
      `https://image.tmdb.org/t/p/w${width}${path}`,
  }
}
