import { Stack } from "@mui/material";
import React from "react";
import EnrollmentStep from "./EnrollmentStep";

export default function EnrollmentSection() {
  return (
    <Stack flexDirection={"column"} gap={2} justifyContent={"space-between"}>
      <EnrollmentStep step="Step 1: User Info" isCompleted />
      <EnrollmentStep step="Step 2: Motivation and expectation" isCompleted />
      <EnrollmentStep step="Step 3: Enrollment Test" />
      <EnrollmentStep step="Step 4: Evaluations" />
    </Stack>
  );
}
