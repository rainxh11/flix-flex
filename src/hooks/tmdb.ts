import { useContext } from "react"
import { TmdbContext } from "../contexts/tmdb"

export function useTmdb() {
  const tmdbClient = useContext(TmdbContext)
  return tmdbClient
}
