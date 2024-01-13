import { TMDB } from "tmdb-ts-benlei-fork"
import { createContext } from "react"

export const tmdbClient = new TMDB(import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN)
export const TmdbContext = createContext(tmdbClient)
export const TmdbProvider = TmdbContext.Provider
export const TmdbConsumer = TmdbContext.Consumer
TmdbContext.displayName = "TmdbContext"
