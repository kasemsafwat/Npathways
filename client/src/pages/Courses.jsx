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
    <>
      {" "}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 3 }}
      >
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
      <div className="container">
        <div className="row">
          {courses.map((course) => (
            <div className="col-md-3 my-2" key={course._id}>
              <CoursesCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Courses;
