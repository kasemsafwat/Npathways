import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Paper,
  LinearProgress,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Fade,
  Tooltip,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import GavelIcon from "@mui/icons-material/Gavel";
import HomeIcon from "@mui/icons-material/Home";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const TermsSection = styled(Box)(({ theme }) => ({
  height: "60vh",
  overflowY: "auto",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  position: "relative",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.default,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.primary.light,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: theme.palette.primary.main,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 6,
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  boxShadow: theme.shadows[2],
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[4],
    transform: "translateY(-2px)",
  },
}));

const TermsAndConditions = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readComplete, setReadComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Handle scroll progress
  const handleScroll = (e) => {
    const element = e.target;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight - element.clientHeight;

    // Calculate scroll percentage
    const progress = (scrollTop / scrollHeight) * 100;
    setScrollProgress(progress);

    // Mark as read when scrolled to bottom (or close to it)
    if (progress > 95) {
      setReadComplete(true);
    }
  };

  // Copy terms text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(document.getElementById("terms-content").innerText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back button */}
        <Box sx={{ mb: 3 }}>
          <Tooltip title="Back to home">
            <IconButton
              onClick={() => navigate("/")}
              aria-label="Back to home"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <StyledPaper elevation={0}>
          {/* Decorative elements */}
          <Box
            sx={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 150,
              height: 150,
              borderRadius: "50%",
              bgcolor: "primary.light",
              opacity: 0.1,
              zIndex: 0,
            }}
          />

          <Box position="relative" zIndex={1}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 3,
              }}
            >
              <GavelIcon color="primary" fontSize="large" />
              <Typography
                variant={isMobile ? "h4" : "h3"}
                component="h1"
                align="center"
                fontWeight={700}
                color="text.primary"
                gutterBottom
              >
                Terms & Conditions
              </Typography>
            </Box>

            <Typography
              variant="subtitle1"
              align="center"
              color="text.secondary"
              paragraph
            >
              The following terms and conditions govern your use of our
              platform. Please read them carefully before proceeding.
            </Typography>

            {/* Terms content */}
            <TermsSection
              onScroll={handleScroll}
              aria-label="Terms and conditions content"
            >
              <Box id="terms-content">
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  1. Introduction
                </Typography>
                <Typography variant="body2" paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Typography>

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  2. Definitions
                </Typography>
                <Typography variant="body2" paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Typography>

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  3. Account Registration
                </Typography>
                <Typography variant="body2" paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Typography>

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  4. User Conduct
                </Typography>
                <Typography variant="body2" paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Typography>

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  5. Intellectual Property
                </Typography>
                <Typography variant="body2" paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Typography>

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  6. Limitation of Liability
                </Typography>
                <Typography variant="body2" paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Typography>

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  7. Termination
                </Typography>
                <Typography variant="body2" paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Typography>

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  8. Changes to Terms
                </Typography>
                <Typography variant="body2" paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Typography>

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  9. Governing Law
                </Typography>
                <Typography variant="body2" paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Typography>

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  10. Contact Information
                </Typography>
                <Typography variant="body2" paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </Typography>
              </Box>
            </TermsSection>

            {/* Progress indicator */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Scroll progress
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {Math.round(scrollProgress)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={scrollProgress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                  },
                }}
              />
            </Box>

            {/* Return to homepage button */}
            <Box sx={{ textAlign: "center", mt: 4, mb: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <ActionButton
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate("/")}
                  startIcon={<HomeIcon />}
                >
                  Return to Homepage
                </ActionButton>
              </motion.div>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Last updated: April 12, 2025
              </Typography>
              <Tooltip title={copied ? "Copied!" : "Copy text"}>
                <IconButton
                  size="small"
                  onClick={copyToClipboard}
                  aria-label="Copy terms text"
                  color={copied ? "primary" : "default"}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </StyledPaper>
      </motion.div>
    </Container>
  );
};

export default TermsAndConditions;
