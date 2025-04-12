import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Container,
  Chip,
  Stack,
  Paper,
  Tooltip,
  CircularProgress,
  Skeleton,
  useTheme,
  useMediaQuery,
  IconButton,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  InsertDriveFile as InsertDriveFileIcon,
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  DescriptionOutlined as DescriptionIcon,
  HourglassBottom as HourglassIcon,
  TimelineOutlined as TimelineIcon,
  Launch as LaunchIcon,
  EmojiEvents as EmojiEventsIcon,
} from "@mui/icons-material";
import { AuthContext } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";

// Styled components
const PathwayHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  textAlign: "center",
  backgroundColor: "transparent",
  borderRadius: theme.spacing(2),
  backgroundImage: `linear-gradient(120deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)`,
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const StyledCourseCard = styled(Card)(({ theme }) => ({
  width: "100%",
  border: "1px solid #e0e0e0",
  borderRadius: theme.spacing(3),
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  position: "relative",
  overflow: "visible",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
  },
}));

const StepConnector = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 40,
  width: 2,
  backgroundColor: theme.palette.divider,
  margin: "0 auto",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: -4,
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: -4,
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
  },
}));

const StatusBadge = styled(Chip)(({ theme, status }) => {
  const colors = {
    completed: theme.palette.success,
    "in-progress": theme.palette.info,
    "not-started": theme.palette.text.disabled,
  };

  return {
    fontWeight: 600,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(0.5, 0),
    "& .MuiChip-icon": {
      marginLeft: theme.spacing(0.5),
    },
  };
});

const ExamChip = styled(Chip)(({ theme, passed }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  borderRadius: theme.spacing(1),
  backgroundColor: passed
    ? theme.palette.success.light
    : theme.palette.background.paper,
  color: passed
    ? theme.palette.success.contrastText
    : theme.palette.text.primary,
  border: passed ? "none" : `1px solid ${theme.palette.divider}`,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: passed
      ? theme.palette.success.main
      : theme.palette.action.hover,
  },
}));

function Pathway() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { id } = useParams();
  const [pathway, setPathway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittedExams, setSubmittedExams] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loadingExams, setLoadingExams] = useState(true);

  // Enhanced fetchSubmittedExams function to ensure cookies are sent
  useEffect(() => {
    const fetchSubmittedExams = async () => {
      if (!user) {
        setLoadingExams(false);
        return;
      }

      try {
        setLoadingExams(true);
        const response = await axios.get(
          "http://localhost:5024/api/exam/submittedExams",
          {
            withCredentials: true, // Ensures cookies are sent with the request
          }
        );
        setSubmittedExams(response.data);
        console.log("Submitted exams loaded:", response.data.length);
      } catch (error) {
        console.error("Error fetching submitted exams:", error);
        setError(
          "Failed to load exam information. Some course status may not be accurate."
        );
      } finally {
        setLoadingExams(false);
      }
    };

    fetchSubmittedExams();
  }, [user]);

  function fetchPathway() {
    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:5024/api/pathway/student/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setPathway(response.data);
      })
      .catch((error) => {
        console.error("Error fetching pathway:", error);
        setError("Failed to load pathway information. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchPathway();
  }, [id]);

  // Enhanced function to determine course status based on exams
  const getCourseStatus = (course) => {
    if (!course.requiredExams || course.requiredExams.length === 0) {
      return course.status || "not-started";
    }

    const examStatuses = course.requiredExams.map((exam) =>
      getExamStatus(exam)
    );
    const passedExams = examStatuses.filter((status) => status.passed).length;

    if (passedExams === course.requiredExams.length) {
      return "completed";
    } else if (passedExams > 0 || course.status === "in-progress") {
      return "in-progress";
    }
    return course.status || "not-started";
  };

  // Calculate pathway completion using the enhanced course status
  const calculateCompletion = (courses) => {
    if (!courses?.length) return 0;

    const completedCourses = courses.filter(
      (course) => getCourseStatus(course) === "completed"
    );

    return Math.round((completedCourses.length / courses.length) * 100);
  };

  // Check exam status
  const getExamStatus = (exam) => {
    if (!exam || !exam._id) return { passed: false, attempted: false };

    const submitted = submittedExams.find(
      (submittedExam) => submittedExam.examId === exam._id
    );

    return {
      passed: submitted?.passed || false,
      attempted: !!submitted,
      score: submitted?.score,
    };
  };

  // Course Card component
  const CourseCard = ({ course, index, isLast, totalCourses }) => {
    const {
      _id,
      name,
      description,
      duration,
      status,
      requiredExams = [],
    } = course;

    // Calculate course progress based on exams
    const examStatuses = requiredExams.map((exam) => getExamStatus(exam));
    const passedExams = examStatuses.filter((status) => status.passed).length;
    const courseProgress =
      requiredExams.length > 0
        ? Math.round((passedExams / requiredExams.length) * 100)
        : status === "completed"
        ? 100
        : status === "in-progress"
        ? 50
        : 0;

    // Use the enhanced status determination
    const badgeStatus = getCourseStatus(course);

    // Status badge configuration
    const statusConfig = {
      completed: {
        icon: <CheckCircleIcon fontSize="small" />,
        label: "Completed",
        color: "success",
      },
      "in-progress": {
        icon: <AccessTimeIcon fontSize="small" />,
        label: "In Progress",
        color: "info",
      },
      "not-started": {
        icon: <RadioButtonUncheckedIcon fontSize="small" />,
        label: "Not Started",
        color: "default",
      },
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        style={{ width: "100%" }}
      >
        <Box sx={{ position: "relative" }}>
          {/* Course number indicator */}
          <Box
            sx={{
              position: "absolute",
              top: 15,
              left: -15,
              width: 30,
              height: 30,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              zIndex: 1,
              boxShadow: 2,
            }}
          >
            {index + 1}
          </Box>

          <StyledCourseCard>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ mb: 2 }}>
                {/* Status badge */}
                <StatusBadge
                  icon={statusConfig[badgeStatus].icon}
                  label={statusConfig[badgeStatus].label}
                  color={statusConfig[badgeStatus].color}
                  status={badgeStatus}
                  size="small"
                  sx={{ mb: 2 }}
                />

                {/* Course title */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color:
                      badgeStatus === "completed"
                        ? "success.dark"
                        : "text.primary",
                  }}
                >
                  {name}
                </Typography>

                {/* Progress bar */}
                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 1.5, mt: 2 }}
                >
                  <Box sx={{ flex: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={courseProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: theme.palette.grey[200],
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {courseProgress}%
                  </Typography>
                </Box>

                {/* Course info */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <DescriptionIcon
                      fontSize="small"
                      color="action"
                      sx={{ mr: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {description || "No description available"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <HourglassIcon
                      fontSize="small"
                      color="action"
                      sx={{ mr: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Duration: {duration || "Not specified"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Required exams */}
              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <EmojiEventsIcon fontSize="small" color="primary" />
                  Required Exams:
                </Typography>

                <Box sx={{ mt: 1 }}>
                  {requiredExams && requiredExams.length > 0 ? (
                    requiredExams.map((exam, i) => {
                      const examStatus = getExamStatus(exam);
                      return (
                        <Tooltip
                          key={i}
                          title={
                            examStatus.attempted
                              ? examStatus.passed
                                ? `Passed with score: ${examStatus.score}%`
                                : "Attempted but not passed"
                              : "Not attempted yet"
                          }
                          arrow
                        >
                          <ExamChip
                            icon={
                              examStatus.passed ? (
                                <CheckCircleIcon fontSize="small" />
                              ) : (
                                <InsertDriveFileIcon fontSize="small" />
                              )
                            }
                            label={exam.name}
                            passed={examStatus.passed}
                            onClick={() => navigate(`/exam/${exam._id}`)}
                            clickable={!examStatus.passed}
                          />
                        </Tooltip>
                      );
                    })
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      No exams required for this course.
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Action buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 3,
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={() => navigate(`/courseContent/${_id}`)}
                  endIcon={<LaunchIcon />}
                  aria-label={`View details of ${name}`}
                  sx={{
                    textTransform: "none",
                    borderRadius: "12px",
                    px: 2,
                  }}
                >
                  View Course
                </Button>
              </Box>
            </CardContent>
          </StyledCourseCard>
        </Box>

        {/* Course connector */}
        {!isLast && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
            <StepConnector />
          </Box>
        )}
      </motion.div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6">Loading your learning pathway...</Typography>

          {/* Skeleton loaders for courses */}
          <Box sx={{ width: "100%", mt: 4 }}>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ mb: 4 }}>
                <Skeleton
                  variant="rounded"
                  height={200}
                  sx={{ borderRadius: 3 }}
                />
                <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
                  <Skeleton variant="text" width={2} height={40} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    );
  }

  // Error state
  if (error && !pathway) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => fetchPathway()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  // Get pathway data
  const pathwayData = pathway?.data || {};
  const {
    name: pathwayName,
    description: pathwayDescription,
    courses = [],
  } = pathwayData;
  const pathwayCompletion = calculateCompletion(courses);

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 3, md: 5 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back button */}
      <Box sx={{ mb: 2 }}>
        <IconButton
          onClick={() => navigate(-1)}
          aria-label="Go back"
          sx={{
            bgcolor: "background.paper",
            boxShadow: 1,
            "&:hover": { bgcolor: "grey.100" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Pathway header */}
      <PathwayHeader elevation={0}>
        {/* Decorative circle */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 160,
            height: 160,
            borderRadius: "50%",
            bgcolor: "primary.light",
            opacity: 0.1,
            zIndex: 0,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <SchoolIcon
              sx={{
                fontSize: "2.5rem",
                color: "primary.main",
                mr: 1,
              }}
            />
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, mb: 0 }}
            >
              {pathwayName || "Learning Pathway"}
            </Typography>
          </Box>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
            sx={{
              maxWidth: "80%",
              mx: "auto",
              mb: 3,
            }}
          >
            {pathwayDescription || "Your personalized learning journey"}
          </Typography>

          {/* Progress indicator */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <TimelineIcon sx={{ mr: 1, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              Pathway Progress:
            </Typography>
            <Box sx={{ flex: 1, maxWidth: 200 }}>
              <LinearProgress
                variant="determinate"
                value={pathwayCompletion}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: "grey.200",
                }}
              />
            </Box>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                ml: 2,
                color:
                  pathwayCompletion === 100 ? "success.main" : "text.primary",
              }}
            >
              {pathwayCompletion}%
            </Typography>
          </Box>
        </Box>
      </PathwayHeader>

      {/* Warning for exam loading issues */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Courses timeline */}
      <Box sx={{ position: "relative" }}>
        {loadingExams && (
          <LinearProgress
            sx={{
              position: "absolute",
              top: -10,
              left: 0,
              right: 0,
              height: 3,
            }}
          />
        )}

        <Stack spacing={0} alignItems="center">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <CourseCard
                key={course._id || index}
                course={course}
                index={index}
                isLast={index === courses.length - 1}
                totalCourses={courses.length}
              />
            ))
          ) : (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No courses found in this pathway.
              </Typography>
            </Paper>
          )}
        </Stack>
      </Box>
    </Container>
  );
}

export default Pathway;
