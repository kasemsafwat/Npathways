import { Stack, Typography } from "@mui/material";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

export default function EnrollmentStep({ step, isCompleted }) {
  return (
    <Stack flexDirection={"row"} gap={2}>
      {isCompleted ? (
        <CheckCircleIcon sx={{ color: "primary.main" }} />
      ) : (
        <RadioButtonUncheckedIcon />
      )}
      <Typography fontWeight={"bold"}>{step}</Typography>
    </Stack>
  );
}
