
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e3a8a" // PSU-friendly navy blue
    },
    secondary: {
      main: "#0f766e"
    }
  },
  typography: {
    fontFamily: "Segoe UI, Roboto, Arial",
    h5: {
      fontWeight: 600
    }
  }
});

export default theme;
