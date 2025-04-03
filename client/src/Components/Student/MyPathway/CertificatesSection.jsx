import { Stack, Typography } from "@mui/material";
import React from "react";
import CourseCard from "./CourseCard";
import bimManagerImage from "../../../assets/bim-manager.jpeg";
export default function CertificatesSection() {
  return (
    <>
      <Typography fontWeight={"bold"} my={2}>
        Certificates
      </Typography>
      <Stack flexWrap="wrap" flexDirection={"row"} gap={2}>
        <CourseCard
          title="Certificate Title"
          image={bimManagerImage}
          time="11:00 PM 29/03/2030"
        />
        <CourseCard
          title="Certificate Title"
          image={bimManagerImage}
          time="11:00 PM 29/03/2030"
        />
      </Stack>
    </>
  );
}
