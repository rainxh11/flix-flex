import { createTheme, responsiveFontSizes } from "@mui/material/styles"
import { red, blue, green } from "@mui/material/colors"

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: ["'Source Sans 3'", "Arial", "sans-serif"].join(","),
  },
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

export default responsiveFontSizes(theme)
