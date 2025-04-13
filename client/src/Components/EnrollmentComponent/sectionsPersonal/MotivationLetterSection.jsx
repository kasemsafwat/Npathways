import React, { useState } from "react";
import { Grid, TextField, Typography, Box, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

export default function MotivationLetterSection({
  formData,
  errors,
  handleChange,
  handleBlur,
}) {
  const [expandedSections, setExpandedSections] = useState({
    motivationLetter: true,
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
        title="Motivation Letter"
        name="motivationLetter"
        expanded={expandedSections.motivationLetter}
        handleToggleSection={handleToggleSection}
        required
      >
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Why do you want to join this program?"
              name="motivationLetter"
              value={formData.motivationLetter}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.motivationLetter)}
              helperText={errors.motivationLetter || "Minimum 50 characters"}
              sx={styles.input}
            />
          </Grid>
        </Grid>
      </FormSection>
    </Box>
  );
}
