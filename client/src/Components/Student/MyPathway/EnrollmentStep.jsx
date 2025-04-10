import { Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { EnrollmentContext } from "../../../contexts/EnrollmentContext";

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
