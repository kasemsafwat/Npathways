import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import CustomStepper from "./CustomStepper";
import { EnrollmentContext } from "../../contexts/EnrollmentContext";
import PersonalInfoSection from "./sectionsPersonal/PersonalInfoSection";
import ContactInfoSection from "./sectionsPersonal/ContactInfoSection";
import AddressSection from "./sectionsPersonal/AddressSection";
import FacultySection from "./sectionsPersonal/FacultySection";
import MotivationLetterSection from "./sectionsPersonal/MotivationLetterSection";
export default function PersonalDetailsForm() {
  const { setPersonalDetails, setStep } = useContext(EnrollmentContext);
  const navigate = useNavigate();
  const [activeStep] = useState(0);
  const steps = ["Personal Info", "Exam", "Review"];
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const validatePayload = (payload) => {
    const newErrors = {};
    if (!payload.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!/^[a-zA-Z]+$/.test(payload.firstName)) {
      newErrors.firstName = "First name should contain only letters";
    }
    if (!payload.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[a-zA-Z]+$/.test(payload.lastName)) {
      newErrors.lastName = "Last name should contain only letters";
    }
    if (!payload.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!payload.nationality) newErrors.nationality = "Nationality is required";
    if (!payload.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!payload.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(01[0125])\d{8}$|^02\d{8}$/.test(payload.phone)) {
      newErrors.phone = "Enter a valid Egyptian phone number";
    }
    if (!payload.address?.country?.trim())
      newErrors["address.country"] = "Country is required";
    if (!payload.facultyName) newErrors.faculty = "Faculty is required";
    if (isNaN(payload.GPA) || payload.GPA < 0 || payload.GPA > 4) {
      newErrors.GPA = "Please enter a valid GPA (0-4)";
    }
    if (!payload.motivationLetter?.trim()) {
      newErrors.motivationLetter = "Motivation letter is required";
    } else if (payload.motivationLetter.length < 50) {
      newErrors.motivationLetter =
        "Motivation letter should be at least 50 characters";
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
      const firstErrorMessage =
        validationErrors[Object.keys(validationErrors)[0]];
      setErrors(validationErrors);
      setSnackbarMessage(firstErrorMessage);
      setOpenSnackbar(true);
      setStep(2);
      return;
    }

    setErrors({});
    setPersonalDetails(payload);
    navigate("/enrollment/entryExam");
  };

  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error parsing saved data", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom color="#46C98B">
        Personal Details and Motivation
      </Typography>
      <CustomStepper activeStep={activeStep} steps={steps} />
      <PersonalInfoSection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
      />
      <ContactInfoSection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
      />
      <AddressSection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
      />
      <FacultySection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
      />
      <MotivationLetterSection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
      />
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
      {/*notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
