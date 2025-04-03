import React, { useState } from "react";
import {
  Avatar,
  TextField,
  Button,
  Box,
  Container,
  Grid2 as Grid,
  Stack,
} from "@mui/material";

export default function ProfileSection() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        my: 4,
      }}
    >
      <Avatar
        sx={{
          width: 400,
          height: 400,
          mb: 4,
          bgcolor: "grey.300",
        }}
        alt="Profile Picture"
        src="/default-profile.jpg"
      />

      {/* Profile Form Fields */}
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="First Name"
          value="John"
          variant="outlined"
        />
        <TextField fullWidth label="Last Name" value="Doe" variant="outlined" />
        <TextField
          fullWidth
          label="Email"
          value="johndoe@example.com"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Password"
          value="Test@123"
          disabled
          variant="outlined"
          type="password"
        />
        <TextField
          fullWidth
          label="Confirm Password"
          value="Test@123"
          disabled
          variant="outlined"
          type="password"
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: "30px" }}
        >
          Save
        </Button>
      </Stack>
    </Box>
  );
}
