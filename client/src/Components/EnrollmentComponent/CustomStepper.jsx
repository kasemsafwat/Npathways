import React from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const steps = ["User Info", "Exam", "Result"];

const CustomStepper = () => {
  const location = useLocation();
  const getStep = () => {
    if (location.pathname === "/enrollment/personal-details") return 0;
    if (location.pathname === "/enrollment/entryExam") return 1;
    if (location.pathname === "/enrollment/review") return 2;
    return 0;
  };

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Stepper activeStep={getStep()}>
        {steps.map((label, index) => (
          <Step key={index} completed={index < getStep()}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
export default CustomStepper;