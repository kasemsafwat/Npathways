import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  Typography,
  Skeleton,
  Box,
  Grid2,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import image from "../../assets/Rectangle 72.png";

function CoursesCard({ course }) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [courseImage, setCourseImage] = useState(course.image);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the image URL exists
    setLoading(true);
    if (course.image) {
      try {
        // Try to fetch the image to check if it's valid
        axios
          .get(course.image)
          .then(() => setLoading(false))
          .catch(() => {
            // If there's an error fetching the image, use the default image
            setCourseImage(image);
            setLoading(false);
          });
      } catch (error) {
        // If there's an error fetching the image, use the default image
        setCourseImage(image);
        setLoading(false);
      }
    } else {
      // If no image URL is provided, use the default image
      setCourseImage(image);
      setLoading(false);
    }
  }, [course.image]);

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5024/api/user/${userId}`,
          {
            withCredentials: true,
          }
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
        {
          courseId: course._id,
        },
        { withCredentials: true }
      );
      console.log("Enrolled successfully:", response.data);
      setIsEnrolled(true);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.examsNeeded
      ) {
        const examsNeeded = error.response.data.examsNeeded;
        console.error("User has not passed all required exams:", examsNeeded);
        navigate(`/exam/${examsNeeded[0]}`);
      } else {
        console.error("Error enrolling in course:", error);
      }
    } finally {
      setEnrollLoading(false);
    }
  };

  return (
    <Grid2 xs={12} sm={6} md={3} key={course._id}>
      <Card
        sx={{
          height: "",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        {loading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            sx={{ borderRadius: "30px" }}
          />
        ) : (
          <CardMedia
            component="img"
            alt={course.name}
            image={courseImage}
            sx={{ objectFit: "cover", borderRadius: "30px" }}
          />
        )}

        <CardContent>
          {loading ? (
            <>
              <Skeleton variant="text" height={40} width="80%" />
              <Skeleton variant="text" height={20} width="100%" />
              <Skeleton variant="text" height={20} width="90%" />
            </>
          ) : (
            <>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold", my: 0 }}
              >
                {course.name}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {course.description}
              </Typography>
            </>
          )}

          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 1 }}>
            Instructors:
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                sx={{ mr: 2 }}
              />
              <Skeleton variant="text" width="60%" />
            </Box>
          ) : course.instructors && course.instructors.length > 0 ? (
            <List dense>
              {course.instructors.map((instructor, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {instructor && instructor.name
                        ? instructor.name.charAt(0)
                        : "?"}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      instructor && instructor.name
                        ? instructor.name
                        : "Unknown Instructor"
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No instructors assigned.
            </Typography>
          )}

          {/* Pricing Section */}
          {loading ? (
            <Skeleton variant="text" width="40%" height={30} />
          ) : (
            <Typography variant="body1" sx={{ mt: 1 }}>
              <span
                style={{
                  textDecoration: "line-through",
                  color: "text.secondary",
                  marginRight: "8px",
                }}
              >
                ${course.priceBeforeDiscount || "50.00"}
              </span>
              <span style={{ fontWeight: "bold", color: "primary.main" }}>
                ${course.priceAfterDiscount || "39.99"}
              </span>
            </Typography>
          )}
        </CardContent>

        {loading ? (
          <Skeleton
            variant="rectangular"
            height={30}
            width="60%"
            sx={{ mx: 2 }}
          />
        ) : (
          <Rating name="read-only" value={4} readOnly sx={{ my: 0 }} />
        )}

        <CardActions sx={{ marginBlock: 1 }}>
          <Button
            size="small"
            onClick={() => navigate(`/coursedetails/${course._id}`)}
            sx={{ color: "primary.main" }}
            disabled={loading}
          >
            {loading ? "Loading..." : "View Details"}
          </Button>
        </CardActions>
      </Card>
    </Grid2>
  );
}

export default CoursesCard;
