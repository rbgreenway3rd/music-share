import { ThemeProvider, createTheme } from "@mui/material/styles";
import { teal, purple, grey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    background: {
      default: grey[500],
      paper: grey[300],
    },
    primary: {
      main: teal[500],
    },
    secondary: {
      main: purple[500],
    },
  },
});
export default theme;
