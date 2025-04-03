import React, { useState } from "react";
import { TextField, Button, Container, Grid, Typography, Box, Checkbox } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
});

const Register = () => {
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  async function sendDataToAPI(values) {
    try {
      setApiError(null);
      let { data } = await axios.post(
        `http://localhost:5024/api/user/signup`,
        values
      );
      console.log(data);
      if (data.message === "Account Created Successfully") {
        console.log("Account Created Successfully");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      setApiError(error.response.data.message);
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: sendDataToAPI,
  });

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 3,
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          bgcolor: "#f5f5f5",
          borderRadius: 2,
          p: 6,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            mb: 4,
            fontWeight: 500,
          }}
        >
          Create an account
        </Typography>

        {apiError && (
          <Box sx={{ mb: 2 }}>
            <Typography color="error">{apiError}</Typography>
          </Box>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First name"
                variant="outlined"
                id="firstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last name"
                variant="outlined"
                id="lastName"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Checkbox
                  size="small"
                  sx={{
                    mr: 1,
                    color: "text.secondary",
                    "&.Mui-checked": {
                      color: "primary.main",
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "14px",
                    "& a": {
                      color: "inherit",
                      textDecoration: "underline",
                      "&:hover": {
                        color: "primary.main",
                      },
                    },
                  }}
                >
                  By creating an account, I agree to our{" "}
                  <a href="/terms">Terms of use</a> and{" "}
                  <a href="/privacy">Privacy Policy</a>
                </Typography>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  borderRadius: "20px",
                  padding: "12px",
                  backgroundColor: "MuiButton-light",
                  textTransform: "none",
                  fontSize: "16px",
                  width: "50%",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                Create an account
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2.5,
                }}
              >
                <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                <Typography
                  variant="body2"
                  sx={{
                    px: 2,
                    color: "text.secondary",
                  }}
                >
                  OR
                </Typography>
                <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    style={{ width: 18, height: 18 }}
                  />
                }
                sx={{
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "0.9375rem",
                  borderColor: "divider",
                  color: "text.primary",
                  borderRadius: "20px",
                  width: "50%",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "transparent",
                  },
                }}
              >
                Continue with Google
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
