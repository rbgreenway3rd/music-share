import { ThemeProvider, createTheme } from "@mui/material/styles";
import { teal, purple } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: teal[500],
    },
    secondary: {
      main: purple[500],
    },
  },
});
export default theme;
