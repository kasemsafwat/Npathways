import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import EnrollmentStep from "../../Components/Student/MyPathway/EnrollmentStep";
import EnrollmentSection from "../../Components/Student/MyPathway/EnrollmentSection";
import PathwaySection from "../../Components/Student/MyPathway/PathwaySection";
import CourseSection from "../../Components/Student/MyPathway/CourseSection";
import CertificatesSection from "../../Components/Student/MyPathway/CertificatesSection";
import ProfileSection from "../../Components/Student/MyPathway/ProfileSection";

export default function MyPathway() {
  return (
    <>
      <Container sx={{ my: 4 }}>
        <Typography variant="h4" px={4} fontWeight={"bold"}>
          My Pathway
        </Typography>
        <Stack
          flexDirection={"row"}
          px={4}
          mt={2}
          justifyContent={"space-between"}
        >
          <Typography fontWeight={"bold"}>Enrollment</Typography>
          <Typography color="text.gray">Pathway</Typography>
          <Typography color="text.gray">Courses</Typography>
          <Typography color="text.gray">Certificates</Typography>
          <Typography color="text.gray">Profile</Typography>
        </Stack>
        <Divider
          orientation="horizontal"
          flexItem
          sx={{ border: 1, mx: 4, my: 1, borderColor: "text.primary" }}
        ></Divider>
        <Box pl={6} pr={4} mt={2}>
          {/* <EnrollmentSection /> */}
          {/* <PathwaySection /> */}
          {/* <CourseSection /> */}
          {/* <CertificatesSection /> */}
          <ProfileSection />
        </Box>
      </Container>
    </>
  );
}
