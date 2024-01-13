import { ThemeProvider } from "@emotion/react"
import { Container, CssBaseline } from "@mui/material"
import theme from "./theme"
import { Outlet, Route, RootRoute } from "@tanstack/react-router"
//import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { SignUp, SignIn } from "./components/Auth"
import { signInSearchSchema } from "./types/route-validation"
import TopBar from "./components/App/TopBar"

const rootRoute = new RootRoute({
  component: () => (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopBar />
        <Container>
          <Outlet />
        </Container>
      </ThemeProvider>
    </>
  ),
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    )
  },
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
  signInRoute,
  signUpRoute,
])
