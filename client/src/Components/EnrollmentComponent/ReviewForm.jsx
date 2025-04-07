import React, { useContext, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomStepper from "./CustomStepper";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EnrollmentContext } from "../../contexts/EnrollmentContext";
const ReviewForm = () => {
  const { enrollmentData, setError, setEnrollmentData } =
    useContext(EnrollmentContext);
  const [checked, setChecked] = useState(false);
  const [editingSections, setEditingSections] = useState({
    personalInfo: false,
    contactInfo: false,
    address: false,
    facultyInfo: false,
    motivationLetter: false,
  });
  const [tempData, setTempData] = useState({ ...enrollmentData });
  const navigate = useNavigate();
  const [activeStep] = useState(2);
  const steps = ["Personal Info", "Exam", "Review"];
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const onFinish = async () => {
    if (!checked) {
      setSnackbarMessage("Please confirm that all information is accurate.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5024/api/enrollment/createEnrollment",
        enrollmentData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        localStorage.removeItem("formData");
        localStorage.removeItem("examData");
        navigate("/student/mypathway");
        setSnackbarMessage("Enrollment successfully created!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error creating enrollment:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An error occurred while submitting";
      setError(errorMessage);
      setSnackbarMessage(`Error: ${errorMessage}`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  return (
    <Container
      maxWidth="md"
      sx={{ mt: 4, p: 3, bgcolor: "white", boxShadow: 3, borderRadius: 2 }}
    >
      <Typography
        variant="h4"
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
        Review And Confirm
      </Typography>

      <CustomStepper activeStep={activeStep} steps={steps} />
      {/* personal Information*/}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography>Personal Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={
                  editingSections.personalInfo
                    ? tempData.firstName
                    : enrollmentData.firstName
                }
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.personalInfo }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={
                  editingSections.personalInfo
                    ? tempData.lastName
                    : enrollmentData.lastName
                }
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.personalInfo }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                value={
                  editingSections.personalInfo
                    ? tempData.dateOfBirth
                    : enrollmentData.dateOfBirth
                }
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.personalInfo }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nationality"
                name="nationality"
                value={
                  editingSections.personalInfo
                    ? tempData.nationality
                    : enrollmentData.nationality
                }
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.personalInfo }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {/* Contact Info */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography>Contact Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={
                  editingSections.contactInfo
                    ? tempData.email
                    : enrollmentData.email || ""
                }
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.contactInfo }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phone"
                value={
                  editingSections.contactInfo
                    ? tempData.phone
                    : enrollmentData.phone || ""
                }
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.contactInfo }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {/* Address */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography>Address</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Country"
                name="country"
                value={
                  editingSections.address
                    ? tempData.address?.country
                    : enrollmentData.address?.country || ""
                }
                onChange={handleAddressChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.address }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="City"
                name="city"
                value={
                  editingSections.address
                    ? tempData.address?.city
                    : enrollmentData.address?.city || ""
                }
                onChange={handleAddressChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.address }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Street"
                name="street"
                value={
                  editingSections.address
                    ? tempData.address?.street
                    : enrollmentData.address?.street || ""
                }
                onChange={handleAddressChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.address }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {/* Faculty Info */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography>Faculty Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Faculty Name"
                name="facultyName"
                value={
                  editingSections.facultyInfo
                    ? tempData.facultyName
                    : enrollmentData.facultyName || ""
                }
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.facultyInfo }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="GPA"
                name="GPA"
                value={
                  editingSections.facultyInfo
                    ? tempData.GPA
                    : enrollmentData.GPA || ""
                }
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.facultyInfo }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {/* Motivation Letter */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography>Motivation Letter</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Motivation Letter"
            name="motivationLetter"
            value={
              editingSections.motivationLetter
                ? tempData.motivationLetter
                : enrollmentData.motivationLetter || ""
            }
            onChange={handleFieldChange}
            multiline
            rows={4}
            fullWidth
            InputProps={{ readOnly: !editingSections.motivationLetter }}
          />
        </AccordionDetails>
      </Accordion>
      {/* Exam */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography>Entry Exam Response</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>
              {enrollmentData.exam?.[0]?.question || "Question 1"}
            </Typography>
            <TextField
              value={enrollmentData.exam?.[0]?.answer || "N/A"}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "transparent" },
                },
              }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>
              {enrollmentData.exam?.[1]?.question || "Question 2"}
            </Typography>
            <TextField
              value={enrollmentData.exam?.[1]?.answer || "N/A"}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "transparent" },
                },
              }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>
              {enrollmentData.exam?.[2]?.question || "Question 3"}
            </Typography>
            <TextField
              value={enrollmentData.exam?.[2]?.answer || "N/A"}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "transparent" },
                },
              }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        }
        label={
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            I confirm that all information provided is accurate.
          </Typography>
        }
        sx={{ mt: 2 }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate("/enrollment/entryExam")}
        >
          Prev
        </Button>
        <Button variant="contained" color="success" onClick={onFinish}>
          Finish
        </Button>
      </Box>
      {/*  Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};
export default ReviewForm;