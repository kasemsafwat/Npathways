import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        bgcolor: "#0B162C",
        color: "primary.contrastText",
        py: 6,
        mt: "auto", // This helps with the flex layout
        width: "100%",
      }}
      component="footer"
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              NPathways
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Empowering learners through personalized educational pathways.
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EmailIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">contact@npathways.com</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">+1 (555) 123-4567</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LocationIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                123 Education Ave, Learning City
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                sx={{ mb: 1 }}
              >
                Home
              </Link>
              <Link
                component={RouterLink}
                to="/courses"
                color="inherit"
                sx={{ mb: 1 }}
              >
                Courses
              </Link>
              <Link
                component={RouterLink}
                to="/terms-and-conditions"
                color="inherit"
                sx={{ mb: 1 }}
              >
                Terms & Conditions
              </Link>
              <Link
                component={RouterLink}
                to="/enrollment/Welcome"
                color="inherit"
              >
                Enrollment
              </Link>
            </Box>
          </Grid>

          {/* Connect */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Subscribe to our newsletter for updates on new courses and
              features.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, bgcolor: "rgba(255, 255, 255, 0.2)" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "center" : "flex-start",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} NPathways. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: isMobile ? 2 : 0,
            }}
          >
            <Link
              component={RouterLink}
              to="/terms-and-conditions"
              color="inherit"
              variant="body2"
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms-and-conditions"
              color="inherit"
              variant="body2"
            >
              Terms of Use
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
