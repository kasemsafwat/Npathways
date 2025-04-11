import { Stack } from "@mui/material";
import React, { useContext } from "react";
import EnrollmentStep from "./EnrollmentStep";
import { EnrollmentContext } from "../../../contexts/EnrollmentContext";
import { AuthContext } from "../../../contexts/AuthContext";

export default function EnrollmentSection() {
  const { step: enrollmentStep } = useContext(EnrollmentContext);
  const { user } = useContext(AuthContext);
  console.log(user);
  // const enrollmentStep = 4;
  const steps = [
    "Step 1: User Info",
    "Step 2: Motivation and expectation",
    "Step 3: Enrollment Test",
    "Step 4: Evaluations",
  ];
  // function getStudentPathway() {
  //   const pathway = user.pathways.length;
  // }
  // const studentPathway = getStudentPathway();
  // console.log(user.pathways.length);

  return (
    <Stack flexDirection={"column"} gap={2} justifyContent={"space-between"}>
      {steps.map((step, index) => (
        <EnrollmentStep
          key={index}
          step={step}
          isCompleted={index + 1 < enrollmentStep + 1}
          // isActive={index + 1 === enrollmentStep}
        />
      ))}
    </Stack>
  );
}
