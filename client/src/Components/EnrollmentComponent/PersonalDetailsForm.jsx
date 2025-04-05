import React, { useContext, useState } from "react";
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
import { EnrollmentContext } from "../../contexts/EnrollmentContext";

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Germany", "France", "Other"];
const NATIONALITIES = ["American", "Canadian", "British", "German", "French", "Other"];
const FACULTIES = ["Science", "Arts", "Engineering", "Mathematics", "Medicine", "Other"];

function PersonalDetailsForm() {
  const { setPersonalDetails } = useContext(EnrollmentContext);
  const navigate = useNavigate();
  const [activeStep] = useState(0);
  const steps = ["Personal Info", "Exam", "Review"];
  const [expandedSections, setExpandedSections] = useState({
    personalDetails: false,
    contactInfo: false,
    address: false,
    faculty: false,
    motivationLetter: false,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    street: "",
    faculty: "",
    GPA: "",
    motivationLetter: "",
  });

  const [errors, setErrors] = useState({});
  const styles = {
    input: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#181B21" },
        "&:hover fieldset": { borderColor: "#181B21" },
        "&.Mui-focused fieldset": { borderColor: "#181B21" },
      },
    },
    sectionHeader: {
      backgroundColor: "#181B21",
      padding: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      cursor: "pointer",
    },
    sectionTitle: {
      color: "#46C98B",
    },
    iconButton: (expanded) => ({
      color: "#46C98B",
      transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.3s ease",
    }),
    formSection: {
      border: "1px solid #181B21",
      borderRadius: "4px",
      marginTop: "16px",
      overflow: "hidden", 
    },
  };

  const handleToggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const FormSection = ({ title, name, expanded, children, required = false }) => (
    <Box sx={styles.formSection}>
      <Box 
        sx={styles.sectionHeader} 
        onClick={() => handleToggleSection(name)}
      >
        <Typography variant="h6" sx={styles.sectionTitle}>
          {title}{required && " *"}
        </Typography>
        <IconButton>
          <ExpandMoreIcon sx={styles.iconButton(expanded)} />
        </IconButton>
      </Box>
      {expanded && <Box sx={{ padding: 2 }}>{children}</Box>}
    </Box>
  );

  const validatePayload = (payload) => {
    const newErrors = {};

    if (!payload.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!payload.lastName?.trim()) newErrors.lastName = "Last name is required";
    if (!payload.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!payload.nationality) newErrors.nationality = "Nationality is required";

    if (!payload.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!payload.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s+-]{8,}$/.test(payload.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (!payload.address?.country?.trim()) newErrors["address.country"] = "Country is required";
    if (!payload.facultyName) newErrors.faculty = "Faculty is required";
    if (isNaN(payload.GPA) || payload.GPA < 0 || payload.GPA > 4) {
      newErrors.GPA = "Please enter a valid GPA (0-4)";
    }
    if (!payload.motivationLetter?.trim()) {
      newErrors.motivationLetter = "Motivation letter is required";
    } else if (payload.motivationLetter.length < 50) {
      newErrors.motivationLetter = "Motivation letter should be at least 50 characters";
    }

    return newErrors;
  };

  const handleNext = () => {
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      email: formData.email,
      phone: formData.phone,
      address: {
        country: formData.country,
        city: formData.city,
        street: formData.street,
      },
      motivationLetter: formData.motivationLetter,
      nationality: formData.nationality,
      facultyName: formData.faculty,
      GPA: formData.GPA ? parseFloat(formData.GPA) : undefined,
    };

    const validationErrors = validatePayload(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      const sectionsWithErrors = {};
      Object.keys(validationErrors).forEach(key => {
        if (key.includes('firstName') || key.includes('lastName') || key.includes('dateOfBirth') || key.includes('nationality')) {
          sectionsWithErrors.personalDetails = true;
        } else if (key.includes('email') || key.includes('phone')) {
          sectionsWithErrors.contactInfo = true;
        } else if (key.includes('address')) {
          sectionsWithErrors.address = true;
        } else if (key.includes('faculty') || key.includes('GPA')) {
          sectionsWithErrors.faculty = true;
        } else if (key.includes('motivationLetter')) {
          sectionsWithErrors.motivationLetter = true;
        }
      });
      
      setExpandedSections(prev => ({
        ...prev,
        ...sectionsWithErrors
      }));
      
      return;
    }

    setErrors({});
    setPersonalDetails(payload);
    navigate("/enrollment/entryExam");
  };

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
        title="Personal Details"
        name="personalDetails"
        expanded={expandedSections.personalDetails}
        required
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
              sx={styles.input}
              error={Boolean(errors.firstName)}
              helperText={errors.firstName}
              autoComplete="given-name"
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
              sx={styles.input}
              error={Boolean(errors.lastName)}
              helperText={errors.lastName}
              autoComplete="family-name"
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
              sx={styles.input}
              error={Boolean(errors.dateOfBirth)}
              helperText={errors.dateOfBirth}
              inputProps={{ max: new Date().toISOString().split('T')[0] }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={styles.input} error={Boolean(errors.nationality)}>
              <InputLabel>Nationality *</InputLabel>
              <Select
                label="Nationality *"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
              >
                {NATIONALITIES.map(nationality => (
                  <MenuItem key={nationality} value={nationality}>
                    {nationality}
                  </MenuItem>
                ))}
              </Select>
              {errors.nationality && (
                <Typography variant="caption" color="error">
                  {errors.nationality}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </FormSection>

      <FormSection
        title="Contact Information"
        name="contactInfo"
        expanded={expandedSections.contactInfo}
        required
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              sx={styles.input}
              error={Boolean(errors.email)}
              helperText={errors.email}
              autoComplete="email"
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
              sx={styles.input}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              autoComplete="tel"
              placeholder="+1234567890"
            />
          </Grid>
        </Grid>
      </FormSection>

      <FormSection
        title="Address"
        name="address"
        expanded={expandedSections.address}
        required
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth sx={styles.input} error={Boolean(errors["address.country"])}>
              <InputLabel>Country *</InputLabel>
              <Select
                label="Country *"
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                {COUNTRIES.map(country => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
              {errors["address.country"] && (
                <Typography variant="caption" color="error">
                  {errors["address.country"]}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              variant="outlined"
              sx={styles.input}
              autoComplete="address-level2"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              variant="outlined"
              sx={styles.input}
              autoComplete="address-line1"
            />
          </Grid>
        </Grid>
      </FormSection>

      <FormSection
        title="Faculty"
        name="faculty"
        expanded={expandedSections.faculty}
        required
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth sx={styles.input} error={Boolean(errors.faculty)}>
              <InputLabel>Faculty Name *</InputLabel>
              <Select
                label="Faculty Name *"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
              >
                {FACULTIES.map(faculty => (
                  <MenuItem key={faculty} value={faculty}>
                    {faculty}
                  </MenuItem>
                ))}
              </Select>
              {errors.faculty && (
                <Typography variant="caption" color="error">
                  {errors.faculty}
                </Typography>
              )}
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
              sx={styles.input}
              error={Boolean(errors.GPA)}
              helperText={errors.GPA || "Enter a value between 0 and 4"}
              inputProps={{ min: 0, max: 4, step: 0.1 }}
            />
          </Grid>
        </Grid>
      </FormSection>

      <FormSection
        title="Motivation Letter"
        name="motivationLetter"
        expanded={expandedSections.motivationLetter}
        required
      >
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={8}
          label="I aspire to become the best and most successful in my field..."
          name="motivationLetter"
          value={formData.motivationLetter}
          onChange={handleChange}
          variant="outlined"
          sx={styles.input}
          error={Boolean(errors.motivationLetter)}
          helperText={errors.motivationLetter || "Minimum 50 characters required"}
        />
      </FormSection>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate("/enrollment/Welcome")}
          startIcon={<ArrowBackIcon />}
        >
          Previous
        </Button>
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleNext}
          endIcon={<ArrowForwardIcon />}
        >
          Next Step
        </Button>
      </Box>
    </Container>
  );
}

export default PersonalDetailsForm;
