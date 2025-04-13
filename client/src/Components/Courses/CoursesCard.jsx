import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Skeleton,
  Box,
  Grid,
  useTheme,
  Tooltip,
  Divider,
  AvatarGroup,
  Rating,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import image from "../../assets/Rectangle 72.png";

// Icons
import SchoolIcon from "@mui/icons-material/School";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  height: "100%",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
    "& .MuiCardMedia-root": {
      transform: "scale(1.05)",
    },
  },
}));

const CourseMediaWrapper = styled(Box)({
  position: "relative",
  height: 180,
  overflow: "hidden",
});

const CourseMedia = styled(CardMedia)({
  height: "100%",
  width: "100%",
  objectFit: "cover",
  transition: "transform 0.6s ease-in-out",
});

const MediaOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))",
  display: "flex",
  alignItems: "flex-end",
  padding: theme.spacing(2),
  color: "#fff",
}));

const PriceTag = styled(Box)(({ theme, hasDiscount }) => ({
  background: hasDiscount
    ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`
    : theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.spacing(0, 0, 0, 16),
  position: "absolute",
  top: 0,
  right: 0,
  fontWeight: 700,
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
}));

function CoursesCard({ course }) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5024/api/user/${userId}`,
          { withCredentials: true }
        );
        const enrolledCourses = response.data.courses;
        setIsEnrolled(enrolledCourses.includes(course._id));
      } catch (error) {
        console.error("Error checking enrollment status:", error);
      }
    };

    checkEnrollment();
  }, [course._id]);

  const handleEnroll = async () => {
    setEnrollLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5024/api/course/enrollInCourse",
        { courseId: course._id },
        { withCredentials: true }
      );
      console.log("Enrolled successfully:", response.data);
      setIsEnrolled(true);
    } catch (error) {
      if (error.response?.data?.examsNeeded) {
        const examsNeeded = error.response.data.examsNeeded;
        navigate(`/exam/${examsNeeded[0]}`);
      } else {
        console.error("Error enrolling in course:", error);
      }
    } finally {
      setEnrollLoading(false);
    }
  };

  return (
    <StyledCard component={motion.div} whileHover={{ scale: 1.02 }}>
      {/* Course image section */}
      <CourseMediaWrapper>
        {loading ? (
          <Skeleton variant="rectangular" height={180} width="100%" />
        ) : (
          <>
            <CourseMedia
              component="img"
              image={course.image || image}
              alt={course.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = image;
              }}
            />
            <MediaOverlay>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <SchoolIcon fontSize="small" />
                {Math.floor(Math.random() * 5000) + 100} students enrolled
              </Typography>
            </MediaOverlay>

            {/* Price tag */}
            {(course.price > 0 || course.discount > 0) && (
              <PriceTag hasDiscount={course.discount > 0}>
                {course.discount > 0
                  ? `$${course.price - course.discount}`
                  : `$${course.price}`}
              </PriceTag>
            )}
          </>
        )}
      </CourseMediaWrapper>

      {/* Course content */}
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        {loading ? (
          <>
            <Skeleton variant="text" height={28} width="90%" />
            <Skeleton variant="text" height={20} width="70%" />
          </>
        ) : (
          <>
            {/* Course title */}
            <Tooltip title={course.name}>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  lineHeight: 1.3,
                  height: "2.6rem",
                }}
              >
                {course.name}
              </Typography>
            </Tooltip>

            {/* Rating */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating
                value={course.rating || 4 + Math.random()}
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({Math.floor(Math.random() * 500) + 5})
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* Instructors */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Instructors:
              </Typography>

              {course.instructors?.length > 0 ? (
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <AvatarGroup max={3} sx={{ mr: 1 }}>
                    {course.instructors.map((instructor, idx) => (
                      <Avatar
                        key={idx}
                        alt={`${instructor.firstName || ""} ${
                          instructor.lastName || ""
                        }`}
                        src={instructor.avatar}
                        sx={{ width: 28, height: 28 }}
                      >
                        {instructor.firstName?.charAt(0) || "?"}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "70%",
                    }}
                  >
                    {course.instructors
                      .map((i) => `${i.firstName || ""} ${i.lastName || ""}`)
                      .join(", ")}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No instructors assigned
                </Typography>
              )}
            </Box>
          </>
        )}
      </CardContent>

      {/* Card actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disableElevation
          onClick={() => navigate(`/coursedetails/${course._id}`)}
          sx={{
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          View Details
        </Button>
      </CardActions>
    </StyledCard>
  );
}

export default CoursesCard;
