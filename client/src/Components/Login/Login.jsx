import React from "react";
import { TextField, Button, Container, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
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
  const [showPassword, setShowPassword] = React.useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
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
            <Grid item xs={12} >
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
