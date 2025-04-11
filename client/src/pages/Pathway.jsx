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
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  InsertDriveFile as InsertDriveFileIcon,
} from "@mui/icons-material";
import { AuthContext } from "../contexts/AuthContext";

function Pathway() {
  const { id } = useParams();
  const [pathway, setPathway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [SubmittedExams, setSubmittedExams] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
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

  function fetchPathway() {
    setLoading(true);
    axios
      .get(`http://localhost:5024/api/pathway/student/${id}`)
      .then((response) => {
        setPathway(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pathway:", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchPathway();
  }, []);
  const StatusBadge = ({ status }) => {
    let icon, label, color;

    switch (status) {
      case "completed":
        icon = <CheckCircleIcon fontSize="small" />;
        label = "Completed";
        color = "success";
        break;
      case "in-progress":
        icon = <AccessTimeIcon fontSize="small" />;
        label = "In Progress";
        color = "info";
        break;
      default:
        icon = <RadioButtonUncheckedIcon fontSize="small" />;
        label = "Not Started";
        color = "default";
    }

    return (
      <Chip
        icon={icon}
        label={label}
        color={color}
        size="small"
        sx={{ mb: 1 }}
      />
    );
  };

  // Exam Button component
  const ExamButton = ({ type, disabled }) => (
    <Button
      variant="outlined"
      size="small"
      disabled={disabled}
      startIcon={<InsertDriveFileIcon />}
      sx={{ mr: 1, mb: 1 }}
    >
      {type}
    </Button>
  );

  // Course Card component
  const CourseCard = ({ course, isLast }) => {
    const { name, description, duration, status, requiredExams } = course;
    // Check exam status
    const examStatus = requiredExams?.map((exam) => {
      const submitted = SubmittedExams.find(
        (submittedExam) => submittedExam.examId === exam._id
      );
      return submitted ? submitted.passed : false;
    });

    // Determine course status based on exam completion
    let isCompleted = false;
    let isPending = false;

    if (examStatus?.length > 0) {
      // All exams are passed
      if (examStatus.every((passed) => passed === true)) {
        isCompleted = true;
      }
      // Some exams are passed but not all
      else if (examStatus.some((passed) => passed === true)) {
        isPending = true;
      }
    }

    return (
      <>
        <Card
          variant="outlined"
          sx={{
            mb: 1,
            width: "100%",
            border: "1px solid #e0e0e0",
            boxShadow: 1,
            borderRadius: "30px",
          }}
        >
          <CardContent>
            <Box mb={2}>
              <StatusBadge status={status} />
              <Typography variant="h6" gutterBottom>
                {name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Duration: {duration}
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box mt={1.5}>
              <Typography variant="subtitle2" gutterBottom>
                Required Exams:
              </Typography>
              <Box>
                {requiredExams &&
                  requiredExams.map((exam, index) => (
                    <ExamButton key={index} type={exam.name} />
                  ))}
              </Box>
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={() => navigate(`/courseContent/${course._id}`)}
                sx={{ textTransform: "none", borderRadius: "15px" }}
              >
                Details
              </Button>
            </Box>
          </CardContent>
        </Card>

        {!isLast && (
          <Box display="flex" justifyContent="center" my={2}>
            <KeyboardArrowDownIcon color="action" fontSize="large" />
          </Box>
        )}
      </>
    );
  };

  // Mock data - Replace with actual data from your API
  const mockCourses = [
    {
      id: 1,
      title: "HTML & CSS Fundamentals",
      description:
        "Learn the building blocks of web development with HTML and CSS.",
      duration: "4 weeks",
      status: "completed",
      requiredExams: ["Final Exam"],
    },
    {
      id: 2,
      title: "JavaScript Essentials",
      description:
        "Master JavaScript programming for dynamic web applications.",
      duration: "6 weeks",
      status: "in-progress",
      requiredExams: ["Final Exam", "Practical Exam"],
    },
    {
      id: 3,
      title: "React Framework",
      description: "Build modern user interfaces with React.",
      duration: "5 weeks",
      status: "not-started",
      requiredExams: ["Final Exam", "Practical Exam"],
    },
    {
      id: 4,
      title: "Databases",
      description: "Learn SQL and NoSQL database design and implementation.",
      duration: "4 weeks",
      status: "not-started",
      requiredExams: ["Final Exam", "Practical Exam"],
    },
    {
      id: 5,
      title: "Final Project",
      description: "Apply your skills in a comprehensive full-stack project.",
      duration: "3 weeks",
      status: "not-started",
      requiredExams: ["Project Presentation"],
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          Loading pathway...
        </Typography>
      </Container>
    );
  }

  // Use the actual data from the API when available, or mock data for now
  const pathwayName = pathway?.data?.name || "Full Stack Web Development";
  const pathwayDescription =
    pathway?.data?.description ||
    "A comprehensive learning path to become a full stack web developer";
  const courses = pathway?.data?.courses || mockCourses;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          textAlign: "center",
          backgroundColor: "transparent",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {pathwayName}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {pathwayDescription}
        </Typography>
      </Paper>

      <Stack spacing={1} alignItems="center">
        {courses.map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            isLast={index === courses.length - 1}
          />
        ))}
      </Stack>
    </Container>
  );
}

export default Pathway;
