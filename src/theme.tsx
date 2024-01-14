import { createTheme } from "@mui/material/styles"
import { red, blue, green } from "@mui/material/colors"

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: blue[700],
    },
    secondary: {
      main: green[600],
    },
    error: {
      main: red.A400,
    },
    background: {
      //default: grey[900],
    },
  },
})

export default theme
