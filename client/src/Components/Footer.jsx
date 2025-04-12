import React, { useState } from "react";
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
  TextField,
  Button,
  Snackbar,
  Alert,
  Tooltip,
  Paper,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  HelpOutline as HelpOutlineIcon,
  Article as ArticleIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

// Styled components
const FooterLink = styled(Link)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.8),
  textDecoration: "none",
  marginBottom: theme.spacing(1.5),
  display: "flex",
  alignItems: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    color: theme.palette.common.white,
    transform: "translateX(4px)",
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.8),
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  margin: theme.spacing(0.5),
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    transform: "translateY(-4px)",
    color: theme.palette.common.white,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
}));

const NewsletterTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#46c98b",
    },
    borderRadius: "100px",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
});

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(to right, #46c98b, #3AB07A)",
  color: "white",
  fontWeight: 600,
  borderRadius: "100px",
  textTransform: "none",
  boxShadow: "0 4px 10px rgba(70, 201, 139, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(to right, #3AB07A, #2D8C62)",
    boxShadow: "0 6px 14px rgba(70, 201, 139, 0.3)",
    transform: "translateY(-2px)",
  },
}));

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
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

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [email, setEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();

    // Email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setSnackbarMessage("Please enter a valid email address");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Success case - would normally send to API
    setSnackbarMessage("Thank you for subscribing to our newsletter!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setEmail("");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    {
      title: "Home",
      path: "/",
      icon: <HomeIcon fontSize="small" sx={{ mr: 1 }} />,
    },
    {
      title: "How It Works",
      path: "/how-it-works",
      icon: <HelpOutlineIcon fontSize="small" sx={{ mr: 1 }} />,
    },
    {
      title: "Courses",
      path: "/courses",
      icon: <SchoolIcon fontSize="small" sx={{ mr: 1 }} />,
    },
    {
      title: "Enrollment",
      path: "/enrollment/Welcome",
      icon: <ArticleIcon fontSize="small" sx={{ mr: 1 }} />,
    },
  ];

  const companyLinks = [
    { title: "About Us", path: "/about-us" },
    { title: "Contact Us", path: "/contact" },
    { title: "Blog", path: "/blog" },
    { title: "Careers", path: "/careers" },
  ];

  const legalLinks = [
    { title: "Privacy Policy", path: "/privacy-policy" },
    { title: "Terms of Use", path: "/terms-and-conditions" },
    { title: "Cookie Policy", path: "/cookie-policy" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0B162C",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(70, 201, 139, 0.08) 0%, rgba(70, 201, 139, 0) 70%)",
          top: "-200px",
          right: "-100px",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.03)",
          bottom: "-150px",
          left: "-150px",
          zIndex: 0,
        }}
      />

      {/* Main footer content */}
      <Container
        maxWidth="lg"
        component={motion.div}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        sx={{ position: "relative", zIndex: 1, py: { xs: 5, md: 8 } }}
      >
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid
            item
            xs={12}
            md={4}
            component={motion.div}
            variants={itemVariants}
          >
            <Box sx={{ mb: 3 }}>
              <Box
                component="img"
                src="/pathways_chiropractic-removebg-preview.png" // Update with your logo path
                alt="NPathways Logo"
                sx={{
                  height: 60,
                  mb: 2,
                }}
              />
              <Typography
                variant="body2"
                sx={{ opacity: 0.8, mb: 3, maxWidth: 300 }}
              >
                Empowering learners through personalized educational pathways in
                Building Information Modeling (BIM) and digital construction
                technologies.
              </Typography>
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Contact Information
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <EmailIcon fontSize="small" sx={{ mr: 1.5, opacity: 0.7 }} />
              <Link
                href="mailto:contact@npathways.com"
                color="inherit"
                sx={{
                  opacity: 0.8,
                  textDecoration: "none",
                  "&:hover": { opacity: 1 },
                }}
              >
                contact@npathways.com
              </Link>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <PhoneIcon fontSize="small" sx={{ mr: 1.5, opacity: 0.7 }} />
              <Link
                href="tel:+15551234567"
                color="inherit"
                sx={{
                  opacity: 0.8,
                  textDecoration: "none",
                  "&:hover": { opacity: 1 },
                }}
              >
                +1 (555) 123-4567
              </Link>
            </Box>

            <Box sx={{ display: "flex", mb: 1.5 }}>
              <LocationIcon
                fontSize="small"
                sx={{ mr: 1.5, opacity: 0.7, mt: 0.3 }}
              />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                123 Education Ave, Learning City,
                <br />
                CA 90210, United States
              </Typography>
            </Box>

            {/* Social Media */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Follow Us
              </Typography>
              <Box>
                <Tooltip title="Facebook">
                  <SocialButton aria-label="Facebook">
                    <FacebookIcon />
                  </SocialButton>
                </Tooltip>
                <Tooltip title="Twitter">
                  <SocialButton aria-label="Twitter">
                    <TwitterIcon />
                  </SocialButton>
                </Tooltip>
                <Tooltip title="Instagram">
                  <SocialButton aria-label="Instagram">
                    <InstagramIcon />
                  </SocialButton>
                </Tooltip>
                <Tooltip title="LinkedIn">
                  <SocialButton aria-label="LinkedIn">
                    <LinkedInIcon />
                  </SocialButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid
            item
            xs={12}
            sm={6}
            md={2}
            component={motion.div}
            variants={itemVariants}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {quickLinks.map((link) => (
                <FooterLink
                  key={link.title}
                  component={RouterLink}
                  to={link.path}
                  underline="none"
                >
                  {link.icon}
                  {link.title}
                </FooterLink>
              ))}
            </Box>
          </Grid>

          {/* Company */}
          <Grid
            item
            xs={12}
            sm={6}
            md={2}
            component={motion.div}
            variants={itemVariants}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
              Company
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {companyLinks.map((link) => (
                <FooterLink
                  key={link.title}
                  component={RouterLink}
                  to={link.path}
                  underline="none"
                >
                  {link.title}
                </FooterLink>
              ))}
            </Box>
          </Grid>

          {/* Legal */}
          <Grid
            item
            xs={12}
            sm={6}
            md={2}
            component={motion.div}
            variants={itemVariants}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
              Legal
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {legalLinks.map((link) => (
                <FooterLink
                  key={link.title}
                  component={RouterLink}
                  to={link.path}
                  underline="none"
                >
                  {link.title}
                </FooterLink>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: alpha("#ffff", 0.1) }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", md: "center" },
            textAlign: { xs: "center", md: "left" },
          }}
          component={motion.div}
          variants={itemVariants}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {currentYear} NPathways. All rights reserved.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: { xs: 3, md: 4 },
              mt: { xs: 2, md: 0 },
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link
              component={RouterLink}
              to="/sitemap"
              color="inherit"
              underline="hover"
              variant="body2"
              sx={{ opacity: 0.7 }}
            >
              Sitemap
            </Link>
            <Link
              component={RouterLink}
              to="/accessibility"
              color="inherit"
              underline="hover"
              variant="body2"
              sx={{ opacity: 0.7 }}
            >
              Accessibility
            </Link>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Made with ♥ by HazemMahhmoudSohilaKasemAboSaeed
            </Typography>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Footer;
