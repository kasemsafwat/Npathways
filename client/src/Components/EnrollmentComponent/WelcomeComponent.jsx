import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Container, Grid, Box } from "@mui/material";
import { Edit, Create, TrackChanges, Checklist } from "@mui/icons-material";
import welcome from "../../assets/Welcome.png";
import { AuthContext } from "../../contexts/AuthContext";
export default function WelcomeComponent() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  function handleStart() {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/enrollment/personal-details");
  }
  return (
    <Box sx={{ bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Container sx={{ mt: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography
            fontWeight="bold"
            gutterBottom
            sx={{
              fontSize: {
                xs: "1.2rem",
                sm: "1.5rem",
                md: "2rem",
                lg: "2.5rem",
                xl: "3rem",
              },
            }}
          >
            Welcome to the enrollment course
          </Typography>
        </Box>
        <Typography variant="body1" color="gray" gutterBottom>
          Follow these simple steps to complete your enrollment steps
        </Typography>

        <Grid container spacing={4} justifyContent="flex-start">
          <Grid
            item
            size={{ xs: 12, sm: 12, md: 6 }}
            md={6}
            order={{ xs: 1, md: 2 }}
            display="flex"
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            <img
              src={welcome}
              alt="Student Enrollment"
              style={{
                width: "100%",
              }}
              sx={{
                width: "100%",
                maxWidth: { xs: "400px", sm: "400px", md: "none", lg: "none" },
                height: "auto",
              }}
            />
          </Grid>
          <Grid
            item
            size={{ xs: 12, sm: 12, md: 6 }}
            md={6}
            order={{ xs: 2, md: 1 }}
          >
            <Box
              sx={{
                mt: { xs: 0, md: 3 },
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 3,
              }}
            >
              <Box display="flex" alignItems="center" width="100%">
                <Edit sx={{ color: "green", mr: 2 }} />
                <Typography variant="h6" textAlign="left">
                  Enrollment Test
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" width="100%">
                <Create sx={{ color: "green", mr: 2 }} />
                <Typography variant="h6" textAlign="left">
                  Motivation
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" width="100%">
                <TrackChanges sx={{ color: "green", mr: 2 }} />
                <Typography variant="h6" textAlign="left">
                  Expectation
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" width="100%">
                <Checklist sx={{ color: "green", mr: 2 }} />
                <Typography variant="h6" textAlign="left">
                  Evaluations
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="success"
                sx={{ mb: 2, alignSelf: "flex-start" }}
                onClick={handleStart}
              >
                Start Application
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
