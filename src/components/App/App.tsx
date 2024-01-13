import { useTmdb } from "../../hooks/tmdb"
import { useQuery } from "@tanstack/react-query"
export function App() {
  const tmdb = useTmdb()
  const { data: movies, isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: () => tmdb.movies.topRated(),
  })
  return <>{JSON.stringify(movies)}</>
}
