import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepConnector,
  stepConnectorClasses,
  useTheme,
  useMediaQuery,
  Divider,
  Collapse,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  alpha,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Icons
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

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

const GhostButton = styled(Button)(({ theme }) => ({
  border: "2px solid rgba(70, 201, 139, 0.5)",
  color: "#46c98b",
  fontWeight: 600,
  padding: "10px 24px",
  borderRadius: "100px",
  textTransform: "none",
  fontSize: "1rem",
  backgroundColor: "transparent",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(70, 201, 139, 0.1)",
    borderColor: "#46c98b",
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(70, 201, 139, 0.15)",
  },
}));

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient(95deg, #46c98b 0%, #34a977 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient(95deg, #46c98b 0%, #34a977 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.3s ease",
  ...(ownerState.active && {
    backgroundImage: "linear-gradient(136deg, #46c98b 0%, #34a977 100%)",
    boxShadow: "0 4px 10px 0 rgba(70, 201, 139, 0.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage: "linear-gradient(136deg, #46c98b 0%, #34a977 100%)",
  }),
}));

// Step icon component
function ColorlibStepIcon(props) {
  const { active, completed, className } = props;
  const icons = {
    1: <AssessmentOutlinedIcon />,
    2: <SettingsSuggestOutlinedIcon />,
    3: <SchoolOutlinedIcon />,
    4: <WorkOutlineOutlinedIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

function FAQItem({ question, answer }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper
      elevation={1}
      sx={{
        mb: 2,
        borderRadius: 2,
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          bgcolor: expanded ? "rgba(70, 201, 139, 0.05)" : "white",
          borderLeft: expanded ? "4px solid #46c98b" : "4px solid transparent",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography
          variant="h6"
          sx={{ fontSize: { xs: "1rem", md: "1.125rem" }, fontWeight: 600 }}
        >
          {question}
        </Typography>
        <IconButton
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse" : "Expand"}
          size="small"
          sx={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>
      <Collapse in={expanded} timeout="auto">
        <Box sx={{ p: 2.5, pt: 0, pl: 3.5 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {answer}
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  );
}

// Testimonial Blob
const TestimonialBlob = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(3),
  borderRadius: "20px",
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
  "&:before": {
    content: '""',
    position: "absolute",
    width: "20px",
    height: "20px",
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    borderRight: "none",
    borderTop: "none",
    bottom: "-10px",
    left: "30px",
    transform: "rotate(-45deg)",
  },
}));

const HowItWorks = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [activeStep, setActiveStep] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const steps = [
    {
      label: "Assessment & Goal Setting",
      description: `Begin with our comprehensive assessment to identify your current skills, knowledge gaps, and career goals. This personalized evaluation helps us understand your unique learning needs.`,
      details: [
        "Evaluate current skills and experience",
        "Define career goals and aspirations",
        "Identify learning style preferences",
        "Set clear, measurable objectives",
      ],
      icon: <AssessmentOutlinedIcon />,
      image: "/129976057-employee-assessment-concept-vector-illustration.jpg", // Replace with your image
    },
    {
      label: "Customized Learning Path",
      description: `Based on your assessment results, we create a tailored learning journey exclusively for you. This pathway optimizes your learning experience by focusing on what you need most.`,
      details: [
        "AI-powered personalized curriculum",
        "Industry-aligned skill development",
        "Adaptive learning sequences",
        "Progress tracking dashboard",
      ],
      icon: <SettingsSuggestOutlinedIcon />,
      image: "/learning-path-illustration.jpg", // Replace with your image
    },
    {
      label: "Interactive Learning",
      description: `Engage with our expert-led courses combining theory and practical application. Learn through interactive content, real-world projects, and industry-standard tools.`,
      details: [
        "Expert-led video instruction",
        "Hands-on project work",
        "Live coaching sessions",
        "Peer collaboration opportunities",
      ],
      icon: <SchoolOutlinedIcon />,
      image: "/10119538.webp", // Replace with your image
    },
    {
      label: "Certification & Career Support",
      description: `Complete your learning path to earn an industry-recognized certification. Get ongoing career support, including job placement assistance and professional networking.`,
      details: [
        "Industry-recognized credentials",
        "Portfolio development guidance",
        "Career counseling sessions",
        "Employer introductions and referrals",
      ],
      icon: <WorkOutlineOutlinedIcon />,
      image: "/10130723.webp", // Replace with your image
    },
  ];

  const faqs = [
    {
      question: "How long does it take to complete a learning pathway?",
      answer:
        "Learning pathways are self-paced and vary in length depending on your existing skills, available time, and learning goals. Typically, a comprehensive pathway can be completed in 3-6 months with 8-10 hours per week of study. However, we offer accelerated options for those with more time to dedicate and extended timeframes for those balancing busy schedules.",
    },
    {
      question: "Are the certifications recognized in the industry?",
      answer:
        "Yes, our certifications are developed in partnership with industry leaders and aligned with current BIM standards and practices. Our credentials are recognized by major employers in architecture, engineering, construction, and facility management. Many of our graduates have successfully secured positions at leading firms worldwide.",
    },
    {
      question: "Do I need any prior experience to start?",
      answer:
        "No prior experience is required. Our assessment process identifies your current knowledge level, and we tailor the learning path accordingly. Complete beginners will start with foundational concepts, while those with some experience can skip ahead to more advanced topics. Each pathway accommodates different starting points.",
    },
    {
      question:
        "What kind of support will I receive during my learning journey?",
      answer:
        "Throughout your learning journey, you'll have access to a variety of support resources including dedicated mentors, 24/7 technical support, regular progress check-ins, and a community forum of peers and industry professionals. We also offer live Q&A sessions with instructors and one-on-one coaching for personalized guidance.",
    },
    {
      question: "Can I switch between learning pathways?",
      answer:
        "Yes, you can adjust your learning path as your goals evolve. Our advisors will work with you to modify your curriculum while ensuring you maintain progress toward meaningful certification. This flexibility allows you to adapt as you discover new interests or career opportunities within the BIM field.",
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Animation variants
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
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0B162C 0%, #1E3A8A 100%)",
          pt: { xs: 10, md: 16 },
          pb: { xs: 8, md: 12 },
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
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
            top: "-200px",
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
            bottom: "10%",
            left: "5%",
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={5} alignItems="center">
            <Grid
              item
              xs={12}
              md={6}
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  component="span"
                  sx={{
                    bgcolor: "rgba(70, 201, 139, 0.2)",
                    color: "#46c98b",
                    py: 1,
                    px: 2.5,
                    borderRadius: "100px",
                    display: "inline-block",
                    mb: 3,
                    fontWeight: 600,
                  }}
                >
                  NPathways Learning System
                </Typography>

                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "2.2rem", md: "3.5rem" },
                    mb: 3,
                    background:
                      "linear-gradient(90deg, #ffffff 0%, #e0e0e0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: 1.1,
                  }}
                >
                  Your{" "}
                  <Box
                    component="span"
                    sx={{ color: "#46c98b", WebkitTextFillColor: "#46c98b" }}
                  >
                    Personalized
                  </Box>{" "}
                  Path to BIM Excellence
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontWeight: 400,
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    lineHeight: 1.6,
                    maxWidth: "90%",
                  }}
                >
                  Discover how our unique four-step approach transforms
                  beginners into industry-ready BIM professionals through
                  personalized learning journeys tailored to your goals and
                  learning style.
                </Typography>

                <Box
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
                    Start Your Journey
                  </GradientButton>

                  <Button
                    variant="text"
                    sx={{
                      color: "white",
                      borderRadius: "100px",
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                    onClick={() => {
                      const element = document.getElementById(
                        "how-it-works-process"
                      );
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    startIcon={<PlayCircleOutlineIcon />}
                  >
                    View Process
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                }}
              >
                {isVideoLoading && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(0,0,0,0.3)",
                      zIndex: 1,
                    }}
                  >
                    <CircularProgress sx={{ color: "#46c98b" }} />
                  </Box>
                )}
                <Box
                  component="iframe"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="How NPathways Works"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    borderRadius: 4,
                  }}
                  onLoad={() => setIsVideoLoading(false)}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Process Section */}
      <Box
        id="how-it-works-process"
        sx={{
          py: { xs: 6, md: 12 },
          backgroundColor: "#F8F9FA",
        }}
        component="section"
        aria-labelledby="process-title"
      >
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {/* Section Header */}
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography
                component={motion.span}
                variants={itemVariants}
                sx={{
                  bgcolor: "#EEF7FD",
                  color: "#0B162C",
                  py: 1,
                  px: 3,
                  borderRadius: "100px",
                  display: "inline-block",
                  mb: 2,
                  fontWeight: 600,
                  border: "1px solid #D1E9F7",
                }}
              >
                The NPathways Process
              </Typography>

              <Typography
                id="process-title"
                variant="h2"
                component={motion.h2}
                variants={itemVariants}
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2rem", md: "2.75rem" },
                  color: "#0B162C",
                  mb: 2,
                }}
              >
                Our 4-Step Learning Approach
              </Typography>

              <Typography
                variant="h6"
                component={motion.p}
                variants={itemVariants}
                sx={{
                  color: "#5B5B5B",
                  maxWidth: "800px",
                  mx: "auto",
                  mb: 6,
                  fontWeight: 400,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                }}
              >
                We've developed a proven methodology to guide you from wherever
                you are now to becoming a qualified BIM professional through
                personalized learning experiences.
              </Typography>
            </Box>

            {/* Process Steps - Desktop View */}
            {!isMobile && (
              <Grid
                container
                spacing={5}
                alignItems="center"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Grid item xs={12} md={6}>
                  <Stepper
                    activeStep={activeStep}
                    orientation="vertical"
                    connector={<ColorlibConnector />}
                    sx={{ ml: 2 }}
                  >
                    {steps.map((step, index) => (
                      <Step key={step.label}>
                        <StepLabel
                          StepIconComponent={ColorlibStepIcon}
                          sx={{ cursor: "pointer" }}
                          onClick={() => setActiveStep(index)}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              transition: "all 0.3s ease",
                              color:
                                activeStep === index
                                  ? "#0B162C"
                                  : "text.secondary",
                            }}
                          >
                            {step.label}
                          </Typography>
                        </StepLabel>
                        <StepContent sx={{ ml: 2, pb: 3 }}>
                          <Typography
                            sx={{
                              mb: 3,
                              color: "text.secondary",
                              fontSize: "1rem",
                              maxWidth: "90%",
                            }}
                          >
                            {step.description}
                          </Typography>

                          <Box sx={{ mb: 3 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, mb: 1.5 }}
                            >
                              Key Features:
                            </Typography>
                            <List dense disablePadding sx={{ ml: 1 }}>
                              {step.details.map((detail, i) => (
                                <ListItem
                                  key={i}
                                  disableGutters
                                  disablePadding
                                  sx={{ pb: 0.5 }}
                                >
                                  <ListItemIcon sx={{ minWidth: 28 }}>
                                    <CheckCircleIcon
                                      sx={{ color: "#46c98b", fontSize: 16 }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText primary={detail} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>

                          <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                            <Button
                              disabled={activeStep === 0}
                              onClick={handleBack}
                              startIcon={<ArrowBackIcon />}
                              sx={{
                                textTransform: "none",
                                color: "#5B5B5B",
                              }}
                            >
                              Back
                            </Button>
                            {activeStep === steps.length - 1 ? (
                              <GradientButton
                                component={Link}
                                to="/enrollment/welcome"
                                endIcon={<ArrowForwardIcon />}
                              >
                                Start Now
                              </GradientButton>
                            ) : (
                              <Button
                                variant="contained"
                                onClick={handleNext}
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                  bgcolor: "#0B162C",
                                  "&:hover": {
                                    bgcolor: "#162a4a",
                                  },
                                  textTransform: "none",
                                }}
                              >
                                Next Step
                              </Button>
                            )}
                          </Box>
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={6}
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      p: 0,
                      borderRadius: 4,
                      overflow: "hidden",
                      height: "100%",
                      minHeight: 400,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        steps[activeStep].image ||
                        "/placeholder-illustration.svg"
                      }
                      alt={steps[activeStep].label}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* Process Steps - Mobile View */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              {steps.map((step, index) => (
                <Card
                  key={index}
                  component={motion.div}
                  variants={itemVariants}
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    border:
                      index === activeStep
                        ? "2px solid #46c98b"
                        : "2px solid transparent",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      cursor: "pointer",
                      bgcolor:
                        index === activeStep
                          ? "rgba(70, 201, 139, 0.05)"
                          : "white",
                    }}
                    onClick={() => setActiveStep(index)}
                    aria-expanded={index === activeStep}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                        backgroundImage:
                          index === activeStep
                            ? "linear-gradient(136deg, #46c98b 0%, #34a977 100%)"
                            : "none",
                        bgcolor:
                          index === activeStep ? "transparent" : "#eaeaea",
                        color: "white",
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, fontSize: "1rem" }}
                    >
                      {step.label}
                    </Typography>
                    <IconButton
                      sx={{
                        ml: "auto",
                        transform:
                          index === activeStep
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Box>

                  <Collapse in={index === activeStep}>
                    <CardContent>
                      <Typography
                        sx={{
                          mb: 2,
                          color: "text.secondary",
                        }}
                      >
                        {step.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          Key Features:
                        </Typography>
                        {step.details.map((detail, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              mb: 1,
                              alignItems: "center",
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ color: "#46c98b", fontSize: 16, mr: 1 }}
                            />
                            <Typography variant="body2">{detail}</Typography>
                          </Box>
                        ))}
                      </Box>

                      <Box
                        component="img"
                        src={step.image || "/placeholder-illustration.svg"}
                        alt={step.label}
                        sx={{
                          width: "100%",
                          borderRadius: 2,
                          mb: 2,
                          maxHeight: 180,
                          objectFit: "cover",
                        }}
                      />

                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          disabled={index === 0}
                          onClick={() => setActiveStep(index - 1)}
                          startIcon={<ArrowBackIcon />}
                          sx={{
                            textTransform: "none",
                          }}
                        >
                          Back
                        </Button>
                        {index === steps.length - 1 ? (
                          <GradientButton
                            component={Link}
                            to="/enrollment/welcome"
                            size="small"
                            endIcon={<ArrowForwardIcon />}
                          >
                            Start Now
                          </GradientButton>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => setActiveStep(index + 1)}
                            endIcon={<ArrowForwardIcon />}
                            size="small"
                            sx={{
                              bgcolor: "#0B162C",
                              "&:hover": {
                                bgcolor: "#162a4a",
                              },
                              textTransform: "none",
                            }}
                          >
                            Next
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Collapse>
                </Card>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          backgroundColor: "white",
        }}
        component="section"
        aria-labelledby="benefits-title"
      >
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {/* Section Header */}
            <Box
              sx={{ textAlign: "center", mb: 6 }}
              component={motion.div}
              variants={itemVariants}
            >
              <Typography
                id="benefits-title"
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2rem", md: "2.75rem" },
                  color: "#0B162C",
                  mb: 2,
                }}
              >
                The NPathways Difference
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#5B5B5B",
                  maxWidth: "800px",
                  mx: "auto",
                  fontWeight: 400,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                }}
              >
                What sets our learning approach apart from traditional training
                programs
              </Typography>
            </Box>

            {/* Benefits Grid */}
            <Grid container spacing={4}>
              {[
                {
                  icon: <SettingsSuggestOutlinedIcon sx={{ fontSize: 36 }} />,
                  title: "Personalized Learning",
                  description:
                    "Your path is uniquely tailored to your existing skills, learning pace, and career goals - not a generic one-size-fits-all approach.",
                },
                {
                  icon: <PeopleOutlineIcon sx={{ fontSize: 36 }} />,
                  title: "Expert Mentorship",
                  description:
                    "Learn directly from industry professionals with real-world BIM experience who provide guidance throughout your learning journey.",
                },
                {
                  icon: <PlayCircleOutlineIcon sx={{ fontSize: 36 }} />,
                  title: "Practical Application",
                  description:
                    "Theory is seamlessly integrated with hands-on projects using the exact tools and workflows used in professional settings.",
                },
                {
                  icon: <HelpOutlineIcon sx={{ fontSize: 36 }} />,
                  title: "Ongoing Support",
                  description:
                    "Receive dedicated assistance even after certification, including career coaching and professional networking opportunities.",
                },
              ].map((benefit, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={index}
                  component={motion.div}
                  variants={itemVariants}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      p: 3,
                      transition: "all 0.3s ease",
                      border: "1px solid #eaeaea",
                      "&:hover": {
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        borderColor: "transparent",
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        background:
                          "linear-gradient(135deg, #EEF7FD 0%, #D1E9F7 100%)",
                        color: "#0B162C",
                      }}
                    >
                      {benefit.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
                      {benefit.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {benefit.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Success Story */}
            <Box
              component={motion.div}
              variants={itemVariants}
              sx={{
                mt: 8,
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                background: "linear-gradient(135deg, #0B162C 0%, #1E3A8A 100%)",
                color: "white",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: "300px",
                  height: "300px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(70, 201, 139, 0.2) 0%, rgba(70, 201, 139, 0) 70%)",
                  top: "-150px",
                  right: "-100px",
                }}
              />

              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={7}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.75rem", md: "2.25rem" },
                      mb: 2,
                    }}
                  >
                    Success Story: From Novice to BIM Specialist in 6 Months
                  </Typography>

                  <Typography sx={{ mb: 3, opacity: 0.9 }}>
                    "Before NPathways, I had no BIM experience and struggled to
                    break into the industry. The personalized learning approach
                    identified my strengths in spatial reasoning and previous
                    CAD experience, creating a pathway that built on these
                    skills while filling knowledge gaps.
                  </Typography>

                  <Typography sx={{ mb: 3, opacity: 0.9 }}>
                    The hands-on projects gave me practical experience that I
                    could immediately show potential employers. Six months after
                    starting, I secured a position as a BIM Coordinator at a
                    leading architectural firm, with a salary 35% higher than my
                    previous role."
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
                    <Avatar
                      src="/testimonial-avatar.jpg" // Replace with actual image
                      sx={{ width: 56, height: 56, mr: 2 }}
                      alt="Michael Chen"
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Michael Chen
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        BIM Coordinator, Foster + Partners
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={5}>
                  <TestimonialBlob>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 2, color: "text.white" }}
                    >
                      Michael's Learning Stats:
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.white">
                          Starting Level
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#0B162C" }}
                        >
                          Complete Beginner
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.white">
                          Completion Time
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#0B162C" }}
                        >
                          6 Months
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.white">
                          Weekly Study Hours
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#0B162C" }}
                        >
                          12-15 Hours
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.white">
                          Salary Increase
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#46c98b" }}
                        >
                          +35%
                        </Typography>
                      </Grid>
                    </Grid>
                  </TestimonialBlob>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          backgroundColor: "#F8F9FA",
        }}
        component="section"
        aria-labelledby="faqs-title"
      >
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <Box
              sx={{ textAlign: "center", mb: 6 }}
              component={motion.div}
              variants={itemVariants}
            >
              <Typography
                id="faqs-title"
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2rem", md: "2.75rem" },
                  color: "#0B162C",
                  mb: 2,
                }}
              >
                Frequently Asked Questions
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#5B5B5B",
                  maxWidth: "800px",
                  mx: "auto",
                  fontWeight: 400,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                }}
              >
                Get answers to common questions about our learning approach
              </Typography>
            </Box>

            <Box component={motion.div} variants={itemVariants}>
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: "white",
        }}
        component="section"
      >
        <Container maxWidth="md">
          <Box
            component={motion.div}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            sx={{
              textAlign: "center",
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              border: "2px solid #eaeaea",
              backgroundColor: "white",
              boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                mb: 3,
                color: "#0B162C",
              }}
            >
              Ready to Start Your BIM Journey?
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "#5B5B5B",
                maxWidth: "700px",
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.125rem" },
              }}
            >
              Take the first step toward becoming a BIM professional with our
              personalized learning pathways. Begin with a free skills
              assessment to map out your unique journey.
            </Typography>

            <GradientButton
              component={Link}
              to="/enrollment/welcome"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              Start Free Assessment
            </GradientButton>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HowItWorks;
