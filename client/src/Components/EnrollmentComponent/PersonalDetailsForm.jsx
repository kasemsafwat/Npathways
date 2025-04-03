import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Box,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomStepper from "./CustomStepper";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function PersonalDetailsForm() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Step 1", "Step 2", "Step 3"];

  const [expandedSections, setExpandedSections] = useState({
    personalDetails: false,
    motivationLetter: false,
    contactInfo: false,
    address: false,
    faculty: false,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    email: "",
    phone: "",
    motivationLetter: "",
    country: "",
    city: "",
    street: "",
    faculty: "",
    GPA: "",
  });

  const handleToggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#181B21" },
      "&:hover fieldset": { borderColor: "#181B21" },
      "&.Mui-focused fieldset": { borderColor: "#181B21" },
    },
  };
  const sectionHeaderStyles = {
    backgroundColor: "#181B21",
    padding: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const sectionTitleStyles = {
    color: "#46C98B",
  };

  const iconButtonStyles = (expanded) => ({
    color: "#46C98B",
    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.3s ease",
  });
  const FormSection = ({ title, name, expanded, children }) => (
    <Box sx={{ border: "1px solid #181B21", borderRadius: "4px", mt: 1 }}>
      <Box sx={sectionHeaderStyles}>
        <Typography variant="h6" gutterBottom sx={sectionTitleStyles}>
          {title}
        </Typography>
        <IconButton onClick={() => handleToggleSection(name)}>
          <ExpandMoreIcon sx={iconButtonStyles(expanded)} />
        </IconButton>
      </Box>
      {expanded && <Box sx={{ padding: 2 }}>{children}</Box>}
    </Box>
  );
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h5"
        gutterBottom
        color="#46C98B"
        sx={{
          fontSize: {
            xs: "1.2rem",
            sm: "1.5rem",
            md: "2rem",
            lg: "2.5rem",
            xl: "3rem",
          },
        }}
      >
        Personal Details and Motivation
      </Typography>

      <CustomStepper activeStep={activeStep} steps={steps} />

      <FormSection
        title="Personal Details *"
        name="personalDetails"
        expanded={expandedSections.personalDetails}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name *"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              variant="outlined"
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name *"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              variant="outlined"
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              label="Date of Birth *"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={inputStyles}>
              <InputLabel>Nationality *</InputLabel>
              <Select
                label="Nationality *"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
              >
                <MenuItem value="">Select Nationality</MenuItem>
                <MenuItem value="American">American</MenuItem>
                <MenuItem value="Canadian">Canadian</MenuItem>
                <MenuItem value="British">British</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </FormSection>

      <FormSection
        title="Contact Information *"
        name="contactInfo"
        expanded={expandedSections.contactInfo}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email *"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number *"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
              sx={inputStyles}
            />
          </Grid>
        </Grid>
      </FormSection>

      <FormSection
        title="Address *"
        name="address"
        expanded={expandedSections.address}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Country *"
              name="country"
              value={formData.country}
              onChange={handleChange}
              variant="outlined"
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="City *"
              name="city"
              value={formData.city}
              onChange={handleChange}
              variant="outlined"
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street *"
              name="street"
              value={formData.street}
              onChange={handleChange}
              variant="outlined"
              sx={inputStyles}
            />
          </Grid>
        </Grid>
      </FormSection>

      <FormSection
        title="Faculty *"
        name="faculty"
        expanded={expandedSections.faculty}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={inputStyles}>
              <InputLabel>Faculty Name *</InputLabel>
              <Select
                label="Faculty Name *"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
              >
                <MenuItem value="">Select Faculty</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="Arts">Arts</MenuItem>
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Mathematics">Mathematics</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="GPA *"
              name="GPA"
              type="number"
              value={formData.GPA}
              onChange={handleChange}
              variant="outlined"
              sx={inputStyles}
            />
          </Grid>
        </Grid>
      </FormSection>

      <FormSection
        title="Motivation Letter *"
        name="motivationLetter"
        expanded={expandedSections.motivationLetter}
      >
        <TextField
          fullWidth
          multiline
          rows={4}
          label="I aspire to become the best and most successful in my field..."
          name="motivationLetter"
          value={formData.motivationLetter}
          onChange={handleChange}
          variant="outlined"
          sx={inputStyles}
        />
      </FormSection>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate("/enrollment/Welcome")}
        >
          <ArrowBackIcon sx={{ mr: 1 }} /> Prev
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/enrollment/entryExam")}
        >
          Next Step <ArrowForwardIcon sx={{ ml: 1 }} />
        </Button>
      </Box>
    </Container>
  );
}

export default PersonalDetailsForm;
