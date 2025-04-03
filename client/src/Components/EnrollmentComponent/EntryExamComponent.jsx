import React, { useState, useEffect } from "react";
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

const EntryExamComponent = () => {
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
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
      {/* Stepper */}
      <CustomStepper
        activeStep={activeStep}
        steps={["User Info", "Exam", "Result"]}
      />
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
            {/* Timer */}
            <Grid item>
              <Typography variant="h6" color="error">
                <HourglassBottomIcon />
                Time Left: {formatTime(timeLeft)}
              </Typography>
            </Grid>
          </Grid>

          {/* Instructions */}
          <Typography variant="h6" color="success.main" sx={{ mt: 2 }}>
            MSQs
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Complete the following tasks to demonstrate your abilities. Time
            limit: 45 minutes.
          </Typography>

          {/* Prime Number Question */}
          <FormControl component="fieldset" sx={{ mt: 3 }}>
            <FormLabel component="legend">
              Which of these is a prime number?
            </FormLabel>
            <RadioGroup>
              <FormControlLabel value="2" control={<Radio />} label="2" />
              <FormControlLabel value="6" control={<Radio />} label="6" />
              <FormControlLabel value="8" control={<Radio />} label="8" />
            </RadioGroup>
          </FormControl>

          {/* Challenge Question */}
          <TextField
            label="Describe your biggest challenge and how you overcame it"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            sx={{ mt: 3 }}
          />

          {/* Function Question */}
          <TextField
            label="Write a function that reverses a string"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            sx={{ mt: 3 }}
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
              onClick={() => navigate("/enrollment/review")}
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
