import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Link } from "react-router-dom";

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(to right, #46c98b, #3AB07A)",
  color: "white",
  fontWeight: 600,
  padding: "12px 24px",
  borderRadius: "100px",
  textTransform: "none",
  fontSize: "1rem",
  boxShadow: "0 10px 20px rgba(70, 201, 139, 0.25)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(to right, #3AB07A, #2d9d6c)",
    transform: "translateY(-4px)",
    boxShadow: "0 15px 25px rgba(70, 201, 139, 0.35)",
  },
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  border: "2px solid rgba(255,255,255,0.8)",
  color: "white",
  fontWeight: 500,
  padding: "11px 24px",
  borderRadius: "100px",
  textTransform: "none",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  backgroundColor: "rgba(255,255,255,0.05)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "white",
    transform: "translateY(-4px)",
  },
}));

const CTASection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(135deg, #0B162C 0%, #1E3A8A 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
      component="section"
      aria-labelledby="cta-title"
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(70, 201, 139, 0.2) 0%, rgba(70, 201, 139, 0) 70%)",
          bottom: "-200px",
          right: "-100px",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.05)",
          top: "10%",
          left: "5%",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid
            item
            xs={12}
            md={7}
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                id="cta-title"
                component={motion.h2}
                variants={itemVariants}
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2rem", md: "3rem" },
                  mb: 2,
                }}
              >
                Start Your BIM Career Journey Today
              </Typography>

              <Typography
                component={motion.p}
                variants={itemVariants}
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: "600px",
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  lineHeight: 1.6,
                }}
              >
                Take your first step toward becoming a BIM professional. Our
                personalized learning paths guide you from beginner to expert
                with industry-recognized certification.
              </Typography>

              <Box
                component={motion.div}
                variants={itemVariants}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  mt: 3,
                }}
              >
                <GradientButton
                  component={Link}
                  to="/enrollment/welcome"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                >
                  Start Free Assessment
                </GradientButton>

                <OutlinedButton
                  component={Link}
                  to="/how-it-works" // Updated to link to our new page
                  startIcon={<PlayCircleOutlineIcon />}
                  size="large"
                >
                  How It Works
                </OutlinedButton>
              </Box>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={5}
            component={motion.div}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Paper
              elevation={8}
              sx={{
                p: 3,
                borderRadius: 4,
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 600, color: "#46c98b" }}
                  >
                    Join thousands of successful BIM professionals
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{ opacity: 0.7, mb: 1 }}
                      color="white"
                    >
                      Course Completion Rate
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700 }}
                      color="#46c98b"
                    >
                      94%
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{ opacity: 0.7, mb: 1 }}
                      color="white"
                    >
                      Average Salary Increase
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700 }}
                      color="#46c98b"
                    >
                      37%
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "rgba(70, 201, 139, 0.1)",
                      border: "1px solid rgba(70, 201, 139, 0.2)",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      "I had no BIM experience when I started. Within 6 months
                      of completing my NPathways certification, I landed a
                      junior BIM coordinator role that changed my career
                      trajectory."
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ mt: 1, opacity: 0.9, fontWeight: 600 }}
                    >
                      — David M., BIM Coordinator
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CTASection;
