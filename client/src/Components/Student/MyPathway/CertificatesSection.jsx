import { Stack, Typography, CircularProgress } from "@mui/material";
import React from "react";
import CourseCard from "./CourseCard";
import bimManagerImage from "../../../assets/bim-manager.jpeg";
import certificateImage from "/Certification.jpg";
import axios from "axios";

export default function CertificatesSection() {
  const [certificates, setCertificates] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5024/api/certificate/userCertificates",
          {
            withCredentials: true,
          }
        );
        setCertificates(response.data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="200px">
        <CircularProgress />
      </Stack>
    );
  }

  if (certificates.length === 0) {
    return (
      <Typography align="center" my={2}>
        No certificates found
      </Typography>
    );
  }

  return (
    <>
      <Typography fontWeight={"bold"} my={2}>
        Certificates
      </Typography>
      <Stack flexWrap="wrap" flexDirection={"row"} gap={2}>
        {certificates.map((certificate) => {
          // Format the date to a more readable format
          const formattedDate = new Date(
            certificate.acquiredAt
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <CourseCard
              key={certificate._id}
              title={certificate.name}
              image={certificateImage}
              time={formattedDate}
            />
          );
        })}
      </Stack>
    </>
  );
}
