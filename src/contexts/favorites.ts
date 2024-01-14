import { useAtom } from "jotai"
import { useSupabase } from "../hooks/supabase"
import { atom } from "jotai"
import { useRandomKey } from "../hooks"
import { useEffect } from "react"
import { TV, Movie } from "tmdb-ts-benlei-fork"

type FavType = "movie" | "tv"
interface FavItem {
  type: FavType
  itemId: number
  value: Movie | TV
}

export type Favorites = Record<string, FavItem[]>

const addOrRemoveFromFavorites = (
  favorites: Favorites,
  email: string,
  id: number,
  type: FavType,
  item: Movie | TV,
  state: boolean,
): Favorites => {
  console.log("favs", favorites)
  if (!favorites[email]) {
    favorites[email] = []
  }
  if (state) {
    if (isInFavorites(favorites, email, id, type)) return favorites
    favorites[email].push({ type, itemId: id, value: item })
    return favorites
  } else {
    favorites[email] = favorites[email].filter(x => x.itemId !== id)
    return favorites
  }
}

const isInFavorites = (
  favorites: Favorites,
  email: string,
  id: number,
  type: FavType,
): boolean => {
  if (!favorites[email]) return false
  return favorites[email].some(x => x.itemId === id && x.type === type)
}

const clearUserFavorites = (favorites: Favorites, email: string): Favorites => {
  delete favorites[email]
  return favorites
}

const getUserFavorites = (favorites: Favorites, email: string): FavItem[] => {
  if (!favorites[email]) return []
  return favorites[email]
}

const favoritesAtom = atom<Favorites>({})

export function useFavStore<T extends Movie | TV>() {
  const [fav, setFavStore] = useAtom(favoritesAtom)
  const { session } = useSupabase()
  const [lastChangeId, setIsChanged] = useRandomKey()
  useEffect(() => {
    setIsChanged()
  }, [fav])
  return {
    //store: [fav, setFavStore],
    lastChangeId,
    isInFavorites: (id: number, type: FavType) => {
      return isInFavorites(fav, session?.user.email as string, id, type)
    },
    addOrRemoveFromFavorites: (
      id: number,
      type: FavType,
      item: T,
      state: boolean,
    ) => {
      setFavStore(v =>
        addOrRemoveFromFavorites(
          v,
          session?.user.email as string,
          id,
          type,
          item,
          state,
        ),
      )
      setIsChanged()
    },
    getUserFavorites: () =>
      getUserFavorites(fav, session?.user.email as string),
    clearUserFavorites: () => {
      clearUserFavorites(fav, session?.user.email as string)
      setIsChanged()
    },
  }
}
