import { Session, SupabaseClient } from "@supabase/supabase-js"
import { useContext, useEffect, useState, useMemo } from "react"

import { SupabaseContext } from "../contexts/supabase"

export function useSupabaseClient(): SupabaseClient {
  const client = useContext(SupabaseContext)
  if (!client) throw Error("Supabase Client Not Found!")
  return client
}

export function useSupabase() {
  const client = useSupabaseClient()
  const [session, setSession] = useState<Session | null>()

  useEffect(() => {
    client.auth.onAuthStateChange((_, _session) => {
      setSession(_session)
    })
  }, [client])

  const isAuthenticated = useMemo(() => !!session, [session])
  return { session, client, isAuthenticated }
}
