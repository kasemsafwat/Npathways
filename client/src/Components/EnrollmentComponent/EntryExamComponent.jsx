import React, { useContext, useState, useEffect } from "react";
import * as Yup from "yup";
import {
  Container,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import CustomStepper from "./CustomStepper";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { EnrollmentContext } from "../../contexts/EnrollmentContext";

const examValidationSchema = Yup.object().shape({
  material: Yup.string().required("Please select a material"),
  design: Yup.string().required("Please describe your design approach"),
  calculation: Yup.string().required("Please show your calculations"),
});
const EntryExamComponent = () => {
  const { setExamAnswers, setStep } = useContext(EnrollmentContext);
  const navigate = useNavigate();
  const [activeStep] = useState(1);
  const steps = ["User Info", "Exam", "Result"];
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [designAnswer, setDesignAnswer] = useState("");
  const [calculationAnswer, setCalculationAnswer] = useState("");
  const [errors, setErrors] = useState({
    material: "",
    design: "",
    calculation: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  useEffect(() => {
    const savedExamData = localStorage.getItem("examData");
    if (savedExamData) {
      try {
        const { selectedMaterial, designAnswer, calculationAnswer } =
          JSON.parse(savedExamData);
        setSelectedMaterial(selectedMaterial || "");
        setDesignAnswer(designAnswer || "");
        setCalculationAnswer(calculationAnswer || "");
      } catch (error) {
        console.error("Error parsing saved exam data", error);
      }
    }
  }, []);

  // Save exam data
  useEffect(() => {
    const examData = {
      selectedMaterial,
      designAnswer,
      calculationAnswer,
    };
    localStorage.setItem("examData", JSON.stringify(examData));
  }, [selectedMaterial, designAnswer, calculationAnswer]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getUnansweredQuestions = () => {
    const unanswered = [];
    if (!selectedMaterial) unanswered.push("Material Selection");
    if (!designAnswer.trim()) unanswered.push("Design Approach");
    if (!calculationAnswer.trim()) unanswered.push("Load Calculation");
    return unanswered;
  };

  const formatErrorMessage = (unanswered) => {
    if (unanswered.length === 1) {
      return `Please complete: ${unanswered[0]}`;
    }
    if (unanswered.length === 2) {
      return `Please complete: ${unanswered[0]} and ${unanswered[1]}`;
    }
    return `Please complete: ${unanswered.slice(0, -1).join(", ")}, and ${
      unanswered[unanswered.length - 1]
    }`;
  };

  const validateField = async (field, value) => {
    try {
      await examValidationSchema.validateAt(field, { [field]: value });
      return "";
    } catch (err) {
      return err.message;
    }
  };

  const validateFields = async () => {
    const formValues = {
      material: selectedMaterial,
      design: designAnswer,
      calculation: calculationAnswer,
    };

    try {
      await examValidationSchema.validate(formValues, { abortEarly: false });
      setErrors({ material: "", design: "", calculation: "" });
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);

      const unanswered = getUnansweredQuestions();
      setSnackbarMessage(formatErrorMessage(unanswered));
      setOpenSnackbar(true);
      return false;
    }
  };

  // Blur
  const handleMaterialBlur = async () => {
    const error = await validateField("material", selectedMaterial);
    setErrors((prev) => ({ ...prev, material: error }));
  };

  const handleDesignBlur = async () => {
    const error = await validateField("design", designAnswer);
    setErrors((prev) => ({ ...prev, design: error }));
  };

  const handleCalculationBlur = async () => {
    const error = await validateField("calculation", calculationAnswer);
    setErrors((prev) => ({ ...prev, calculation: error }));
  };

  const handleNext = async () => {
    if (!(await validateFields())) return;

    const examAnswers = [
      {
        question:
          "Which material is most suitable for high-stress applications?",
        answer: selectedMaterial,
      },
      {
        question:
          "Describe your approach to designing a earthquake-resistant structure",
        answer: designAnswer,
      },
      {
        question:
          "Calculate the load-bearing capacity of a steel beam (show your work)",
        answer: calculationAnswer,
      },
    ];

    setExamAnswers(examAnswers);
    setStep(3);
    navigate("/enrollment/review");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom color="#46C98B">
        Step 2: Entry Exam
      </Typography>

      <CustomStepper activeStep={activeStep} steps={steps} />

      <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
        <CardContent>
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="h5" fontWeight="bold">
                Exam
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" color="error">
                <HourglassBottomIcon />
                Time Left: {formatTime(timeLeft)}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" color="success.main" sx={{ mt: 2 }}>
            MSQs
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Complete the following tasks to demonstrate your abilities. Time
            limit: 45 minutes.
          </Typography>

          <FormControl
            component="fieldset"
            sx={{ mt: 3 }}
            error={Boolean(errors.material)}
            onBlur={handleMaterialBlur}
          >
            <FormLabel component="legend">
              Which material is most suitable for high-stress applications?
            </FormLabel>
            <RadioGroup
              value={selectedMaterial}
              onChange={(e) => {
                setSelectedMaterial(e.target.value);
                setErrors((prev) => ({ ...prev, material: "" }));
              }}
            >
              <FormControlLabel
                value="Carbon Steel"
                control={<Radio />}
                label="Carbon Steel"
              />
              <FormControlLabel
                value="Aluminum"
                control={<Radio />}
                label="Aluminum"
              />
              <FormControlLabel value="PVC" control={<Radio />} label="PVC" />
              <FormControlLabel value="Wood" control={<Radio />} label="Wood" />
            </RadioGroup>
            {errors.material && (
              <Typography color="error" variant="body2">
                {errors.material}
              </Typography>
            )}
          </FormControl>

          <TextField
            label="Describe your approach to designing a earthquake-resistant structure"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            sx={{ mt: 3 }}
            value={designAnswer}
            onChange={(e) => {
              setDesignAnswer(e.target.value);
              setErrors((prev) => ({ ...prev, design: "" }));
            }}
            onBlur={handleDesignBlur}
            error={Boolean(errors.design)}
            helperText={errors.design}
          />

          <TextField
            label="Calculate the load-bearing capacity of a steel beam (show your work)"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            sx={{ mt: 3 }}
            value={calculationAnswer}
            onChange={(e) => {
              setCalculationAnswer(e.target.value);
              setErrors((prev) => ({ ...prev, calculation: "" }));
            }}
            onBlur={handleCalculationBlur}
            error={Boolean(errors.calculation)}
            helperText={errors.calculation}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => navigate("/enrollment/personal-details")}
            >
              <ArrowBackIcon sx={{ mr: 1 }} /> Prev
            </Button>
            <Button variant="contained" color="success" onClick={handleNext}>
              Next
              <ArrowForwardIcon sx={{ ml: 1 }} />
            </Button>
          </Box>
        </CardContent>
      </Card>

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

export default EntryExamComponent;