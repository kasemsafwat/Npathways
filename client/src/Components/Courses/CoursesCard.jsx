import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function CoursesCard({ course }) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const userId = localStorage.getItem("userId");
        console.log("User ID:", userId);
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
    <Grid item key={course._id} xs={12} sm={6} md={4}>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            {course.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {course.description}
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
            Instructors:
          </Typography>
          {course.instructors.length > 0 ? (
            <List dense>
              {course.instructors.map((instructor, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {instructor.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={instructor.name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No instructors assigned.
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleEnroll}
            disabled={isEnrolled}
          >
            {isEnrolled ? "Enrolled" : "Enroll In"}
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default CoursesCard;
