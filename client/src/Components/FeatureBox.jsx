import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";

const FeatureBox = ({ image, title, description }) => {
  return (
    <Box sx={{ width: 390, height: 331 }}>
      <Card
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: 2,
        }}
      >
        <CardMedia
          component="img"
          image={image}
          alt="Feature icon"
          sx={{
            width: 150, // Set a fixed width
            height: 150, // Set a fixed height
            objectFit: "cover",
            mt: 2,
            mb: 2,
          }}
        />

        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 0,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins, Helvetica",
              fontWeight: 500,
              fontSize: "1.25rem",
              lineHeight: "30px",
              letterSpacing: "-0.22px",
              mb: 4,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontFamily: "Poppins, Helvetica",
              fontWeight: 500,
              color: "#757575",
              fontSize: "0.875rem",
              lineHeight: "21px",
              letterSpacing: "-0.15px",
              textAlign: "center",
              maxWidth: 297,
              mb: 4,
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeatureBox;
