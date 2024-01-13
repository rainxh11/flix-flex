import { Session, SupabaseClient } from "@supabase/supabase-js"
import { useContext, useState } from "react"
import { useAsyncEffect } from "use-async-effect"

import { SupabaseContext } from "../contexts/supabase"
import { useComputed } from "."

export function useSupabaseClient(): SupabaseClient {
  const client = useContext(SupabaseContext)
  if (client === undefined) throw Error("Supabase Client Not Found!")
  return client
}

export function useSupabase() {
  const client = useSupabaseClient()
  const [session, setSession] = useState<Session | null>()
  useAsyncEffect(async () => {
    await client.auth
      .getSession()
      .then(res => setSession(res.data.session))
      .catch(err => console.error(err))
  }, [])
  client.auth.onAuthStateChange((_, _session) => {
    setSession(_session)
  })
  const isAuthenticated = useComputed(() => !!session, [session])
  return { session, client, isAuthenticated }
}
