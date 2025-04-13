import React, { useContext, useState, useEffect } from "react";
import * as Yup from "yup";
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
  const steps = ["User Info", "Exam", "Result"];
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    email: "",
    phone: "",
    address: {
      country: "",
      city: "",
      street: "",
    },
    faculty: "",
    GPA: "",
    motivationLetter: "",
  });
  const [errors, setErrors] = useState({});
  const [snackbarQueue, setSnackbarQueue] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters")
      .matches(/^[a-zA-Z]+$/, "First name should contain only letters"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .matches(/^[a-zA-Z]+$/, "Last name should contain only letters"),
    dateOfBirth: Yup.date()
      .required("Data of birth is required")
      .min(new Date(1980, 0, 1), "Birthdate must be 1980 or later")
      .max(new Date(), " Birthdate cannot be in the future ")
      .typeError("Please enter a valid date"),
    nationality: Yup.string().required("Nationality is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Enter a valid email address"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(
        /^(01[0125])\d{8}$|^02\d{8}$/,
        "Enter a valid Egyptian phone number"
      ),
    address: Yup.object().shape({
      country: Yup.string().required("Country is required"),
      city: Yup.string(),
      street: Yup.string(),
    }),
    faculty: Yup.string().required("Faculty is required"),
    GPA: Yup.number()
      .required("GPA is required")
      .min(0, "Please enter a valid GPA (0-4)")
      .max(4, "Please enter a valid GPA (0-4)")
      .typeError("Please enter a valid GPA (0-4)"),
    motivationLetter: Yup.string()
      .required("Motivation letter is required")
      .min(50, "Motivation letter should be at least 50 characters"),
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        if (newErrors[parent]?.[child]) {
          delete newErrors[parent][child];
        }
      } else if (newErrors[name]) {
        delete newErrors[name];
      }
      return newErrors;
    });
  };
  const handleBlur = async (e) => {
    const { name, value } = e.target;
    try {
      await validationSchema.validateAt(name, { [name]: value });
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.message }));
    }
  };

  const handleNext = async () => {
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
      faculty: formData.faculty,
      GPA: formData.GPA ? parseFloat(formData.GPA) : undefined,
    };

    try {
      await validationSchema.validate(payload, { abortEarly: false });
      setErrors({});
      setPersonalDetails(payload);
      navigate("/enrollment/entryExam");
    } catch (error) {
      const validationErrors = {};
      const errorMessages = [];
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
        errorMessages.push(err.message);
      });
      setErrors(validationErrors);
      setSnackbarQueue(errorMessages);
      setOpenSnackbar(true);
      setStep(2);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarQueue((prev) => {
      const newQueue = [...prev];
      newQueue.shift();
      return newQueue;
    });
    setOpenSnackbar(false);
    if (snackbarQueue.length > 1) {
      setTimeout(() => setOpenSnackbar(true), 300);
    }
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
        handleBlur={handleBlur}
      />
      <ContactInfoSection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />
      <AddressSection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />
      <FacultySection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />
      <MotivationLetterSection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          onClose={handleSnackbarClose}
          sx={{ width: "100%" }}
        >
          {snackbarQueue[0] || ""}
        </Alert>
      </Snackbar>
    </Container>
  );
}
