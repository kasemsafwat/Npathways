import React, { useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import bimManagerImage from "../assets/bim-manager.jpeg";
import instructorImage from "../assets/instructorImage.png";
import { AuthContext } from "../contexts/AuthContext";

export default function CourseContent() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [submittedExams, setSubmittedExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);

  useEffect(() => {
    const fetchSubmittedExams = async () => {
      if (!user) return;

      try {
        const response = await axios.get(
          "http://localhost:5024/api/exam/submittedExams"
        );
        setSubmittedExams(response.data);
      } catch (error) {
        console.error("Error fetching submitted exams:", error);
      } finally {
        setLoadingExams(false);
      }
    };

    fetchSubmittedExams();
  }, [user]);

  useEffect(() => {
    const checkCourseAccess = () => {
      if (!user) return false;

      // Check in user.courses array of objects
      const enrolledInCourses = user.courses?.some(
        (course) => course._id === courseId || course.id === courseId
      );

      // Check if any pathway in user.pathways array has this course
      const enrolledInPathway = user.pathways?.some((pathway) => {
        return pathway.courses?.includes(courseId);
      });
      return enrolledInCourses || enrolledInPathway;
    };

    if (courseId && user && !checkCourseAccess()) {
      // User doesn't have access to this course
      setTimeout(() => {
        navigate(`/coursedetails/${courseId}`);
      }, 1500);
    }

    // Function to fetch course data based on courseId
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        // Using axios instead of fetch
        const response = await axios.get(
          `http://localhost:5024/api/course/${courseId}`
        );

        // Axios automatically parses JSON
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, navigate, user]);

  if (
    !user ||
    (user &&
      !loading &&
      !user.courses?.some(
        (course) => course._id === courseId || course.id === courseId
      ) &&
      !user.pathways?.some((pathway) => {
        return pathway.courses?.includes(courseId);
      }))
  ) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          You aren&apos;t enrolled in this course
        </Typography>
        <Typography>Redirecting to course details...</Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="200px">
        <CircularProgress />
      </Stack>
    );
  }

  if (!course) {
    return <Typography>Course not found</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Course Image */}
      <Box sx={{ width: "100%", height: 300, position: "relative", mb: 4 }}>
        <CardMedia
          component="img"
          image={course.image || bimManagerImage}
          alt={course.name}
          sx={{
            height: "100%",
            borderRadius: "30px",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = bimManagerImage;
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            bgcolor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            p: 2,
            borderBottomLeftRadius: "30px",
            borderBottomRightRadius: "30px",
          }}
        >
          <Typography variant="h4">{course.name}</Typography>
          <Typography variant="body1">{course.description}</Typography>
        </Box>
      </Box>

      {/* Instructors Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: "30px" }}>
        <Typography variant="h5" gutterBottom color="primary">
          Instructors
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {course.instructors && course.instructors.length > 0 ? (
            course.instructors.map((instructor, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: "100%", borderRadius: "10px" }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={instructor.image || instructorImage}
                    alt="Instructor"
                  />
                  <CardContent>
                    <Typography variant="h6" textAlign="center">
                      {instructor.firstName + " " + instructor.lastName}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography>
                No instructors assigned to this course yet.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Required Exams Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: "30px" }}>
        <Typography variant="h5" gutterBottom color="primary">
          Required Exams
        </Typography>
        {course.requiredExams && course.requiredExams.length > 0 ? (
          <List>
            {course.requiredExams.map((exam, index) => {
              const submittedExam = submittedExams.find(
                (subExam) =>
                  subExam.examId === exam._id || subExam.examId === exam.id
              );
              const hasPassed = submittedExam && submittedExam.passed;

              return (
                <ListItem
                  key={index}
                  sx={{
                    mb: 1,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: hasPassed ? "success.light" : "divider",
                  }}
                >
                  <ListItemText primary={exam.name || `Exam ${index + 1}`} />
                  <Chip
                    label={hasPassed ? "Passed" : "Not Passed"}
                    color={hasPassed ? "success" : "default"}
                    size="small"
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography>No required exams for this course.</Typography>
        )}
      </Paper>

      {/* Lessons Section */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: "30px" }}>
        <Typography variant="h5" gutterBottom color="primary">
          Lessons
        </Typography>
        {course.lessons && course.lessons.length > 0 ? (
          course.lessons.map((lesson, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ bgcolor: "background.paper" }}
              >
                <Typography variant="h6">
                  {index + 1}. {lesson.name}
                </Typography>
                {lesson.duration && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      ml: "auto",
                      mr: 2,
                    }}
                  >
                    <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {lesson.duration} min
                    </Typography>
                  </Box>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={lesson.image ? 8 : 12}>
                    <Typography>
                      {lesson.description || "No description available"}
                    </Typography>
                    {lesson.downloadLink && (
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        href={lesson.downloadLink}
                        sx={{ mt: 2 }}
                      >
                        Download Materials
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography>No lessons available for this course yet.</Typography>
        )}
      </Paper>
    </Container>
  );
}
