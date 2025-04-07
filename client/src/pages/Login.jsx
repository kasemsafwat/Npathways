import React, { useState, useContext } from "react";
import { TextField, Button, Container, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const { login, isEnrolled, isLoading } = useContext(AuthContext);
  const initialValues = {
    email: "moody@example.com",
    password: "Test@123",
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  async function sendDataToAPI(values) {
    try {
      login(values);
      navigate("/student/mypathway");
    } catch (error) {
      console.log(error);
      setApiError(error.response?.data?.message || "Login failed");
    }
  }
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: sendDataToAPI,
  });

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "35%",
        marginTop: "100px",
        padding: "50px 150px 100px ",
        borderRadius: "20px",
        backgroundColor: "#f5f5f5",
        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          width: "80%",
          borderRadius: "15px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            marginBottom: "30px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Login
        </Typography>
        {apiError && (
          <div className="alert alert-danger mb-3" role="alert">
            {apiError}
          </div>
        )}
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
              {formik.touched.email && formik.errors.email && (
                <div
                  style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}
                >
                  {formik.errors.email}
                </div>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
              {formik.touched.password && formik.errors.password && (
                <div
                  style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}
                >
                  {formik.errors.password}
                </div>
              )}
            </Grid>
            <Grid item xs={12} style={{ textAlign: "end", marginTop: "-30px" }}>
              <Button
                variant="text"
                style={{ color: "black", margin: "10px" }}
                onClick={handleShowPassword}
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </Button>
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
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Login;
