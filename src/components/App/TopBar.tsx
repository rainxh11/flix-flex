import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { Link } from "@tanstack/react-router"

import { Logout, Person } from "@mui/icons-material"
import { useRouter } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { SupabseChildrenProps, Supabase } from "../Auth/Supabase"
import { DropdownMenu } from "../Shared/DropdownMenu"

function LoggedAccount({
  isAuthenticated,
  session,
  client,
}: SupabseChildrenProps) {
  const router = useRouter()
  const { mutateAsync: handleLogout, isPending } = useMutation({
    mutationFn: () => client.auth.signOut(),
  })
  return (
    <>
      {isAuthenticated ? (
        <Box columnGap="10px" display="flex" alignItems="center">
          <DropdownMenu>
            {({ isOpen, anchorRef, toggleMenu, anchorEl }) => (
              <>
                <LoadingButton
                  sx={{
                    color: "white",
                    alignItems: "center",
                    display: "flex",
                    columnGap: "10px",
                    textTransform: "lowercase",
                  }}
                  ref={anchorRef}
                  loading={isPending}
                  onClick={toggleMenu}>
                  <Typography variant="h6">{session?.user.email}</Typography>
                  <Person />
                </LoadingButton>
                <Menu anchorEl={anchorEl} open={isOpen} onClose={toggleMenu}>
                  <MenuItem
                    onClick={() => {
                      toggleMenu()
                      handleLogout()
                    }}>
                    <Box columnGap="10px" display="flex" alignItems="center">
                      <Logout />
                      Logout
                    </Box>
                  </MenuItem>
                </Menu>
              </>
            )}
          </DropdownMenu>
        </Box>
      ) : (
        <Button
          color="inherit"
          onClick={() => router.navigate({ to: "/auth/sign-in" })}>
          <Typography variant="h6">Login</Typography>
        </Button>
      )}
    </>
  )
}

export default function TopBar() {
  const router = useRouter()

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          columnGap: "20px",
        }}>
        <Box>
          <Supabase>{value => <LoggedAccount {...value} />}</Supabase>
        </Box>
        <Box flexGrow={1}>
          <DropdownMenu>
            {({ isOpen, anchorRef, toggleMenu, anchorEl }) => (
              <>
                <Button
                  sx={{ color: "white" }}
                  ref={anchorRef}
                  onClick={toggleMenu}>
                  <Typography variant="h6">Movies</Typography>
                </Button>
                <Menu anchorEl={anchorEl} open={isOpen} onClose={toggleMenu}>
                  <MenuItem onClick={() => router.navigate({ to: "/movies" })}>
                    Popular
                  </MenuItem>
                  <MenuItem onClick={() => router.navigate({ to: "/movies" })}>
                    Trailers
                  </MenuItem>{" "}
                </Menu>
              </>
            )}
          </DropdownMenu>
        </Box>
        <Typography
          variant="h4"
          fontWeight="bold"
          component="div"
          sx={{ flexGrow: 0, cursor: "pointer" }}
          onClick={() => router.navigate({ to: "/" })}>
          FLEX FLIX
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
