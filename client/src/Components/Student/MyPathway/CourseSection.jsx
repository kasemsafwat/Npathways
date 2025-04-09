import { Divider, Stack, Typography, CircularProgress } from "@mui/material";
import React from "react";
import CourseCard from "./CourseCard";
import bimManagerImage from "../../../assets/bim-manager.jpeg";
import axios from "axios";

export default function CourseSection() {
  const [enrolledCourses, setEnrolledCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5024/api/course/enrolledCourses",
          {
            withCredentials: true,
          }
        );
        setEnrolledCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="200px">
        <CircularProgress />
      </Stack>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <Typography align="center" my={2}>
        No standalone courses found
      </Typography>
    );
  }

  return (
    <>
      <Typography fontWeight={"bold"} my={2}>
        Stand Alone Courses
      </Typography>
      <Stack flexWrap="wrap" flexDirection={"row"} gap={2}>
        {enrolledCourses.map((course) => (
          <CourseCard
            key={course._id}
            title={course.name}
            image={course.image || bimManagerImage}
            time={course.time}
          />
        ))}
      </Stack>
    </>
  );
}
