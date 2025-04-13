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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomStepper from "./CustomStepper";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EnrollmentContext } from "../../contexts/EnrollmentContext";

const ReviewForm = () => {
  const { enrollmentData, setError, setEnrollmentData, setStep } =
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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

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

  const validateSubmissionData = (data) => {
    const requiredFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "email",
      "phone",
      "facultyName",
      "GPA",
      "motivationLetter",
    ];

    const missingFields = requiredFields.filter((field) => {
      if (field === "address.country") {
        return !data.address?.country;
      }
      return !data[field];
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    if (!data.address || !data.address.country) {
      throw new Error("Country in address is required");
    }

    if (isNaN(data.GPA) || data.GPA < 0 || data.GPA > 4) {
      throw new Error("GPA must be a number between 0 and 4");
    }

    if (!data.exam || data.exam.length < 3) {
      throw new Error("All three exam questions must be answered");
    }
  };

  const onFinish = async () => {
    if (!checked) {
      setSnackbarMessage("Please confirm that all information is accurate.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    try {
      const submissionData = {
        firstName: enrollmentData.firstName || "",
        lastName: enrollmentData.lastName || "",
        dateOfBirth: enrollmentData.dateOfBirth || "",
        email: enrollmentData.email || "",
        phone: enrollmentData.phone || "",
        nationality: enrollmentData.nationality || "",
        facultyName: enrollmentData.facultyName || enrollmentData.faculty || "",
        GPA: parseFloat(enrollmentData.GPA) || 0,
        motivationLetter: enrollmentData.motivationLetter || "",
        address: {
          country: enrollmentData.address?.country || "",
          city: enrollmentData.address?.city || "",
          street: enrollmentData.address?.street || "",
        },
        exam: (enrollmentData.exam || []).map((item) => ({
          question: item.question || "Default question",
          answer: item.answer || "N/A",
        })),
      };
      validateSubmissionData(submissionData);

      console.log("Submitting data:", JSON.stringify(submissionData, null, 2));

      const response = await axios.post(
        "http://localhost:5024/api/enrollment/createEnrollment",
        submissionData,
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
        setStep(4);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        config: error.config,
        stack: error.stack,
      });

      let errorMessage = "An error occurred while submitting";

      if (error.response) {
        if (error.response.data?.errors) {
          errorMessage = Object.values(error.response.data.errors).join("\n");
        } else {
          errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setSnackbarMessage(`Error: ${errorMessage}`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: isSmallScreen ? 2 : 4,
        mb: isSmallScreen ? 3 : 5,
        p: isSmallScreen ? 1 : 3,
        bgcolor: "white",
        boxShadow: 3,
        borderRadius: 2,
      }}
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
          textAlign: isSmallScreen ? "center" : "left",
          mb: isSmallScreen ? 1 : 2,
        }}
      >
        Review And Confirm
      </Typography>

      <Box sx={{ mb: isSmallScreen ? 2 : 3 }}>
        <CustomStepper activeStep={activeStep} steps={steps} />
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem" }}>
            Personal Info
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={isSmallScreen ? 1 : 2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
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
                size={isSmallScreen ? "small" : "medium"}
                InputProps={{ readOnly: !editingSections.personalInfo }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                size={isSmallScreen ? "small" : "medium"}
                InputProps={{ readOnly: !editingSections.personalInfo }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={
                  editingSections.personalInfo
                    ? tempData.dateOfBirth?.split("T")[0] || ""
                    : enrollmentData.dateOfBirth?.split("T")[0] || ""
                }
                onChange={handleFieldChange}
                fullWidth
                size={isSmallScreen ? "small" : "medium"}
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
                size={isSmallScreen ? "small" : "medium"}
                InputProps={{ readOnly: !editingSections.personalInfo }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem" }}>
            Contact Info
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={isSmallScreen ? 1 : 2} sx={{ mt: 1 }}>
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
                size={isSmallScreen ? "small" : "medium"}
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
                size={isSmallScreen ? "small" : "medium"}
                InputProps={{ readOnly: !editingSections.contactInfo }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem" }}>
            Address
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={isSmallScreen ? 1 : 2} sx={{ mt: 1 }}>
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
                size={isSmallScreen ? "small" : "medium"}
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
                size={isSmallScreen ? "small" : "medium"}
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
                size={isSmallScreen ? "small" : "medium"}
                InputProps={{ readOnly: !editingSections.address }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem" }}>
            Faculty Info
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={isSmallScreen ? 1 : 2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Faculty Name"
                name="facultyName"
                value={
                  editingSections.facultyInfo
                    ? tempData.facultyName || tempData.faculty
                    : enrollmentData.facultyName || enrollmentData.faculty || ""
                }
                onChange={handleFieldChange}
                fullWidth
                size={isSmallScreen ? "small" : "medium"}
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
                size={isSmallScreen ? "small" : "medium"}
                InputProps={{ readOnly: !editingSections.facultyInfo }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem" }}>
            Motivation Letter
          </Typography>
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
            rows={isSmallScreen ? 3 : 4}
            fullWidth
            size={isSmallScreen ? "small" : "medium"}
            InputProps={{ readOnly: !editingSections.motivationLetter }}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem" }}>
            Entry Exam Response
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {[0, 1, 2].map((index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography
                sx={{ mb: 1, fontSize: isSmallScreen ? "0.875rem" : "1rem" }}
              >
                {enrollmentData.exam?.[index]?.question ||
                  `Question ${index + 1}`}
              </Typography>
              <TextField
                value={enrollmentData.exam?.[index]?.answer || "N/A"}
                fullWidth
                multiline
                rows={
                  index === 0 ? (isSmallScreen ? 1 : 2) : isSmallScreen ? 2 : 4
                }
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  size: isSmallScreen ? "small" : "medium",
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "transparent" },
                    "&:hover fieldset": { borderColor: "transparent" },
                  },
                }}
              />
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            size={isSmallScreen ? "small" : "medium"}
          />
        }
        label={
          <Typography
            variant="body2"
            sx={{
              fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
              ml: isSmallScreen ? 0.5 : 1,
            }}
          >
            I confirm that all information provided is accurate.
          </Typography>
        }
        sx={{ mt: 2 }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 3,
          flexDirection: isSmallScreen ? "column" : "row",
          gap: isSmallScreen ? 2 : 0,
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate("/enrollment/entryExam")}
          size={isSmallScreen ? "small" : "medium"}
          fullWidth={isSmallScreen}
        >
          Prev
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={onFinish}
          size={isSmallScreen ? "small" : "medium"}
          fullWidth={isSmallScreen}
        >
          Finish
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReviewForm;
