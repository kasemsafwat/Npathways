import React from "react";
import { TextField, Button, Container, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string()
  .matches(/^(01[0125]\d{8}|02\d{8})$/, "Invalid number")
  .required("Required"),
  password: Yup.string()
      .matches(/^[A-Z][a-z0-9]{3,8}$/, "Invalid password (must start with a capital letter and be 4-9 characters long)")
      .required("Required"),
});

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
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
          Register
        </Typography>
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
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
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
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
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
                label="Phone"
                variant="outlined"
                id="phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="alert alert-danger mt-2">
                  {formik.errors.phone}
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
                error={formik.touched.password && Boolean(formik.errors.password)}
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