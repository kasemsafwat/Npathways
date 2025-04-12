import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

// Icons
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TimelineIcon from "@mui/icons-material/Timeline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import ReplayIcon from "@mui/icons-material/Replay";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Custom styled components
const ResultPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  overflow: "hidden",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const ScoreCircle = styled(Box)(({ theme, score }) => {
  // Color based on score
  let color;
  if (score >= 80) color = theme.palette.success.main;
  else if (score >= 70) color = theme.palette.success.light;
  else if (score >= 60) color = theme.palette.warning.main;
  else color = theme.palette.error.main;

  return {
    position: "relative",
    width: 160,
    height: 160,
    borderRadius: "50%",
    background: `conic-gradient(
      ${color} ${score}%,
      #e0e0e0 ${score}%
    )`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    "&:after": {
      content: "''",
      position: "absolute",
      width: "80%",
      height: "80%",
      borderRadius: "50%",
      background: "#fff",
    },
    [theme.breakpoints.down("sm")]: {
      width: 130,
      height: 130,
    },
  };
});

const FinishedExam = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
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

  // Sample/mock data for the exam result
  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      // Mock exam result data
      setResult({
        score: 80,
        passed: true,
        totalQuestions: location.state?.totalQuestions || 10,
        answeredQuestions: location.state?.answeredQuestions || 10,
        correctAnswers: 8,
        incorrectAnswers: 2,
        examDuration: "28 minutes",
        feedbackSummary:
          "Great job! You demonstrated a solid understanding of BIM fundamentals.",
        strengths: [
          "BIM terminology and definitions",
          "Level 2 BIM understanding",
          "BIM implementation benefits",
        ],
        improvementAreas: [
          "IFC standards and interoperability",
          "BIM dimensions beyond 4D and 5D",
        ],
        certificateId: "BIM-FUND-2023-42789",
        nextSteps: {
          recommendedCourses: [
            {
              id: "c001",
              title: "Advanced BIM Project Management",
              level: "Intermediate",
            },
            {
              id: "c002",
              title: "BIM Data Management and Exchange",
              level: "Intermediate",
            },
          ],
        },
      });
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Processing your results...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header with result summary */}
        <Box
          component={motion.div}
          variants={itemVariants}
          sx={{
            textAlign: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Exam Completed
          </Typography>

          <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
            Here are your assessment results
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <ScoreCircle score={result.score}>
              <Box
                sx={{
                  position: "relative",
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={
                    result.score >= 70
                      ? "success.main"
                      : result.score >= 60
                      ? "warning.main"
                      : "error.main"
                  }
                >
                  {result.score}%
                </Typography>
              </Box>
            </ScoreCircle>

            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: result.passed ? "success.main" : "error.main",
                }}
              >
                {result.passed
                  ? "Congratulations! You passed!"
                  : "You didn't pass this time"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {result.feedbackSummary}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main content with detailed results */}
        <Grid container spacing={4}>
          {/* Left column - Performance Results */}
          <Grid
            item
            xs={12}
            md={8}
            component={motion.div}
            variants={itemVariants}
          >
            <ResultPaper>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                Performance Results
              </Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {result.totalQuestions}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Correct
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {result.correctAnswers}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Incorrect
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="error.main"
                    >
                      {result.incorrectAnswers}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Time Taken
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {result.examDuration}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Strengths
                  </Typography>
                  <List dense disablePadding>
                    {result.strengths.map((strength, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleOutlineIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={strength} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Areas for Improvement
                  </Typography>
                  <List dense disablePadding>
                    {result.improvementAreas.map((area, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <TrendingUpIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={area} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>

              {/* Certificate info for passing scores */}
              {result.passed && (
                <React.Fragment>
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EmojiEventsIcon
                      sx={{ color: "warning.main", fontSize: 28, mr: 1 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Certification
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      border: "1px dashed",
                      borderColor: "divider",
                      borderRadius: 1,
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "flex-start", sm: "center" },
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2">
                        Certificate ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {result.certificateId}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      sx={{ mt: { xs: 2, sm: 0 } }}
                    >
                      View Certificate
                    </Button>
                  </Box>
                </React.Fragment>
              )}
            </ResultPaper>

            {/* Recommended courses based on results */}
            <Box component={motion.div} variants={itemVariants} sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                Recommended Next Steps
              </Typography>

              <Grid container spacing={3}>
                {result.nextSteps.recommendedCourses.map((course) => (
                  <Grid item xs={12} sm={6} key={course.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Chip
                          label={course.level}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                        <Typography
                          variant="h6"
                          sx={{ mb: 1, fontWeight: 600 }}
                        >
                          {course.title}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            component={RouterLink}
                            to={`/coursedetails/${course.id}`}
                            fullWidth
                          >
                            Learn More
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Right column - Action buttons and summary */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: { md: "sticky" }, top: 20 }}>
              {/* Actions */}
              <Box
                component={motion.div}
                variants={itemVariants}
                sx={{ mb: 4 }}
              >
                <ResultPaper>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Next Steps
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {result.passed ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        component={RouterLink}
                        to="/student/mypathway"
                        startIcon={<TimelineIcon />}
                      >
                        View Learning Path
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={() => window.location.reload()}
                        startIcon={<ReplayIcon />}
                      >
                        Retry Exam
                      </Button>
                    )}

                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      fullWidth
                      component={RouterLink}
                      to="/courses"
                      startIcon={<SchoolIcon />}
                    >
                      Browse Courses
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      component={RouterLink}
                      to="/"
                      startIcon={<HomeIcon />}
                    >
                      Back to Home
                    </Button>
                  </Box>
                </ResultPaper>
              </Box>

              {/* Performance insights card */}
              <Box component={motion.div} variants={itemVariants}>
                <ResultPaper
                  sx={{
                    background:
                      "linear-gradient(135deg, #0B162C 0%, #1E3A8A 100%)",
                    color: "white",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Performance Insights
                  </Typography>

                  <Typography variant="body2" paragraph sx={{ opacity: 0.9 }}>
                    Your performance shows{" "}
                    {result.score >= 80
                      ? "excellent understanding"
                      : result.score >= 70
                      ? "good understanding"
                      : "basic understanding"}{" "}
                    of BIM fundamentals.
                  </Typography>

                  {result.passed ? (
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      We recommend continuing with the suggested courses to
                      build on your knowledge and develop advanced BIM skills.
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      We recommend reviewing the areas for improvement before
                      retaking the exam. Focus on the specific topics where you
                      had difficulties.
                    </Typography>
                  )}
                </ResultPaper>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default FinishedExam;
