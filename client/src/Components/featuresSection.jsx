import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
} from "@mui/material";

import Certification from "../assets/Certification.jpg";
import illustration from "../assets/illustration.avif";
import BIM from "../assets/BIM.jpg";

const FeaturesSection = () => {
  const features = [
    {
      image: BIM,
      header: "From BIM fundamentals to advanced management techniques",
      backgroundColor: "#DBEDF5",
      textColor: "#1D4645",
    },
    {
      image: illustration,
      header:
        "Access expert-led tutorials, real-world case studies, and hands-on projects.",
      backgroundColor: "#102F2E",
      textColor: "#FFFFFF",
    },
    {
      image: Certification,
      header: "Get certified and stand out in the competitive BIM industry",
      backgroundColor: "#FEF1E2",
      textColor: "#1D4645",
    },
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: "#4A3AFF" }}>
      <Container>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  minHeight: "300px", // BOX SIZE
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: feature.backgroundColor,
                }}
              >
                <CardMedia
                  component="img"
                  image={feature.image}
                  alt={feature.header}
                  sx={{ width: "100%", height: "200px", objectFit: "cover" }} // Increased height
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    component="h3"
                    align="center"
                    sx={{ color: feature.textColor, fontWeight: "bold" }}
                  >
                    {feature.header}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
