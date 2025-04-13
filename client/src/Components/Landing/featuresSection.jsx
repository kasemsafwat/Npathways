import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";

// Icons
import SchoolIcon from "@mui/icons-material/School";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Certification from "/Certification.jpg";
import illustration from "../../assets/illustration.avif";
import BIM from "../../assets/BIM.jpg";

// Styled components
const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "24px",
  overflow: "hidden",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 30px rgba(0, 0, 0, 0.12)",
  },
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: 16,
  right: 16,
  zIndex: 2,
  fontWeight: 600,
  letterSpacing: "0.5px",
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(4px)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
}));

const FeaturesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const features = [
    {
      image: BIM,
      icon: <SchoolIcon />,
      title: "Comprehensive BIM Curriculum",
      description: "From BIM fundamentals to advanced management techniques",
      backgroundColor: "#DBEDF5",
      textColor: "#1D4645",
      chipLabel: "All Levels",
    },
    {
      image: illustration,
      icon: <AutoStoriesIcon />,
      title: "Practical Learning Experience",
      description:
        "Access expert-led tutorials, real-world case studies, and hands-on projects",
      backgroundColor: "#102F2E",
      textColor: "#FFFFFF",
      chipLabel: "Industry Standard",
    },
    {
      image: Certification,
      icon: <WorkspacePremiumIcon />,
      title: "Professional Certification",
      description:
        "Get certified and stand out in the competitive BIM industry",
      backgroundColor: "#FEF1E2",
      textColor: "#1D4645",
      chipLabel: "Job Ready",
    },
  ];

  // Animation variants for framer-motion
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
      sx={{ py: { xs: 6, md: 10 }, backgroundColor: "#F9F9F9" }}
      component="section"
      aria-labelledby="features-title"
    >
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {/* Section Label */}
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{
              backgroundColor: "#EEF7FD",
              py: 1.2,
              px: 3,
              mb: 4,
              textAlign: "center",
              maxWidth: "fit-content",
              mx: "auto",
              borderRadius: "100px",
              border: "1px solid #D1E9F7",
            }}
          >
            <Typography
              variant="subtitle1"
              component="span"
              sx={{
                color: "#0B162C",
                fontWeight: 600,
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <SchoolIcon fontSize="small" /> Features
            </Typography>
          </Box>

          {/* Section Heading */}
          <Typography
            id="features-title"
            variant="h2"
            align="center"
            sx={{
              mb: { xs: 2, md: 3 },
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.75rem" },
              background: "linear-gradient(to bottom, #0B162C, #1E3A8A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            component={motion.h2}
            variants={itemVariants}
          >
            Why Choose NPathways?
          </Typography>

          {/* Section Description */}
          <Typography
            variant="h6"
            component={motion.p}
            variants={itemVariants}
            align="center"
            sx={{
              mb: 6,
              color: "#5B5B5B",
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.6,
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.125rem" },
            }}
          >
            At NPathways, we don&apos;t just offer courses — we design your
            entire learning journey, guiding you from self-discovery to
            industry-ready expertise in digital construction.
          </Typography>

          {/* Feature Cards */}
          <Grid
            container
            spacing={{ xs: 3, md: 4 }}
            sx={{
              alignItems: "stretch",
              height: "auto",
            }}
          >
            {features.map((feature, index) => (
              <Grid
                item
                xs={12}
                md={4}
                key={index}
                component={motion.div}
                variants={itemVariants}
                sx={{
                  display: "flex",
                  height: "100%",
                }}
              >
                <FeatureCard
                  elevation={2}
                  sx={{
                    backgroundColor: feature.backgroundColor,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    maxHeight: { md: 480 },
                  }}
                >
                  {/* Feature Label Chip */}
                  <FeatureChip
                    label={feature.chipLabel}
                    variant="filled"
                    size="small"
                    icon={feature.icon}
                  />

                  {/* Feature Image */}
                  <CardMedia
                    component="img"
                    image={feature.image}
                    alt={feature.title}
                    sx={{
                      height: { xs: 220, md: 180, lg: 200 },
                      objectFit: "cover",
                      objectPosition: "center",
                      borderBottom: "4px solid rgba(255,255,255,0.2)",
                    }}
                  />

                  {/* Feature Content */}
                  <CardContent
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: { md: "240px" },
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{
                          color: feature.textColor,
                          fontWeight: 700,
                          mb: 1.5,
                          fontSize: { xs: "1.25rem", lg: "1.4rem" },
                          lineHeight: 1.3,
                        }}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          color: feature.textColor,
                          opacity:
                            feature.backgroundColor === "#102F2E" ? 0.9 : 0.8,
                          mb: { xs: 2, md: "auto" },
                          fontSize: { xs: "0.95rem", lg: "1rem" },
                          lineHeight: 1.5,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                    {/* <Box sx={{ textAlign: "right", mt: 2 }}>
                      <Tooltip title="Learn more">
                        <IconButton
                          aria-label={`Learn more about ${feature.title}`}
                          sx={{
                            color: feature.textColor,
                            backgroundColor: `${
                              feature.backgroundColor === "#102F2E"
                                ? "rgba(255,255,255,0.15)"
                                : "rgba(0,0,0,0.05)"
                            }`,
                            "&:hover": {
                              backgroundColor: `${
                                feature.backgroundColor === "#102F2E"
                                  ? "rgba(255,255,255,0.25)"
                                  : "rgba(0,0,0,0.1)"
                              }`,
                            },
                          }}
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                      </Tooltip>
                    </Box> */}
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
