import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Avatar,
  Card,
  CardContent,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "BIM Coordinator at Foster + Partners",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5,
    quote:
      "NPathways transformed my career. The personalized learning path helped me fill knowledge gaps and gain the confidence to pursue senior roles.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Digital Construction Manager",
    avatar: "https://randomuser.me/api/portraits/men/26.jpg",
    rating: 5,
    quote:
      "The practical exercises and industry-standard workflows taught in these courses gave me an edge in implementing BIM processes for large-scale projects.",
  },
  {
    id: 3,
    name: "Aisha Patel",
    role: "Architectural Technologist",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.5,
    quote:
      "NPathways certification helped me stand out in job interviews. The pathway approach ensured I built the right skills in the right order.",
  },
];

const TestimonialsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      }}
      component="section"
      aria-labelledby="testimonials-title"
    >
      {/* Background Elements */}
      <Box
        sx={{
          position: "absolute",
          width: "400px",
          height: "400px",
          backgroundColor: "#EEF7FD",
          borderRadius: "50%",
          top: "-200px",
          left: "-200px",
          opacity: 0.6,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {/* Section Title */}
          <Typography
            id="testimonials-title"
            component={motion.h2}
            variants={itemVariants}
            variant="h2"
            align="center"
            sx={{
              mb: { xs: 2, md: 3 },
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.75rem" },
              color: "#0B162C",
            }}
          >
            What Our Students Say
          </Typography>

          {/* Section Description */}
          <Typography
            component={motion.p}
            variants={itemVariants}
            variant="h6"
            align="center"
            sx={{
              mb: 6,
              color: "#5B5B5B",
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.6,
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.125rem" },
            }}
          >
            Hear from professionals who transformed their careers through our
            personalized learning pathways
          </Typography>

          {/* Testimonial Cards */}
          <Grid container spacing={4}>
            {testimonials.map((testimonial) => (
              <Grid
                item
                xs={12}
                md={4}
                key={testimonial.id}
                component={motion.div}
                variants={itemVariants}
              >
                <Card
                  elevation={1}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    p: 1,
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 3, color: "#46c98b" }}>
                      <FormatQuoteIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        mb: 4,
                        fontStyle: "italic",
                        lineHeight: 1.6,
                        color: "#333",
                        flex: 1,
                      }}
                    >
                      &ldquo;{testimonial.quote}&rdquo;
                    </Typography>

                    <Box
                      sx={{ display: "flex", alignItems: "center", mt: "auto" }}
                    >
                      <Avatar
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                        <Rating
                          value={testimonial.rating}
                          precision={0.5}
                          readOnly
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
