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
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import image from "../../assets/Rectangle 72.png";

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
    <Grid item xs={12} sm={4} md={3}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 3,
          transition: "transform 0.3s",
          "&:hover": { transform: "scale(1.02)" },
          height: "100%",
          marginTop: "15px",
        }}
      >
        {loading ? (
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{ borderRadius: 4 }}
          />
        ) : (
          <Box
            sx={{
              position: "relative",
              height: 200,
              width: "100%",
              overflow: "hidden",
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
            }}
          >
            <CardMedia
              component="img"
              image={course.image || image}
              alt={course.name}
              sx={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = image;
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
              onClick={() => navigate(`/coursedetails/${course._id}`)}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                View Details
              </Typography>
            </Box>
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1 }}>
          {loading ? (
            <>
              <Skeleton variant="text" height={40} width="80%" />
              <Skeleton variant="text" height={20} width="100%" />
            </>
          ) : (
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                height: "40px",
                width: "100%",
                transition: "all 0.5s ease",
                transitionDelay: "0.2s",
                "&:hover": {
                  whiteSpace: "normal",
                  overflow: "visible",
                  textOverflow: "clip",
                },
              }}
            >
              {course.name}
            </Typography>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Instructors:
            </Typography>

            {loading ? (
              <Skeleton variant="text" width="70%" />
            ) : course.instructors?.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mt: 1,
                }}
              >
                {course.instructors.map((instructor, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: "rgba(0,0,0,0.04)",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                    }}
                  >
                    <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>
                      {instructor.firstName?.charAt(0) || "?"}
                    </Avatar>
                    <Typography variant="body2">
                      {`${instructor.firstName || ""} ${
                        instructor.lastName || ""
                      }`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No instructors assigned.
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
              justifyContent: "space-between",
            }}
          >
            {loading ? (
              <Skeleton width="50%" height={30} />
            ) : (
              <>
                {course.discount > 0 && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      textDecoration: "line-through",
                    }}
                  >
                    ${course.price}
                  </Typography>
                )}
                <Typography
                  variant="h6"
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                  }}
                >
                  ${course.price - course.discount}
                </Typography>
              </>
            )}
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/coursedetails/${course._id}`)}
            disabled={loading}
          >
            Details
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default CoursesCard;
