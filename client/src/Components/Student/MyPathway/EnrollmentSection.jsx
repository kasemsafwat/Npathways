import { Stack } from "@mui/material";
import React from "react";
import EnrollmentStep from "./EnrollmentStep";

export default function EnrollmentSection() {
  return (
    <Stack flexDirection={"column"} gap={2} justifyContent={"space-between"}>
      <EnrollmentStep step="Step 1: Whatever Step 1 is" isCompleted />
      <EnrollmentStep step="Step 2: Whatever Step 2 is" isCompleted />
      <EnrollmentStep step="Step 3: Whatever Step 3 is" />
      <EnrollmentStep step="Step 4: Whatever Step 4 is" />
      <EnrollmentStep step="Step 5: Whatever Step 5 is" />
    </Stack>
  );
}
