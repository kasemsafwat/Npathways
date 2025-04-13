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
    facultyName: "",
    GPA: "",
    motivationLetter: "",
    exam: [],
  });

  const [errors, setErrors] = useState({});
  const [snackbarQueue, setSnackbarQueue] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters")
      .matches(/^[a-zA-Z]+$/, "First name must contain only letters"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .matches(/^[a-zA-Z]+$/, "Last name must contain only letters"),
    dateOfBirth: Yup.date()
      .required("Date of birth is required")
      .min(new Date(1980, 0, 1), "Date of birth must be 1980 or later")
      .max(new Date(), "Date of birth cannot be in the future")
      .typeError("Please enter a valid date of birth"),
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
    facultyName: Yup.string().required("Faculty is required"),
    GPA: Yup.number()
      .required("GPA is required")
      .min(0, "GPA must be between 0-4")
      .max(4, "GPA must be between 0-4")
      .typeError("Enter a valid number"),
    motivationLetter: Yup.string()
      .required("Motivation letter is required")
      .min(50, "Motivation letter must be at least 50 characters"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        };
      }
      if (name === "faculty") {
        return {
          ...prev,
          faculty: value,
          facultyName: value,
        };
      }
      return { ...prev, [name]: value };
    });

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        if (newErrors[parent]?.[child]) delete newErrors[parent][child];
      } else {
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
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const payload = {
        ...formData,
        facultyName: formData.faculty || formData.facultyName,
        GPA: formData.GPA ? parseFloat(formData.GPA) : undefined,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        address: {
          country: formData.address.country || "",
          city: formData.address.city || "",
          street: formData.address.street || "",
        },
      };

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
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarQueue((prev) => prev.slice(1));
    setOpenSnackbar(false);
    if (snackbarQueue.length > 1) {
      setTimeout(() => setOpenSnackbar(true), 300);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData((prev) => ({
          ...prev,
          ...parsedData,
          address: {
            ...prev.address,
            ...(parsedData.address || {}),
          },
          exam: parsedData.exam || [],
          facultyName: parsedData.facultyName || parsedData.faculty || "",
        }));
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
