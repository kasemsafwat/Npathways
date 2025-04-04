import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  Avatar,
  TextField,
  Button,
  Box,
  Stack,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AuthContext } from "../../../contexts/AuthContext";

export default function ProfileSection() {
  const { isAuthenticated } = useContext(AuthContext);
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5024/api/user/${userId}`,
          { withCredentials: true }
        );
        setUserData(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && userId) {
      fetchUserData();
    }
  }, [userId, isAuthenticated]);

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
      // You would implement the API call to update user data here
      // For now, just simulate a successful update
      setUserData({
        ...userData,
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
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
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

  if (!userData) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6">No user data found.</Typography>
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
        alt={`${userData.firstName} ${userData.lastName}`}
        src={`https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random&size=200`}
      />

      <Typography variant="h5" gutterBottom>
        {userData.track} - Level {userData.level}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          color: userData.status === "active" ? "success.main" : "error.main",
          fontWeight: "bold",
          mb: 4,
        }}
      >
        Status: {userData.status}
      </Typography>

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
