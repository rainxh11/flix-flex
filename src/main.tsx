import React, { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider, Router } from "@tanstack/react-router"
import { routeTree } from "./Routes"
import { SupabaseProvider } from "./contexts/supabase"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { createClient } from "@supabase/supabase-js"
import { TmdbProvider, tmdbClient } from "./contexts/tmdb"
import { Provider as JotaiProvider } from "jotai"

import "@fontsource/source-sans-3/300.css"
import "@fontsource/source-sans-3/400.css"
import "@fontsource/source-sans-3/500.css"
import "@fontsource/source-sans-3/700.css"

const router = new Router({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
const queryClient = new QueryClient()

const rootElement = document.getElementById("root")!
const root = ReactDOM.createRoot(rootElement)
root.render(
  <StrictMode>
    {/* <Profiler id="App" onRender={v => console.log(v)}> */}
    <SupabaseProvider value={supabaseClient}>
      <QueryClientProvider client={queryClient}>
        <TmdbProvider value={tmdbClient}>
          <JotaiProvider>
            <RouterProvider router={router} />
          </JotaiProvider>
        </TmdbProvider>
      </QueryClientProvider>
    </SupabaseProvider>
    {/* </Profiler> */}
  </StrictMode>,
)
