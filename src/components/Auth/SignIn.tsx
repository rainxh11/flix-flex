import { useSupabase } from "../../hooks/supabase"
import { useMemo, useState } from "react"
import {
  Container,
  Typography,
  Box,
  TextField,
  IconButton,
  Divider,
  Link,
  Alert,
} from "@mui/material"
import { LoadingButton } from "@mui/lab"

import { Close, VisibilityOff, Visibility } from "@mui/icons-material"
import { useToggle } from "usehooks-ts"
import { useRouter, useSearch } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { SignInSearch } from "../../types/route-validation"

export function SignIn() {
  const { client } = useSupabase()
  const router = useRouter()
  const { email: routeEmail } = useSearch({
    from: "/auth/sign-in",
    strict: true,
    select: x => x as SignInSearch,
  })

  const [email, setEmail] = useState<string>(routeEmail ?? "")
  const [password, setPassword] = useState<string>("")
  const [showPassword, toggleShowPassword] = useToggle()

  const [isAllValid, validEmail, validPassword] = useMemo(() => {
    console.log("render")
    const validations = [
      !!email.match(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/),
      password?.length >= 8,
    ]
    return [validations.every(x => x), ...validations]
  }, [password, email])

  const {
    mutateAsync: handleLogin,
    error: loginError,
    isPending,
  } = useMutation({
    mutationFn: () =>
      client.auth
        .signInWithPassword({ email: email, password: password })
        .then(res => {
          if (res.error) throw res.error
          else return res
        }),
    onSuccess: () => {
      router.navigate({ to: "/" })
    },
  })

  return (
    <>
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          alignItems: "center",
          alignContent: "center",
        }}>
        <Box
          sx={{
            my: 20,
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            rowGap: "40px",
          }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Sign In
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              flexDirection: "column",
              rowGap: "15px",
            }}>
            <TextField
              sx={{ flexGrow: 1, width: "100%" }}
              value={email}
              label="Email"
              placeholder="user@email.com"
              error={!validEmail}
              onChange={e => setEmail(e.target.value)}
              helperText={validEmail ? null : "Invalid email!"}
              InputProps={{
                endAdornment: (
                  <>
                    {email.length > 0 && (
                      <IconButton onClick={() => setEmail("")}>
                        <Close />
                      </IconButton>
                    )}
                  </>
                ),
              }}
            />

            <TextField
              sx={{ flexGrow: 1, width: "100%" }}
              value={password}
              error={!validPassword}
              label="Password"
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") handleLogin()
              }}
              type={showPassword ? "text" : "password"}
              helperText={
                validPassword ? null : "Minimum length is 8 characters!"
              }
              InputProps={{
                endAdornment: (
                  <>
                    {password.length > 0 && (
                      <IconButton onClick={() => setPassword("")}>
                        <Close />
                      </IconButton>
                    )}
                    <IconButton onClick={toggleShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </>
                ),
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                justifyContent: "space-between",
              }}>
              <LoadingButton
                loading={isPending}
                disabled={!isAllValid}
                variant="contained"
                onClick={() => handleLogin()}>
                <Typography variant="h6">Login</Typography>
              </LoadingButton>
              {!!loginError && (
                <Alert severity="error">{loginError.message}</Alert>
              )}
            </Box>

            <Divider variant="middle" flexItem />
            <Typography
              variant="body1"
              sx={{
                display: "flex",
                flexDirection: "row",
                columnGap: "5px",
                justifyContent: "center",
              }}>
              New here?
              <Link onClick={() => router.navigate({ to: "/auth/sign-up" })}>
                <Typography sx={{ cursor: "pointer" }} variant="body1">
                  Register
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  )
}
