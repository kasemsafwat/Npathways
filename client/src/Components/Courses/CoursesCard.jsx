import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import image from "../../assets/Rectangle 72.png";

function CoursesCard({ course }) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();

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
    }
  };

  return (
    <Grid item xs={12} sm={6} md={3} key={course._id}>
      <Card
        sx={{
          height: "", // You can set a fixed height here if needed
          display: "flex",
          flexDirection: "column",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <CardMedia
          component="img"
          alt={course.name}
          image={course.image}
          sx={{ objectFit: "cover", borderRadius: "30px" }}
        />

        <CardContent>
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

          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 1 }}>
            Instructors:
          </Typography>
          {course.instructors && course.instructors.length > 0 ? (
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
        </CardContent>

        <Rating name="read-only" value={4} readOnly sx={{ my: 0 }} />
        <CardActions sx={{ marginBlock: 1 }}>
          {/* <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleEnroll}
            disabled={isEnrolled}
          >
            {isEnrolled ? "Enrolled" : "Enroll In"}
          </Button> */}
          <Button
            size="small"
            onClick={() => navigate(`/coursedetails/${course._id}`)}
            sx={{ color: "primary.main" }}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default CoursesCard;
