import React from "react";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import bimManager from "../assets/bim-manager.jpeg";

const HeroSection = () => {
  return (
    <Box
      sx={{
        background: "#FAFAFC",
        color: "#000000",
        py: 8,
      }}
    >
      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Your Pathway to Becoming a BIM Expert Starts Here.
            </Typography>
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                NUMBER OF ACTIVE USERS RIGHT NOW
              </Typography>
              <Typography
                variant="h3"
                component="p"
                sx={{ fontWeight: "bold", color: "#4A3AFF" }}
              >
                200+
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#ccc",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={bimManager}
                alt="Hero"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
