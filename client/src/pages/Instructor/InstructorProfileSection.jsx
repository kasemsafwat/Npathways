import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { InstructorAuthContext } from "../../contexts/InstructorAuthContext";

export default function InstructorProfileSection() {
  const { isAuthenticated } = useContext(InstructorAuthContext);
  const instructorID = localStorage.getItem("instructorID");
  const [instructorData, setInstructorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch instructor data from the API
  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5024/api/instructor/`,
          { withCredentials: true }
        );
        setInstructorData(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
        });
      } catch (error) {
        console.error("Error fetching instructor data:", error);
        setError("Failed to fetch instructor data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && instructorID) {
      fetchInstructorData();
    }
  }, [instructorID, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // You would implement the API call to update instructor data here
      // For now, just simulate a successful update
      setInstructorData({
        ...instructorData,
        ...formData,
      });
      setIsEditing(false);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: instructorData.firstName,
      lastName: instructorData.lastName,
      email: instructorData.email,
    });
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6">Please login to view this page</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="200px">
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!instructorData) {
    setLoading(false);
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6">No instructor data found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        my: 4,
      }}
    >
      {saveSuccess && (
        <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Avatar
        sx={{
          width: 200,
          height: 200,
          mb: 4,
          bgcolor: "primary.light",
          fontSize: "4rem",
        }}
        alt={`${instructorData.firstName} ${instructorData.lastName}`}
        src={`https://ui-avatars.com/api/?name=${instructorData.firstName}+${instructorData.lastName}&background=random&size=200`}
      />

      {/* Profile Form Fields */}
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 500 }}>
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          variant="outlined"
          disabled={!isEditing}
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          variant="outlined"
          disabled={!isEditing}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          disabled={!isEditing}
        />

        {isEditing ? (
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSave}
              sx={{ borderRadius: "30px", minWidth: 120 }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="large"
              onClick={handleCancel}
              sx={{ borderRadius: "30px", minWidth: 120 }}
            >
              Cancel
            </Button>
          </Stack>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleEdit}
            sx={{ borderRadius: "30px", alignSelf: "center", minWidth: 120 }}
          >
            Edit Profile
          </Button>
        )}
      </Stack>
    </Box>
  );
}
