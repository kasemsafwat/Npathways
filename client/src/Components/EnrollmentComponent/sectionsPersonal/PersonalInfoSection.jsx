import React, { useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const NATIONALITIES = [
  "Algeria",
  "Bahrain",
  "Comoros",
  "Djibouti",
  "Egypt",
  "Iraq",
  "Jordan",
  "Kuwait",
  "Lebanon",
  "Libya",
  "Mauritania",
  "Morocco",
  "Oman",
  "Palestine",
  "Qatar",
  "Saudi Arabia",
  "Somalia",
  "Sudan",
  "Syria",
  "Tunisia",
  "United Arab Emirates",
  "Yemen",
];
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
    fontWeight: "bold",
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
const FormSection = ({
  title,
  name,
  expanded,
  handleToggleSection,
  children,
  required = false,
}) => (
  <Box sx={styles.formSection}>
    <Box sx={styles.sectionHeader} onClick={() => handleToggleSection(name)}>
      <Typography variant="h6" sx={styles.sectionTitle}>
        {title}
        {required && " *"}
      </Typography>
      <IconButton>
        <ExpandMoreIcon sx={styles.iconButton(expanded)} />
      </IconButton>
    </Box>
    {expanded && <Box sx={{ padding: 2 }}>{children}</Box>}
  </Box>
);

export default function PersonalInfoSection({
  formData,
  errors,
  handleChange,
}) {
  const [expandedSections, setExpandedSections] = useState({
    personalDetails: true,
  });
  const handleToggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Box>
      <FormSection
        title="Personal Details"
        name="personalDetails"
        expanded={expandedSections.personalDetails}
        handleToggleSection={handleToggleSection}
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
              error={Boolean(errors.firstName)}
              helperText={errors.firstName}
              sx={styles.input}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name *"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={Boolean(errors.lastName)}
              helperText={errors.lastName}
              sx={styles.input}
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
              InputLabelProps={{ shrink: true }}
              error={Boolean(errors.dateOfBirth)}
              helperText={errors.dateOfBirth}
              sx={styles.input}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              error={Boolean(errors.nationality)}
              sx={styles.input}
            >
              <InputLabel>Nationality *</InputLabel>
              <Select
                label="Nationality *"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
              >
                {NATIONALITIES.map((nat) => (
                  <MenuItem key={nat} value={nat}>
                    {nat}
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
    </Box>
  );
}
