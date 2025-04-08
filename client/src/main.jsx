import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@fontsource/poppins";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { InstructorAuthProvider } from "./contexts/InstructorAuthContext.jsx";
import "dotenv/config";

const theme = createTheme({
  typography: {
    fontFamily: ["poppins"].join(","),
  },
  cssVariables: true,

  palette: {
    seagreen: "#46C98B",
    primary: {
      main: "#46C98B", // Main color
      light: "#E6F8F2", // Light green
      dark: "#2A7D5D", // Dark green
      contrastText: "#FFFFFF",
    },
    mintcream: "#EEFAF4",
    background: {
      main: "#F9F9F9", // Background color
      dark: "#181B21", // Dark gray
    },
    midnight: "#0B162C",
    text: {
      primary: "#0E121A", // Dark blue
      secondary: "#181B21", // Dark gray
      white: "#FFFFFF", // White
      gray: "#757575", // Gray
    },
  },
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <InstructorAuthProvider>
          <App />
        </InstructorAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
