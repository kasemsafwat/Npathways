import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{ padding: "0 20px", backgroundColor: "white", borderRadius: "8px" }}
      elevation={0}
    >
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: "#4A3AFF", fontWeight: "bold" }}
        >
          Npathways
        </Typography>
        <Button
          sx={{ color: "#5D5A88", textTransform: "none", borderRadius: "8px" }}
          component={Link}
          to="/"
        >
          Home
        </Button>
        <Button
          sx={{ color: "#5D5A88", textTransform: "none", borderRadius: "8px" }}
          component={Link}
          to="/about"
        >
          About
        </Button>
        <Button
          sx={{ color: "#5D5A88", textTransform: "none", borderRadius: "8px" }}
          component={Link}
          to="/resources"
        >
          Resources
        </Button>
        <Button
          sx={{ color: "#5D5A88", textTransform: "none", borderRadius: "8px" }}
          component={Link}
          to="/contact"
        >
          Contact
        </Button>
        <Button
          sx={{
            color: "#5D5A88",
            backgroundColor: "#ffff",
            border: "1px solid #D4D2E3",
            textTransform: "none",
            borderRadius: "8px",
            marginRight: "10px",
          }}
          variant="contained"
          component={Link}
          to="/login"
        >
          Login
        </Button>
        <Button
          sx={{
            color: "white",
            backgroundColor: "#4A3AFF",
            textTransform: "none",
            borderRadius: "8px",
          }}
          variant="contained"
          component={Link}
          to="/register"
        >
          Register
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
