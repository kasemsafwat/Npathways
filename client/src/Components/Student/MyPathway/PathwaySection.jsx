import { Divider, Stack, Typography, CircularProgress } from "@mui/material";
import React, { useContext } from "react";
import bimManagerImage from "../../../assets/bim-manager.jpeg";
import CourseCard from "./CourseCard";
import axios from "axios";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../contexts/AuthContext";

export default function PathwaySection() {
  const [pathways, setPathways] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchPathways = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5024/api/pathway/student/userPathway`,
          { withCredentials: true }
        );
        if (response.data.message === "User is not enrolled in any pathways") {
          setPathways([]);
        }
        setPathways(response.data.data);
      } catch (error) {
        console.error("Error fetching pathways:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPathways();
  }, []);
  const courses =
    pathways && pathways.length > 0
      ? pathways.map((pathway) => pathway.courses).flat()
      : [];

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="200px">
        <CircularProgress />
      </Stack>
    );
  }

  if (!pathways || pathways.length === 0) {
    return (
      <Typography align="center" my={2}>
        No pathways found, stay tuned for updates!
      </Typography>
    );
  }

  return (
    <>
      <Typography fontWeight={"bold"} my={2}>
        {pathways[0].name}: In Progress
      </Typography>
      <Stack flexWrap="wrap" flexDirection={"row"} gap={2}>
        {courses && courses.length <= 0 ? (
          <Typography align="center" my={2}>
            No courses found
          </Typography>
        ) : (
          pathways.map((pathways) => (
            <CourseCard
              key={pathways._id}
              title={pathways.name}
              image={bimManagerImage}
              // status={"In Progress"}
              onClick={() => {
                navigate(`/pathway/${pathways._id}`);
              }}
            />
          ))
        )}
      </Stack>
    </>
  );
}
