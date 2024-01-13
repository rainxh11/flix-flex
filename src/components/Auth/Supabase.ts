import { useSupabase } from "../../hooks/supabase"
import { type ReactNode } from "react"

export type SupabseChildrenProps = ReturnType<typeof useSupabase>
export type SupabaseProps = {
  children: (value: ReturnType<typeof useSupabase>) => ReactNode
}
export function Supabase({ children }: SupabaseProps) {
  const value = useSupabase()
  return children(value)
}
