import { useSupabase } from "../../hooks/supabase"
import { useState, useMemo } from "react"
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
import { useRouter } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"

export function SignUp() {
  const { client } = useSupabase()
  const router = useRouter()

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, toggleShowPassword] = useToggle()

  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [showConfirmPassword, toggleShowConfirmPassword] = useToggle()

  const [isAllValid, validEmail, validPassword, validConfirmation] =
    useMemo(() => {
      console.log("render")

      const validations = [
        !!email.match(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        password?.length >= 8,
        password === confirmPassword,
      ]
      return [validations.every(x => x), ...validations]
    }, [password, email, confirmPassword])

  const {
    mutateAsync: handleRegister,
    error: signupError,
    isPending,
  } = useMutation({
    mutationFn: () =>
      client.auth.signUp({ email: email, password: password }).then(res => {
        if (res.error) throw res.error
        else return res
      }),
    onSuccess: () => {
      router.navigate({ to: "/auth/sign-in", search: { email: email } })
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
            Register Account
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

            <TextField
              sx={{ flexGrow: 1, width: "100%" }}
              value={confirmPassword}
              error={!validConfirmation}
              label="Confirm Password"
              onChange={e => setConfirmPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              helperText={validConfirmation ? null : "Passwords doesn't match!"}
              InputProps={{
                endAdornment: (
                  <>
                    {confirmPassword.length > 0 && (
                      <IconButton onClick={() => setConfirmPassword("")}>
                        <Close />
                      </IconButton>
                    )}
                    <IconButton onClick={toggleShowConfirmPassword}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              <Box onClick={() => handleRegister()}>
                <LoadingButton
                  loading={isPending}
                  disabled={!isAllValid}
                  variant="contained"
                  color="success">
                  <Typography variant="h6">Register</Typography>
                </LoadingButton>
              </Box>

              {!!signupError && (
                <Alert severity="error">{signupError.message}</Alert>
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
              Already registered?
              <Link onClick={() => router.navigate({ to: "/auth/sign-in" })}>
                <Typography sx={{ cursor: "pointer" }} variant="body1">
                  Login
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  )
}
