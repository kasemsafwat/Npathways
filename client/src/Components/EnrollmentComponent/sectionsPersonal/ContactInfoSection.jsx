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

export default function ContactInfoSection({ formData, errors, handleChange }) {
  const [expandedSections, setExpandedSections] = useState({
    contactInfo: true,
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
        title="Contact Information"
        name="contactInfo"
        expanded={expandedSections.contactInfo}
        handleToggleSection={handleToggleSection}
        required
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address *"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              sx={styles.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number *"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              sx={styles.input}
            />
          </Grid>
        </Grid>
      </FormSection>
    </Box>
  );
}
