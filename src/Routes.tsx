import { ThemeProvider } from "@emotion/react"
import { Container, CssBaseline, Box } from "@mui/material"
import theme from "./theme"
import { Outlet, Route, RootRoute } from "@tanstack/react-router"
//import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { SignUp, SignIn } from "./components/Auth"
import { PopularMovies } from "./components/Movie/PopularMovies"
import { MovieDetails } from "./components/Movie/MovieDetails"
import { PopularTvSeries } from "./components/TV/PopularTvSeries"
import { signInSearchSchema } from "./types/route-validation"
import TopBar from "./components/App/TopBar"
import { FavoritesList } from "./components/Favorites/FavoritesList"

const rootRoute = new RootRoute({
  component: () => (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopBar />
        <Outlet />
      </ThemeProvider>
    </>
  ),
})

const moviesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/movies",
  component: () => (
    <Container>
      <Box margin="10px" position="relative">
        <PopularMovies />
      </Box>
    </Container>
  ),
})
const movieDetailsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/movies/$movieId",
  component: () => <MovieDetails />,
})

const tvRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/tv",
  component: () => (
    <Container>
      <Box margin="10px" position="relative">
        <PopularTvSeries />{" "}
      </Box>
    </Container>
  ),
})

const favRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/favorites",
  component: () => (
    <Container>
      <Box margin="10px" position="relative">
        <FavoritesList />{" "}
      </Box>
    </Container>
  ),
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Container>
      <Box margin="10px" position="relative">
        <PopularMovies />
      </Box>
    </Container>
  ),
})

const signInRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/auth/sign-in",

  validateSearch: signInSearchSchema,
  component: () => (
    <Container>
      <Box margin="10px" position="relative">
        <SignIn />,
      </Box>
    </Container>
  ),
})
const signUpRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/auth/sign-up",
  component: () => (
    <Container>
      <Box margin="10px" position="relative">
        <SignUp />{" "}
      </Box>
    </Container>
  ),
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  moviesRoute.addChildren([movieDetailsRoute]),
  tvRoute,
  favRoute,
  signInRoute,
  signUpRoute,
])
