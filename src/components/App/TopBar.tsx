import * as React from "react"
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material"
import { LoadingButton } from "@mui/lab"

import { Logout, Person } from "@mui/icons-material"
import { useRouter } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { SupabseChildrenProps, Supabase } from "../Auth/Supabase"

function LoggedAccount({
  isAuthenticated,
  session,
  client,
}: SupabseChildrenProps) {
  const router = useRouter()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)
  const { mutateAsync: handleLogout, isPending } = useMutation({
    mutationFn: async () => {
      handleClose()
      await client.auth.signOut()
    },
  })
  return (
    <>
      {isAuthenticated ? (
        <Box columnGap="10px" display="flex" alignItems="center">
          <div>
            <LoadingButton
              sx={{
                color: "white",
                alignItems: "center",
                display: "flex",
                columnGap: "10px",
                textTransform: "lowercase",
              }}
              loading={isPending}
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}>
              <Typography variant="h6">{session?.user.email}</Typography>
              <Person />
            </LoadingButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}>
              <MenuItem onClick={handleLogout}>
                <Box columnGap="10px" display="flex" alignItems="center">
                  <Logout />
                  Logout
                </Box>
              </MenuItem>
            </Menu>
          </div>
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => router.navigate({ to: "/" })}>
            FLEX FLIX
          </Typography>
          <Supabase>{value => <LoggedAccount {...value} />}</Supabase>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
