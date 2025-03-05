import React, { useState } from "react";
import { TextField, Button, Container, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

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
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        style={{
          padding: "20px",
          borderRadius: "20px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        {apiError ? (
          <div className="alert alert-danger my-2" role="alert">
            {apiError}
          </div>
        ) : (
          ""
        )}
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                id="firstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="alert alert-danger mt-2">
                  {formik.errors.firstName}
                </div>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                id="lastName"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="alert alert-danger mt-2">
                  {formik.errors.lastName}
                </div>
              )}
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
              />
              {formik.touched.email && formik.errors.email && (
                <div className="alert alert-danger mt-2">
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
              />
              {formik.touched.password && formik.errors.password && (
                <div className="alert alert-danger mt-2">
                  {formik.errors.password}
                </div>
              )}
            </Grid>

            <Grid item xs={12} style={{ textAlign: "end", marginTop: "-30px" }}>
              <Button
                variant="text"
                style={{ color: "black" }}
                onClick={handleShowPassword}
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </Button>
            </Grid>

            <Grid item xs={12} style={{ marginTop: "-30px" }}>
              <Button
                variant="contained"
                type="submit"
                style={{ width: "100%", backgroundColor: "black" }}
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Register;
