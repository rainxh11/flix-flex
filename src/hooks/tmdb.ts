import { useContext } from "react"
import { TmdbContext } from "../contexts/tmdb"

export function useTmdb() {
  const tmdbClient = useContext(TmdbContext)
  return {
    tmdbClient,
    getImageUrl: (path?: string, width?: number) => {
      const size = !width ? "original" : `w${width}`
      return `https://image.tmdb.org/t/p/${size}${path}`
    },
  }
}
