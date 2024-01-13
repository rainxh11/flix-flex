import { createContext } from "react"
import { SupabaseClient } from "@supabase/supabase-js"

export const SupabaseContext = createContext<SupabaseClient | undefined>(
  undefined,
)
export const SupabaseProvider = SupabaseContext.Provider
export const SupabaseConsumer = SupabaseContext.Consumer
SupabaseContext.displayName = "SupabaseContext"
