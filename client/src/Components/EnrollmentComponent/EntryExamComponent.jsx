import React, { useContext, useState, useEffect } from "react";
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
} from "@mui/material";
import CustomStepper from "./CustomStepper";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { EnrollmentContext } from "../../contexts/EnrollmentContext";

const EntryExamComponent = () => {
  const { setExamAnswers } = useContext(EnrollmentContext);
  const navigate = useNavigate();
  const [activeStep] = useState(1);
  const steps = ["User Info", "Exam", "Result"];
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [selectedPrime, setSelectedPrime] = useState("");
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [functionAnswer, setFunctionAnswer] = useState("");
  const [errors, setErrors] = useState({
    prime: false,
    challenge: false,
    function: false,
  });

   useEffect(() => {
    const savedExamData = localStorage.getItem("examData");
    if (savedExamData) {
      try {
        const { selectedPrime, challengeAnswer, functionAnswer } = JSON.parse(savedExamData);
        setSelectedPrime(selectedPrime || "");
        setChallengeAnswer(challengeAnswer || "");
        setFunctionAnswer(functionAnswer || "");
      } catch (error) {
        console.error("Error parsing saved exam data", error);
      }
    }
  }, []);

  useEffect(() => {
    const examData = {
      selectedPrime,
      challengeAnswer,
      functionAnswer,
    };
    localStorage.setItem("examData", JSON.stringify(examData));
  }, [selectedPrime, challengeAnswer, functionAnswer]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const validateFields = () => {
    const newErrors = {
      prime: selectedPrime === "",
      challenge: challengeAnswer.trim() === "",
      function: functionAnswer.trim() === "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(err => err);
  };

  const handleNext = () => {
    if (!validateFields()) return;
    
    const examAnswers = [
      { 
        question: "Which of these is a prime number?", 
        answer: selectedPrime 
      },
      { 
        question: "Describe your biggest challenge and how you overcame it", 
        answer: challengeAnswer 
      },
      { 
        question: "Write a function that reverses a string", 
        answer: functionAnswer 
      }
    ];
      setExamAnswers(examAnswers);
    navigate("/enrollment/review");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h5"
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
        Step 2: Entry Exam
      </Typography>

      <CustomStepper activeStep={activeStep} steps={steps} />

      <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
        <CardContent>
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
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
            Complete the following tasks to demonstrate your abilities. Time limit: 45 minutes.
          </Typography>

          <FormControl
            component="fieldset"
            sx={{ mt: 3 }}
            error={errors.prime}
          >
            <FormLabel component="legend">
              Which of these is a prime number?
            </FormLabel>
            <RadioGroup
              value={selectedPrime}
              onChange={(e) => {
                setSelectedPrime(e.target.value);
                setErrors(prev => ({ ...prev, prime: false }));
              }}
            >
              <FormControlLabel value="2" control={<Radio />} label="2" />
              <FormControlLabel value="6" control={<Radio />} label="6" />
              <FormControlLabel value="8" control={<Radio />} label="8" />
            </RadioGroup>
            {errors.prime && (
              <Typography color="error" variant="body2">
                Please select an answer.
              </Typography>
            )}
          </FormControl>

          <TextField
            label="Describe your biggest challenge and how you overcame it"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            sx={{ mt: 3 }}
            value={challengeAnswer}
            onChange={(e) => {
              setChallengeAnswer(e.target.value);
              setErrors(prev => ({ ...prev, challenge: false }));
            }}
            error={errors.challenge}
            helperText={errors.challenge && "This field is required."}
          />

          <TextField
            label="Write a function that reverses a string"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            sx={{ mt: 3 }}
            value={functionAnswer}
            onChange={(e) => {
              setFunctionAnswer(e.target.value);
              setErrors(prev => ({ ...prev, function: false }));
            }}
            error={errors.function}
            helperText={errors.function && "This field is required."}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
            }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => navigate("/enrollment/personal-details")}
            >
              <ArrowBackIcon sx={{ mr: 1 }} /> Prev
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleNext}
            >
              Next
              <ArrowForwardIcon sx={{ ml: 1 }} />
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EntryExamComponent;
