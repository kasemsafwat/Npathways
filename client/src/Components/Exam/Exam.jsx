import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  LinearProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  IconButton,
  alpha,
  Stack,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// Icons
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";

// Custom styled components
const ExamContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  backgroundColor: "#fff",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const QuestionNumber = styled(Box)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  fontSize: "1rem",
  marginRight: theme.spacing(2),
}));

const QuestionNavigationButton = styled(Button)(({ theme, active }) => ({
  minWidth: 40,
  width: 40,
  height: 40,
  borderRadius: "50%",
  padding: 0,
  margin: theme.spacing(0.5),
  backgroundColor: active
    ? theme.palette.primary.main
    : theme.palette.grey[100],
  color: active
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  "&:hover": {
    backgroundColor: active
      ? theme.palette.primary.dark
      : theme.palette.grey[200],
  },
  border: active ? "none" : `1px solid ${theme.palette.grey[300]}`,
}));

const OptionCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: "1px solid",
  borderColor: selected ? theme.palette.primary.main : theme.palette.grey[200],
  cursor: "pointer",
  backgroundColor: selected ? alpha(theme.palette.primary.main, 0.05) : "white",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: selected
      ? alpha(theme.palette.primary.main, 0.05)
      : theme.palette.grey[50],
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
}));

export default function Exam() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // State variables from your original component
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [responses, setResponses] = useState([]);

  // New UI state variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Get exam data from API
  async function getQuestion() {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5024/api/exam/${id}`);

      setExam(data);
      console.log(data);
      setTimeLeft(data.timeLimit * 60);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exam:", error);
      setLoading(false);
    }
  }

  // Submit exam answers
  const handleSubmitExam = () => {
    setSubmitting(true);

    const payload = {
      examId: id,
      responses: responses,
    };

    axios
      .post("http://localhost:5024/api/exam/submitExam", payload, {
        withCredentials: true,
      })
      .then((response) => {
        navigate("/finishExam");
      })
      .catch((error) => {
        console.error("There was an error submitting the exam!", error);
        setSubmitting(false);
      });
  };

  // Timer functionality
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && exam) {
      // Auto-submit when time is up
      handleSubmitExam();
    }
  }, [timeLeft, exam]);

  // Format time display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Initialize exam data
  useEffect(() => {
    getQuestion();
  }, []);

  // Answer selection handler
  const handleAnswerChange = (questionIndex, answer) => {
    setResponses((prevResponses) => {
      const newResponses = [...prevResponses];
      newResponses[questionIndex] = {
        question: exam.questions[questionIndex].question,
        selectedAnswers: [answer],
      };
      return newResponses;
    });
  };

  // New navigation functions
  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam?.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleGoToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const toggleFlagQuestion = (questionIndex) => {
    if (flaggedQuestions.includes(questionIndex)) {
      setFlaggedQuestions(
        flaggedQuestions.filter((idx) => idx !== questionIndex)
      );
    } else {
      setFlaggedQuestions([...flaggedQuestions, questionIndex]);
    }
  };

  const handleShowConfirmation = () => {
    setShowConfirmDialog(true);
  };

  // Helper functions
  const getProgressPercentage = () => {
    return (
      (responses.filter((response) => response !== undefined).length /
        exam?.questions.length) *
      100
    );
  };

  const isQuestionAnswered = (questionIndex) => {
    return responses[questionIndex] !== undefined;
  };

  const isQuestionFlagged = (questionIndex) => {
    return flaggedQuestions.includes(questionIndex);
  };

  // Loading state
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
          Loading exam...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (!exam) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          No exam data found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          We couldn't load the exam. Please try again or contact support.
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Exam Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {exam.name || "Exam"}
          </Typography>

          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={6} sm={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                  icon={<HelpOutlineOutlinedIcon />}
                  label={`${exam.questions?.length || 0} Questions`}
                  color="default"
                  variant="outlined"
                />
              </Stack>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TimerOutlinedIcon
                  sx={{
                    color:
                      timeLeft < 300
                        ? "error.main"
                        : timeLeft < 600
                        ? "warning.main"
                        : "text.secondary",
                    animation: timeLeft < 300 ? "pulse 1s infinite" : "none",
                  }}
                />
                <Typography
                  variant="h6"
                  fontWeight="medium"
                  sx={{
                    color:
                      timeLeft < 300
                        ? "error.main"
                        : timeLeft < 600
                        ? "warning.main"
                        : "text.primary",
                  }}
                >
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", sm: "flex-end" },
              }}
            >
              <Button
                startIcon={<InfoOutlinedIcon />}
                variant="outlined"
                color="primary"
                onClick={() => setShowInstructionsDialog(true)}
                sx={{ mr: 2 }}
              >
                Instructions
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleShowConfirmation}
                disabled={responses.filter((r) => r !== undefined).length === 0}
              >
                Submit Exam
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Progress: {responses.filter((r) => r !== undefined).length} of{" "}
              {exam.questions.length} questions answered
            </Typography>
            <LinearProgress
              variant="determinate"
              value={getProgressPercentage()}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Question Panel - Left side */}
          <Grid item xs={12} md={8}>
            <ExamContainer>
              {/* Current question */}
              <Box>
                {/* Question header */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <QuestionNumber>{currentQuestionIndex + 1}</QuestionNumber>
                  <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, fontWeight: 500 }}
                  >
                    Question {currentQuestionIndex + 1} of{" "}
                    {exam.questions.length}
                  </Typography>
                  <Tooltip
                    title={
                      isQuestionFlagged(currentQuestionIndex)
                        ? "Unflag question"
                        : "Flag for review"
                    }
                  >
                    <IconButton
                      color={
                        isQuestionFlagged(currentQuestionIndex)
                          ? "primary"
                          : "default"
                      }
                      onClick={() => toggleFlagQuestion(currentQuestionIndex)}
                      aria-label="Flag question for review"
                    >
                      {isQuestionFlagged(currentQuestionIndex) ? (
                        <BookmarkIcon />
                      ) : (
                        <BookmarkBorderOutlinedIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Question text */}
                <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>
                  {exam.questions[currentQuestionIndex].question}
                </Typography>

                {/* Answer options */}
                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <FormLabel component="legend" sx={{ visually: "hidden" }}>
                    Select an answer
                  </FormLabel>
                  <RadioGroup
                    aria-label={`question-${currentQuestionIndex}`}
                    name={`question-${currentQuestionIndex}`}
                    value={
                      responses[currentQuestionIndex]?.selectedAnswers[0] || ""
                    }
                    onChange={(e) =>
                      handleAnswerChange(currentQuestionIndex, e.target.value)
                    }
                  >
                    {exam.questions[currentQuestionIndex].answers.map(
                      (answer, answerIndex) => {
                        const isSelected =
                          responses[currentQuestionIndex]
                            ?.selectedAnswers[0] === answer.answer;

                        return (
                          <OptionCard
                            key={answerIndex}
                            selected={isSelected}
                            onClick={() =>
                              handleAnswerChange(
                                currentQuestionIndex,
                                answer.answer
                              )
                            }
                            sx={{
                              "&:focus-within": {
                                outline: `2px solid ${theme.palette.primary.main}`,
                                outlineOffset: "2px",
                              },
                            }}
                          >
                            <FormControlLabel
                              value={answer.answer}
                              control={<Radio sx={{ mr: 1 }} color="primary" />}
                              label={answer.answer}
                              sx={{
                                width: "100%",
                                m: 0,
                                ".MuiFormControlLabel-label": { width: "100%" },
                              }}
                            />
                          </OptionCard>
                        );
                      }
                    )}
                  </RadioGroup>
                </FormControl>

                {/* Navigation buttons */}
                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>

                  {currentQuestionIndex === exam.questions.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleShowConfirmation}
                    >
                      Submit Exam
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={handleNextQuestion}>
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </ExamContainer>
          </Grid>

          {/* Navigation and Status Panel - Right side */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: { md: "sticky" }, top: 20 }}>
              {/* Question navigation */}
              <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Question Navigator
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {exam.questions.map((question, index) => {
                    const isAnswered = isQuestionAnswered(index);
                    const isFlagged = isQuestionFlagged(index);
                    const isActive = currentQuestionIndex === index;

                    return (
                      <Tooltip
                        key={index}
                        title={`Question ${index + 1}${
                          isAnswered ? " (Answered)" : ""
                        }${isFlagged ? " (Flagged)" : ""}`}
                      >
                        <QuestionNavigationButton
                          aria-label={`Go to question ${index + 1}`}
                          onClick={() => handleGoToQuestion(index)}
                          active={isActive ? 1 : 0}
                          sx={{
                            position: "relative",
                            border: isFlagged
                              ? "2px solid #FF9800"
                              : isActive
                              ? "none"
                              : isAnswered
                              ? "2px solid #4CAF50"
                              : "1px solid #e0e0e0",
                            backgroundColor: isActive
                              ? "primary.main"
                              : isAnswered
                              ? "rgba(76, 175, 80, 0.1)"
                              : "white",
                          }}
                        >
                          {index + 1}
                          {isFlagged && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: -5,
                                right: -5,
                                width: 14,
                                height: 14,
                                backgroundColor: "#FF9800",
                                borderRadius: "50%",
                                border: "2px solid white",
                              }}
                            />
                          )}
                        </QuestionNavigationButton>
                      </Tooltip>
                    );
                  })}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: "rgba(76, 175, 80, 0.7)",
                        }}
                      />
                      <Typography variant="body2">Answered</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: "#FF9800",
                        }}
                      />
                      <Typography variant="body2">Flagged</Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Paper>

              {/* Exam summary */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Exam Summary
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Questions Answered
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {responses.filter((r) => r !== undefined).length} of{" "}
                      {exam.questions.length}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Questions Flagged
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {flaggedQuestions.length}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Time Remaining
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color:
                          timeLeft < 300
                            ? "error.main"
                            : timeLeft < 600
                            ? "warning.main"
                            : "text.primary",
                      }}
                    >
                      {formatTime(timeLeft)}
                    </Typography>
                  </Box>

                  <Divider />

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleShowConfirmation}
                    disabled={
                      responses.filter((r) => r !== undefined).length === 0
                    }
                  >
                    Submit Exam
                  </Button>

                  {responses.filter((r) => r !== undefined).length <
                    exam.questions.length && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      You have answered{" "}
                      {responses.filter((r) => r !== undefined).length} of{" "}
                      {exam.questions.length} questions. Consider reviewing
                      before submitting.
                    </Alert>
                  )}
                </Stack>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        aria-labelledby="submit-dialog-title"
        aria-describedby="submit-dialog-description"
      >
        <DialogTitle id="submit-dialog-title">Submit Exam?</DialogTitle>
        <DialogContent>
          <DialogContentText id="submit-dialog-description">
            You have answered {responses.filter((r) => r !== undefined).length}{" "}
            out of {exam.questions.length} questions.
            {flaggedQuestions.length > 0 &&
              ` You have ${flaggedQuestions.length} flagged question(s).`}
            {responses.filter((r) => r !== undefined).length <
              exam.questions.length && " Some questions remain unanswered."}
            <br />
            <br />
            Once submitted, you won&apos;t be able to change your answers. Are
            you sure you want to submit?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitExam}
            color="primary"
            variant="contained"
            autoFocus
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Instructions Dialog */}
      <Dialog
        open={showInstructionsDialog}
        onClose={() => setShowInstructionsDialog(false)}
        aria-labelledby="instructions-dialog-title"
        maxWidth="md"
      >
        <DialogTitle id="instructions-dialog-title">
          Exam Instructions
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {exam.instructions ||
              "Answer all questions to the best of your ability. Once you submit the exam, you cannot change your answers."}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mt: 2, mb: 1 }}
          >
            Exam Details:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Time Limit
              </Typography>
              <Typography variant="body1">
                {Math.floor(exam.timeLimit)} minutes
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Total Questions
              </Typography>
              <Typography variant="body1">{exam.questions.length}</Typography>
            </Grid>
          </Grid>

          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mt: 3, mb: 1 }}
          >
            Navigation Tips:
          </Typography>

          <ul>
            <li>
              <Typography variant="body2">
                Use the navigation panel on the right to quickly jump between
                questions
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Flag questions for review by clicking the bookmark icon
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Keep track of your progress with the progress bar at the top
              </Typography>
            </li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowInstructionsDialog(false)}
            color="primary"
            variant="contained"
          >
            Start Exam
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
