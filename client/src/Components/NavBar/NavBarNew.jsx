import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "Courses", path: "/courses" },
  { label: "Instructors", path: "/instructors" },
  { label: "Chat", path: "/chat" },
];

const NavBarNew = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: "#0B162C", height: 100 }}>
      <Toolbar sx={{ height: 80, mt: "5px" }}>
        {/* Logo and Brand Name */}
        <Box display="flex" alignItems="center">
          <Box
            component="img"
            src="../../../public/pathways_chiropractic.png"
            alt="Npathways Logo"
            sx={{ width: 60, height: 60 }}
          />
          <Typography
            variant="h5"
            sx={{
              ml: 2,
              fontFamily: "Poppins-Bold, Helvetica",
              fontWeight: 700,
              color: "white",
              fontSize: "1.5rem",
              letterSpacing: "-0.40px",
              lineHeight: "36px",
            }}
          >
            Npathways
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ ml: 6 }}>
          {navigationItems.map((item) => (
            <Typography
              key={item.label}
              sx={{
                fontFamily: "Poppins-Medium, Helvetica",
                fontWeight: 500,
                color: "white",
                fontSize: "0.875rem",
                letterSpacing: "-0.18px",
                lineHeight: "20px",
                cursor: "pointer",
              }}
            >
              {item.label}
            </Typography>
          ))}
        </Stack>
        {/* Search Box */}
        <Box
          sx={{
            ml: "auto",
            mr: 2,
            width: 200,
            height: 50,
            position: "relative",
            backgroundColor: "#181B21",
            display: "flex",
            alignItems: "center",
            px: 2,
            borderRadius: "30px", // Added border radius to make it rounded
          }}
        >
          <SearchIcon sx={{ color: "white", mr: 1 }} />
          <Autocomplete
            freeSolo
            options={[]}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search Course"
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  style: {
                    fontFamily: "Poppins-Medium, Helvetica",
                    fontWeight: 500,
                    color: "white",
                    fontSize: "0.875rem",
                  },
                }}
              />
            )}
          />
        </Box>
        {/* Login and Register */}
        <Typography
          sx={{
            fontFamily: "Poppins-Medium, Helvetica",
            fontWeight: 500,
            color: "white",
            fontSize: "0.875rem",
            letterSpacing: "-0.18px",
            lineHeight: "20px",
            cursor: "pointer",
            mr: 2,
          }}
        >
          Log in
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#46c98b",
            borderRadius: "100px",
            width: 140,
            height: 50,
            fontFamily: "Poppins-Medium, Helvetica",
            fontWeight: 500,
            fontSize: "0.875rem",
            letterSpacing: "-0.18px",
            lineHeight: "20px",
            textTransform: "none",
            "&:hover": {
              bgcolor: "#3ab77a",
            },
          }}
        >
          Register
        </Button>
      </Toolbar>
      <Divider sx={{ bgcolor: "white", opacity: 0.2 }} />
    </AppBar>
  );
};

export default NavBarNew;
