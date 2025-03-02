import React, { useState } from "react";
import { TextField, Button, Container, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      /^[A-Z][a-z0-9]{3,8}$/,
      "Invalid password (must start with a capital letter and be 4-9 characters long)"
    )
    .required("Required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const initialValues = {
    email: "",
    password: "",
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  async function sendDataToAPI(values) {
    try {
      setApiError(null);
      let { data } = await axios.post(`http://localhost:5024/api/user/login`, values);
      console.log(data);
      if (data.message === "Login successfully") {
      localStorage.setItem("userToken",data.token)
console.log('Login successfully')      }
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
          Login
        </Typography>
        {apiError ? (
        <div className="alert alert-danger mb-2" role="alert">
          {apiError}
        </div>
      ) : (
        ""
      )}
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={5}>
        
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
            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                style={{ width: "100%", backgroundColor: "black" }}
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
