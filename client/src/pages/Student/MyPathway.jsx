import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import EnrollmentStep from "../../Components/Student/MyPathway/EnrollmentStep";
import EnrollmentSection from "../../Components/Student/MyPathway/EnrollmentSection";
import PathwaySection from "../../Components/Student/MyPathway/PathwaySection";
import CourseSection from "../../Components/Student/MyPathway/CourseSection";
import CertificatesSection from "../../Components/Student/MyPathway/CertificatesSection";
import ProfileSection from "../../Components/Student/MyPathway/ProfileSection";
import { AuthContext } from "../../contexts/AuthContext";

export default function MyPathway() {
  const { isEnrolled } = useContext(AuthContext);
  const [tap, setTap] = useState("enrollment");
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
          <Typography
            color={tap === "enrollment" ? "text.primary" : "text.gray"}
            onClick={() => setTap("enrollment")}
            sx={{ cursor: "pointer" }}
          >
            Enrollment
          </Typography>
          <Typography
            color={tap === "pathway" ? "text.primary" : "text.gray"}
            onClick={() => setTap("pathway")}
            sx={{ cursor: "pointer" }}
          >
            Pathway
          </Typography>
          <Typography
            color={tap === "courses" ? "text.primary" : "text.gray"}
            onClick={() => setTap("courses")}
            sx={{ cursor: "pointer" }}
          >
            Courses
          </Typography>
          <Typography
            color={tap === "certificates" ? "text.primary" : "text.gray"}
            onClick={() => setTap("certificates")}
            sx={{ cursor: "pointer" }}
          >
            Certificates
          </Typography>
          <Typography
            color={tap === "profile" ? "text.primary" : "text.gray"}
            onClick={() => setTap("profile")}
            sx={{ cursor: "pointer" }}
          >
            Profile
          </Typography>
        </Stack>
        <Divider
          orientation="horizontal"
          flexItem
          sx={{ border: 1, mx: 4, my: 1, borderColor: "text.primary" }}
        ></Divider>
        <Box pl={6} pr={4} mt={2}>
          {tap === "enrollment" && <EnrollmentSection />}
          {tap === "pathway" &&
            (isEnrolled ? (
              <PathwaySection />
            ) : (
              <>
                <Typography>Please finish your enrollment first</Typography>
                <Button onClick={() => setTap("enrollment")}>Enrollment</Button>
              </>
            ))}
          {tap === "courses" && <CourseSection />}
          {tap === "certificates" && <CertificatesSection />}
          {tap === "profile" && <ProfileSection />}
        </Box>
      </Container>
    </>
  );
}
