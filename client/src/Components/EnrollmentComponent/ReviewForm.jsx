import React, { useContext, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomStepper from "./CustomStepper";
import UpdateButton from "./UpdateButton";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
const ReviewForm = () => {
  const { setIsEnrolled } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Step 1", "Step 2", "Step 3"];
  const onFinish = () => {
    if (checked) {
      setIsEnrolled(true);
      navigate("/student/mypathway");
    } else {
      alert("Please confirm that all information is accurate.");
    }
  };
  return (
    <Container
      maxWidth="md"
      sx={{ mt: 4, p: 3, bgcolor: "white", boxShadow: 3, borderRadius: 2 }}
    >
      <Typography
        variant="h4"
        gutterBottom
        color="#46C98B"
        sx={{
          fontSize: {
            xs: "1.2rem",
            sm: "1.5rem",
            md: "2rem",
            lg: "2.5rem",
            xl: "3rem",
          },
        }}
      >
        Review And Confirm
      </Typography>
      {/* Stepper */}
      <CustomStepper activeStep={activeStep} steps={steps} />
      {/* Personal Info Section */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography>Personal Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Mohemed" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Ali" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="3/2/2001" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Cairo" fullWidth />
            </Grid>
          </Grid>
        </AccordionDetails>

        <UpdateButton />
      </Accordion>

      {/* Contact Info Section */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography>Contact Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Example@gmail.com" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="0117835662" fullWidth />
            </Grid>
          </Grid>
        </AccordionDetails>
        <UpdateButton />
      </Accordion>

      {/* Address Section */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography>Address</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Cairo" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Cairo" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Street" fullWidth />
            </Grid>
          </Grid>
        </AccordionDetails>
        <UpdateButton />
      </Accordion>

      {/* Faculty Info Section */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography>Faculty Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Faculty Name *" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="GPA *" fullWidth />
            </Grid>
          </Grid>
        </AccordionDetails>
        <UpdateButton />
      </Accordion>

      {/* Motivation Letter Section */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography>Motivation Letter</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField label="Motivation Letter *" multiline rows={4} fullWidth />
        </AccordionDetails>
        <UpdateButton />
      </Accordion>

      {/* Entry Exam Section */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />
          }
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography>Entry Exam Response</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Which of these is a prime number?</Typography>
          <Typography>✅ 2</Typography>

          <TextField
            label="Describe your biggest challenge and how you overcame it"
            multiline
            rows={4}
            fullWidth
            sx={{ mt: 2 }}
          />

          <TextField
            label="Write a function that reverses a string"
            multiline
            rows={4}
            fullWidth
            sx={{ mt: 2 }}
          />
        </AccordionDetails>
        <UpdateButton />
      </Accordion>

      {/* Confirmation Checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        }
        label={
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            I confirm that all information provided is accurate.
          </Typography>
        }
        sx={{ mt: 2 }}
      />

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate("/enrollment/entryExam")}
        >
          Prev
        </Button>
        <Button variant="contained" color="success" onClick={onFinish}>
          Finish
        </Button>
      </Box>
    </Container>
  );
};

export default ReviewForm;
