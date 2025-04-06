import React, { useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const FACULTIES = [
  "Engineering",
  "Computer Science",
  "Business",
  "Medicine",
  "Law",
  "Information Technology ",
  "Pharmacy",
  "Dentistry",
  "Nursing",
  "Architecture",
  "Arts",
  "Education",
  "Economics",
  "Agriculture",
  "Veterinary Medicine",
  "Environmental Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Statistics",
  "Other",
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

export default function FacultySection({ formData, errors, handleChange }) {
  const [expandedSections, setExpandedSections] = useState({
    facultyAndGPA: true,
  });

  const handleToggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <FormSection
        title="Faculty Info"
        name="facultyAndGPA"
        expanded={expandedSections.facultyAndGPA}
        handleToggleSection={handleToggleSection}
        required
      >
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={Boolean(errors.faculty)}>
              <InputLabel>Faculty *</InputLabel>
              <Select
                label="Faculty *"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
              >
                {FACULTIES.map((fac) => (
                  <MenuItem key={fac} value={fac}>
                    {fac}
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
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="GPA (0.00 - 4.00)"
              name="GPA"
              value={formData.GPA}
              onChange={handleChange}
              error={Boolean(errors.GPA)}
              helperText={errors.GPA}
              inputProps={{
                inputMode: "decimal",
                step: "0.01",
                min: 0,
                max: 4,
              }}
            />
          </Grid>
        </Grid>
      </FormSection>
    </Box>
  );
}
