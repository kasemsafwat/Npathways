import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import bimManager from "../../assets/landing.jpg";

const NewHeroSection = () => {
  return (
    <Box sx={{ bgcolor: "#0A152B", height: "80vh", width: "100%" }}>
      <Container maxWidth="xl" sx={{ height: "100%", position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            py: 3,
          }}
        >
          {/* Left Content */}
          <Box sx={{ maxWidth: 580, mt: { xs: 2, md: 0 } }}>
            <Typography
              variant="h1"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                color: "white",
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              Unlock Your Digital Construction Career with NPathways! 🚀
            </Typography>

            <Box sx={{ display: "flex", mt: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  color: "white",
                  maxWidth: 481,
                  mb: 3,
                }}
              >
                Take the enrollment test, discover your perfect learning path,
                and gain expert-level skills through tailored courses. Start
                your journey today!
              </Typography>
            </Box>

            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "#46C98B",
                borderRadius: "100px",
                px: 3,
                py: 1,
                mt: 1,
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "#3AB07A",
                },
              }}
            >
              Enroll Now
            </Button>
          </Box>

          {/* Right Content - Image Placeholder */}
          <Box
            sx={{
              width: { xs: "100%", md: 450 },
              height: { xs: 250, md: 350 },
              mt: { xs: 3, md: 0 },
            }}
          >
            <img
              src={bimManager}
              alt="BIM Manager"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "30px",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NewHeroSection;
