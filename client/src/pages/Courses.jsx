import React, { useEffect, useState } from "react";
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Grid2 as Grid,
} from "@mui/material";
import axios from "axios";
import CoursesCard from "../Components/Courses/CoursesCard";

function Courses() {
  const [alignment, setAlignment] = React.useState("web");
  const [courses, setCourses] = useState([]);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5024/api/course/");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="web">Courses</ToggleButton>
          <ToggleButton value="android">Pathway</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3} sx={{ padding: 3 }}>
        {courses.map((course) => (
          <CoursesCard key={course.id} course={course} />
        ))}
      </Grid>
    </Box>
  );
}

export default Courses;
