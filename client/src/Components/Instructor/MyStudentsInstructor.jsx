import { Avatar, CircularProgress, Grid2, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function MyStudentsInstructor() {
  const [isLoading, setIsLoading] = useState(false);
  //! Replace with API call
  const [students, setStudents] = useState([]);
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5024/api/instructor/getUsersInCourse",
          {
            withCredentials: true,
          }
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <>
      <Grid2
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 2, px: 0 }}
      >
        <Grid2 item textAlign="center" size={1}>
          <Typography sx={{ color: "text.gray" }}>Picture</Typography>
        </Grid2>
        <Grid2 item textAlign="center" size={5}>
          <Typography sx={{ color: "text.gray" }}>Name</Typography>
        </Grid2>
        <Grid2 item textAlign="center" size={5}>
          <Typography sx={{ color: "text.gray" }}>Course Name</Typography>
        </Grid2>
        <Grid2 item textAlign="center" size={1}>
          <Typography sx={{ color: "text.gray" }}>Grade</Typography>
        </Grid2>
      </Grid2>

      {isLoading && (
        <Grid2
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: 1, px: 0 }}
        >
          <Grid2 item textAlign="center" size={12}>
            <CircularProgress />
          </Grid2>
        </Grid2>
      )}

      {!isLoading && students.length === 0 && (
        <Grid2
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: 1, px: 0 }}
        >
          <Grid2 item textAlign="center" size={12}>
            <Typography>No students found</Typography>
          </Grid2>
        </Grid2>
      )}

      {!isLoading &&
        students.length > 0 &&
        students.map((student) => (
          <Grid2
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: 1, px: 0 }}
            key={student.id}
          >
            <Grid2 item textAlign="center" size={1}>
              <Avatar
                src={
                  student.image
                    ? student.image
                    : `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=random&size=40`
                }
                alt={`${student.firstName} ${student.lastName}`}
                sx={{ width: 40, height: 40, margin: "0 auto" }}
              >
                {student.firstName[0] + student.lastName[0]}
              </Avatar>
            </Grid2>
            <Grid2 item textAlign="center" size={5}>
              <Typography>{`${student.firstName} ${student.lastName}`}</Typography>
            </Grid2>
            <Grid2 item textAlign="center" size={5}>
              <Typography>{student.courseNames}</Typography>
            </Grid2>
            <Grid2 item textAlign="center" size={1}>
              <Typography>100%</Typography>
            </Grid2>
          </Grid2>
        ))}
    </>
  );
}
