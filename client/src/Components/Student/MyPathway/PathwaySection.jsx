import { Divider, Stack, Typography } from "@mui/material";
import React from "react";
import bimManagerImage from "../../../assets/bim-manager.jpeg";
import CourseCard from "./CourseCard";

export default function PathwaySection() {
  // Import image

  return (
    <>
      <Typography fontWeight={"bold"} my={2}>
        PathwayName: In Progress
      </Typography>
      <Stack flexWrap="wrap" flexDirection={"row"} gap={2}>
        <CourseCard
          title="title"
          image={bimManagerImage}
          status="In Progress"
        />
      </Stack>
      <Divider
        orientation="horizontal"
        flexItem
        sx={{ border: 1, my: 4, borderColor: "text.primary" }}
      ></Divider>
      <Typography fontWeight={"bold"} my={2}>
        PathwayName: Locked
      </Typography>
      <Stack flexWrap="wrap" flexDirection={"row"} gap={2}>
        <CourseCard title="title" image={bimManagerImage} status="Locked" />
        <CourseCard title="title" image={bimManagerImage} status="Locked" />
      </Stack>
      <Divider
        orientation="horizontal"
        flexItem
        sx={{ border: 1, my: 4, borderColor: "text.primary" }}
      ></Divider>
      <Typography fontWeight={"bold"} my={2}>
        Completed
      </Typography>
      <Stack flexWrap="wrap" flexDirection={"row"} gap={2}>
        <CourseCard
          title="title"
          image={bimManagerImage}
          status="Completed"
          time="11:00 PM 29/03/2030"
        />
        <CourseCard
          title="title"
          image={bimManagerImage}
          status="Completed"
          time="11:00 PM 29/03/2030"
        />
        <CourseCard
          title="title"
          image={bimManagerImage}
          status="Completed"
          time="11:00 PM 29/03/2030"
        />
        <CourseCard
          title="title"
          image={bimManagerImage}
          status="Completed"
          time="11:00 PM 29/03/2030"
        />
      </Stack>
    </>
  );
}
