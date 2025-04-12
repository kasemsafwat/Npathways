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
  useTheme,
  useMediaQuery,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";

// Icons
import TimelineIcon from "@mui/icons-material/Timeline";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import ReplayIcon from "@mui/icons-material/Replay";

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
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const { submittedExamId } = useParams(); // Get exam ID from URL params

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

  // Fetch exam results from API
  useEffect(() => {
    const fetchExamResult = async () => {
      try {
        setLoading(true);

        // If we have a specific submittedExamId in the URL, fetch that specific exam
        if (submittedExamId) {
          const response = await axios.get(
            `http://localhost:5024/api/exam/submittedExams/${submittedExamId}`
          );
          processExamData(response.data);
        }
        // Otherwise fetch the most recent exam (from state or the latest one)
        else {
          // Try to use the exam ID from location state if available
          const examIdFromState = location.state?.submittedExamId;

          if (examIdFromState) {
            const response = await axios.get(
              `http://localhost:5024/api/exam/submittedExams/${examIdFromState}`
            );
            processExamData(response.data);
          } else {
            // If no specific ID, fetch all and use the most recent one
            const response = await axios.get(
              "http://localhost:5024/api/exam/submittedExams"
            );
            if (response.data && response.data.length > 0) {
              // Sort by submission date and get the most recent one
              const sortedExams = response.data.sort(
                (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
              );
              processExamData(sortedExams[0]);
            } else {
              throw new Error("No exam results found");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching exam results:", err);
        setError(err.message || "Failed to load exam results");
      } finally {
        setLoading(false);
      }
    };

    fetchExamResult();
  }, [submittedExamId, location.state]);

  // Process the exam data from API into the format we need
  const processExamData = (examData) => {
    // Count correct and incorrect answers
    const correctAnswers = examData.responses.filter((r) => r.isCorrect).length;
    const incorrectAnswers = examData.responses.filter(
      (r) => !r.isCorrect
    ).length;

    // Calculate time taken (if available in the API response)
    let examDuration = "N/A";
    if (examData.startTime && examData.submittedAt) {
      const startTime = new Date(examData.startTime);
      const endTime = new Date(examData.submittedAt);
      const durationMinutes = Math.round((endTime - startTime) / 60000); // milliseconds to minutes
      examDuration = `${durationMinutes} minutes`;
    }

    // Format the data for our UI
    setResult({
      score: examData.score,
      passed: examData.passed,
      totalQuestions: examData.responses.length,
      correctAnswers,
      incorrectAnswers,
      examDuration,
      feedbackSummary: getFeedbackSummary(examData.score, examData.passed),
      submittedAt: new Date(examData.submittedAt).toLocaleString(),
    });
  };

  // Generate feedback summary based on score and pass status
  const getFeedbackSummary = (score, passed) => {
    if (score >= 80) {
      return "Great job! You demonstrated an excellent understanding of the course material.";
    } else if (score >= 70) {
      return "Good job! You demonstrated a solid understanding of the course material.";
    } else if (score >= 60) {
      return "You have a basic understanding of the course material.";
    } else {
      return "You may need to review the course material more thoroughly.";
    }
  };

  // Show loading state
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

  // Show error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          component={RouterLink}
          to="/student/mypathway"
          startIcon={<HomeIcon />}
        >
          Return to Learning Path
        </Button>
      </Container>
    );
  }

  // If no result data
  if (!result) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="info">
          No exam results found. Please try taking an exam first.
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            component={RouterLink}
            to="/student/mypathway"
            startIcon={<HomeIcon />}
          >
            Return to Learning Path
          </Button>
        </Box>
      </Container>
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
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                Submitted: {result.submittedAt}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main content with detailed results */}
        <Grid container spacing={4} justifyContent="center">
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

              <Grid container spacing={3}>
                <Grid item xs={6} sm={4}>
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

                <Grid item xs={6} sm={4}>
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

                <Grid item xs={6} sm={4}>
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
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Action buttons directly in the main card */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={4}>
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
                      onClick={() => navigate(-1)} // Go back to retake exam
                      startIcon={<ReplayIcon />}
                    >
                      Retry Exam
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
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
                </Grid>
                <Grid item xs={12} sm={4}>
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
                </Grid>
              </Grid>
            </ResultPaper>
          </Grid>

          {/* Right column - Performance insights */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: { md: "sticky" }, top: 20 }}>
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
                    of the exam material.
                  </Typography>

                  {result.passed ? (
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      You have successfully completed this exam. You can
                      continue your learning journey by exploring more courses
                      or returning to your learning path.
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      We recommend reviewing the course material before retaking
                      the exam. Focus on the specific topics where you had
                      difficulties.
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
