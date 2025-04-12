import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Tooltip,
  Fade,
  useMediaQuery,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  Edit,
  Create,
  TrackChanges,
  Checklist,
  ArrowForward,
  CheckCircleOutline,
  School,
  AccountCircle,
} from "@mui/icons-material";
import welcome from "../../assets/Welcome.png";
import { AuthContext } from "../../contexts/AuthContext";
import { motion } from "framer-motion";

// Styled components
const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)",
  borderRadius: 30,
  border: 0,
  color: "white",
  height: 48,
  padding: "0 30px",
  boxShadow: "0 3px 5px 2px rgba(76, 175, 80, 0.3)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 10px 4px rgba(76, 175, 80, 0.2)",
    background: "linear-gradient(45deg, #1b5e20 30%, #388e3c 90%)",
  },
}));

const StepItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  transition: "all 0.3s ease-in-out",
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: theme.palette.background.default,
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.success.light,
  color: theme.palette.common.white,
  borderRadius: "50%",
  padding: theme.spacing(1),
  marginRight: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
  width: 45,
  height: 45,
}));

const HeroImage = styled("img")({
  width: "100%",
  height: "auto",
  objectFit: "contain",
  filter: "drop-shadow(0 10px 8px rgba(0,0,0,0.15))",
  transition: "transform 0.6s ease-in-out",
  "&:hover": {
    transform: "scale(1.03)",
  },
});

export default function WelcomeComponent() {
  const navigate = useNavigate();
  const { user, isLoading } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [hoveredStep, setHoveredStep] = useState(null);

  function handleStart() {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/enrollment/personal-details");
  }

  const enrollmentSteps = [
    {
      icon: <Edit />,
      title: "Personal Details",
      description:
        "Provide your personal information and educational background.",
    },
    {
      icon: <Create />,
      title: "Skills Assessment",
      description:
        "Take a short assessment to evaluate your current skill level.",
    },
    {
      icon: <TrackChanges />,
      title: "Learning Goals",
      description: "Define your learning objectives and career aspirations.",
    },
    {
      icon: <Checklist />,
      title: "Pathway Selection",
      description: "Get matched with the perfect learning path for your goals.",
    },
  ];

  // Animation variants for framer motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "70vh",
        }}
      >
        <CircularProgress color="success" size={60} thickness={5} />
        <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
          Loading enrollment information...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        background: "linear-gradient(to bottom, #ffffff, #f5f9f5)",
        minHeight: "100vh",
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {/* Header Section */}
          <Grid
            item
            xs={12}
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Box
              sx={{
                textAlign: "center",
                mb: { xs: 4, md: 6 },
              }}
              component={motion.div}
              variants={itemVariants}
            >
              <Typography
                component="h1"
                variant={isMobile ? "h4" : "h3"}
                fontWeight="800"
                sx={{
                  background: "linear-gradient(45deg, #1b5e20, #4caf50)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Begin Your Learning Journey
              </Typography>
              <Typography
                variant={isMobile ? "body1" : "h6"}
                color="text.secondary"
                sx={{
                  maxWidth: "700px",
                  mx: "auto",
                  mb: 3,
                }}
              >
                Complete the enrollment process to get a personalized learning
                pathway tailored to your goals and skills
              </Typography>
              <Divider
                sx={{
                  width: "80px",
                  mx: "auto",
                  borderColor: "success.main",
                  borderWidth: 2,
                  mb: 4,
                }}
              />
            </Box>
          </Grid>

          {/* Main Content */}
          <Grid container spacing={6} alignItems="center">
            {/* Left side: Steps */}
            <Grid
              item
              xs={12}
              md={6}
              order={{ xs: 2, md: 1 }}
              component={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 4 },
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.05)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                  }}
                  component={motion.div}
                  variants={itemVariants}
                >
                  <School
                    sx={{ color: "success.main", fontSize: 28, mr: 1.5 }}
                  />
                  <Typography variant="h5" fontWeight="600">
                    Enrollment Process
                  </Typography>
                </Box>

                <Box component={motion.div} variants={itemVariants}>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Follow these four simple steps to complete your enrollment
                    and begin your personalized learning journey.
                  </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                  {enrollmentSteps.map((step, index) => (
                    <StepItem
                      key={index}
                      component={motion.div}
                      variants={itemVariants}
                      onMouseEnter={() => setHoveredStep(index)}
                      onMouseLeave={() => setHoveredStep(null)}
                      sx={{
                        mb: 2,
                        border: "1px solid",
                        borderColor:
                          hoveredStep === index ? "success.main" : "divider",
                      }}
                    >
                      <IconWrapper>{step.icon}</IconWrapper>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="600"
                          sx={{ mb: 0.5 }}
                        >
                          {step.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {step.description}
                        </Typography>
                      </Box>
                      <Fade in={hoveredStep === index}>
                        <Box
                          sx={{
                            ml: "auto",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="success.main"
                            sx={{ mr: 1, fontWeight: 500 }}
                          >
                            Step {index + 1}
                          </Typography>
                        </Box>
                      </Fade>
                    </StepItem>
                  ))}
                </Box>

                <Box
                  mt={4}
                  display="flex"
                  justifyContent="center"
                  component={motion.div}
                  variants={itemVariants}
                >
                  <Tooltip
                    title={
                      !user ? "Sign in to continue" : "Start your application"
                    }
                    arrow
                    placement="top"
                  >
                    <GradientButton
                      variant="contained"
                      onClick={handleStart}
                      endIcon={<ArrowForward />}
                      aria-label="Start enrollment application"
                      size="large"
                      fullWidth
                    >
                      {!user ? "Sign In to Begin" : "Begin Enrollment"}
                    </GradientButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>

            {/* Right side: Image */}
            <Grid
              item
              xs={12}
              md={6}
              order={{ xs: 1, md: 2 }}
              component={motion.div}
              variants={itemVariants}
            >
              <Box
                sx={{
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HeroImage
                  src={welcome}
                  alt="Student enrollment journey illustration"
                  loading="lazy"
                />

                {/* Decorative elements */}
                <Box
                  sx={{
                    position: "absolute",
                    width: "180px",
                    height: "180px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0) 70%)",
                    top: "10%",
                    left: "5%",
                    zIndex: -1,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    border: "2px dashed rgba(76, 175, 80, 0.2)",
                    bottom: "15%",
                    right: "10%",
                    zIndex: -1,
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Benefits Section */}
          <Grid
            item
            xs={12}
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ mt: { xs: 4, md: 8 } }}
          >
            <Box
              sx={{
                textAlign: "center",
                mb: 4,
              }}
              component={motion.div}
              variants={itemVariants}
            >
              <Typography variant="h5" fontWeight="600" gutterBottom>
                Why Enroll With Us?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Discover the benefits of our personalized learning approach
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {[
                {
                  icon: <AccountCircle sx={{ fontSize: 40 }} />,
                  title: "Personalized Learning",
                  description:
                    "Curriculum tailored to your specific needs and career goals",
                },
                {
                  icon: <School sx={{ fontSize: 40 }} />,
                  title: "Industry Recognition",
                  description:
                    "Earn credentials valued by top employers in the field",
                },
                {
                  icon: <CheckCircleOutline sx={{ fontSize: 40 }} />,
                  title: "Expert Support",
                  description:
                    "Access to mentors and industry professionals throughout your journey",
                },
              ].map((benefit, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    component={motion.div}
                    variants={itemVariants}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                      <Box
                        sx={{
                          color: "success.main",
                          mb: 2,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {benefit.icon}
                      </Box>
                      <Typography variant="h6" fontWeight="600" gutterBottom>
                        {benefit.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {benefit.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
