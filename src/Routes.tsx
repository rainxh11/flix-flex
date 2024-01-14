import { ThemeProvider } from "@emotion/react"
import { Container, CssBaseline, Box } from "@mui/material"
import theme from "./theme"
import { Outlet, Route, RootRoute } from "@tanstack/react-router"
//import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { SignUp, SignIn } from "./components/Auth"
import { PopularMovies } from "./components/Movie/PopularMovies"
import { signInSearchSchema } from "./types/route-validation"
import TopBar from "./components/App/TopBar"

const rootRoute = new RootRoute({
  component: () => (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopBar />
        <Container>
          <Box margin="10px">
            <Outlet />
          </Box>
        </Container>
      </ThemeProvider>
    </>
  ),
})

const moviesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/movies",
  component: () => <PopularMovies />,
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <PopularMovies />,
})

const signInRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/auth/sign-in",

  validateSearch: signInSearchSchema,
  component: () => <SignIn />,
})
const signUpRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/auth/sign-up",
  component: () => <SignUp />,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  moviesRoute,
  signInRoute,
  signUpRoute,
])
