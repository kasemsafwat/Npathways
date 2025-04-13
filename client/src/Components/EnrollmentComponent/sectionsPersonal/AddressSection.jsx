import React, { useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ARABIC_COUNTRIES = [
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
export default function AddressSection({
  formData,
  errors,
  handleChange,
  handleBlur,
}) {
  const [expandedSections, setExpandedSections] = useState({
    address: true,
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
        title="Address Info"
        name="address"
        expanded={expandedSections.address}
        handleToggleSection={handleToggleSection}
        required
      >
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={4}>
            <FormControl
              fullWidth
              error={Boolean(errors.address?.country)}
              sx={styles.input}
            >
              <InputLabel>Country *</InputLabel>
              <Select
                label="Country *"
                name="address.country"
                value={formData.address?.country || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {ARABIC_COUNTRIES.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
              {errors.address?.country && (
                <Typography variant="caption" color="error">
                  {errors.address.country}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="City"
              name="address.city"
              value={formData.address?.city || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.address?.city)}
              helperText={errors.address?.city}
              sx={styles.input}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Street"
              name="address.street"
              value={formData.address?.street || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.address?.street)}
              helperText={errors.address?.street}
              sx={styles.input}
            />
          </Grid>
        </Grid>
      </FormSection>
    </Box>
  );
}
