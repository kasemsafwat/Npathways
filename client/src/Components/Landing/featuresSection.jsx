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

import Certification from "/Certification.jpg";
import illustration from "../../assets/illustration.avif";
import BIM from "../../assets/BIM.jpg";
import FeatureBox from "../FeatureBox";

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
    <Box sx={{ py: 8, backgroundColor: "#F9F9F9" }}>
      <Container>
        {/* make it rounded 30 */}
        <Box
          sx={{
            backgroundColor: "#F0F0F0",
            py: 1.2,
            mb: 4,
            textAlign: "center",
            maxWidth: "200px", // Added maxWidth to make the box smaller
            mx: "auto", // Center the box horizontally
            // Make the box rounded
            borderRadius: "30px",
          }}
        >
          <Typography
            variant="h6"
            component="h4"
            sx={{ color: "#5B5B5B", fontWeight: "bold" }}
          >
            Features
          </Typography>
        </Box>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          Why Choose NPathways?
        </Typography>
        <Typography
          variant="h6"
          component="p"
          align="center"
          sx={{ mb: 4, color: "#5B5B5B" }}
        >
          At NPathways, we don't just offer courses — we design your entire
          learning journey, guiding you from self-discovery to industry-ready
          expertise in digital construction.
        </Typography>
        <Grid container spacing={20}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  minHeight: "300px", // BOX SIZE
                  minWidth: "400px", // BOX SIZE
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: feature.backgroundColor,
                  borderRadius: "20px", // Make the card rounded
                  mx: 4, // Add horizontal margin
                  boxShadow: 3, // Add subtle shadow for better separation
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
