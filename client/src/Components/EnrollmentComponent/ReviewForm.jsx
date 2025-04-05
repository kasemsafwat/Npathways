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
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CustomStepper from "./CustomStepper";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EnrollmentContext } from "../../contexts/EnrollmentContext";

const ReviewForm = () => {
  const { enrollmentData, setError, setEnrollmentData } = useContext(EnrollmentContext);
  const [checked, setChecked] = useState(false);
  const [editingSections, setEditingSections] = useState({
    personalInfo: false,
    contactInfo: false,
    address: false,
    facultyInfo: false,
    motivationLetter: false,
  });
  const [tempData, setTempData] = useState({ ...enrollmentData });
  const navigate = useNavigate();
  const [activeStep] = useState(2);
  const steps = ["Personal Info", "Exam", "Review"];

  const toggleSectionEdit = (section) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  
  const handleSaveSection = async (section) => {
    try {
       const getRawId = (idField) => {
        if (!idField) return null;
        return typeof idField === 'object' ? idField.$oid : idField;
      };
  
      const enrollmentId = getRawId(enrollmentData._id) || getRawId(enrollmentData.userId);
      
      if (!enrollmentId) {
        console.error("Cannot save - enrollment ID is missing");
        setError("Cannot save - enrollment record not found");
        return;
      }
  
      let payload = {};
      
      switch(section) {
        case 'personalInfo':
          payload = {
            firstName: tempData.firstName,
            lastName: tempData.lastName,
            dateOfBirth: tempData.dateOfBirth,
            nationality: tempData.nationality
          };
          break;
        case 'contactInfo':
          payload = {
            email: tempData.email,
            phone: tempData.phone
          };
          break;
        case 'address':
          payload = {
            address: {
              country: tempData.address?.country,
              city: tempData.address?.city,
              street: tempData.address?.street
            }
          };
          break;
        case 'facultyInfo':
          payload = {
            facultyName: tempData.facultyName,
            GPA: tempData.GPA
          };
          break;
        case 'motivationLetter':
          payload = {
            motivationLetter: tempData.motivationLetter
          };
          break;
      }
  
      console.log("Updating enrollment with ID:", enrollmentId);
      console.log("Payload being sent:", payload);
      
      const response = await axios.put(
        `http://localhost:5024/api/enrollment/updateEnrollment/${enrollmentId}`,
        payload,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
         const updatedData = response.data;
        setEnrollmentData(prev => ({
          ...prev,
          ...updatedData,
          _id: updatedData._id || prev._id,
          userId: updatedData.userId || prev.userId,
          address: updatedData.address || prev.address
        }));
        
        toggleSectionEdit(section);
        setError(null);
        alert("Changes saved successfully!");
      }
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
      let errorMsg = "Error updating data";
      
      if (error.response) {
        errorMsg = error.response.data?.message || 
                  error.response.data?.error || 
                  error.response.statusText;
      } else if (error.request) {
        errorMsg = "No response received from server";
      }
      
      setError(errorMsg);
      alert(`Error: ${errorMsg}`);
    }
  };
  const onFinish = async () => {
    if (!checked) {
      alert("Please confirm that all information is accurate.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5024/api/enrollment/createEnrollment",
        enrollmentData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200 || response.status === 201) {
        navigate("/student/mypathway");
      }
    } catch (error) {
      console.error("Error creating enrollment:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "An error occurred while submitting";
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  };

  const renderSectionActionButton = (section) => {
    return editingSections[section] ? (
      <Button
        variant="contained"
        color="success"
        startIcon={<SaveIcon />}
        onClick={() => handleSaveSection(section)}
        size="small"
      >
        Save
      </Button>
    ) : (
      <Button
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={() => toggleSectionEdit(section)}
        size="small"
      >
        Update
      </Button>
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, p: 3, bgcolor: "white", boxShadow: 3, borderRadius: 2 }}>
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

      <CustomStepper activeStep={activeStep} steps={steps} />

      {/* Personal Info */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />}
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}
        >
          <Typography>Personal Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={editingSections.personalInfo ? tempData.firstName : enrollmentData.firstName}
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.personalInfo }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={editingSections.personalInfo ? tempData.lastName : enrollmentData.lastName}
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.personalInfo }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                value={editingSections.personalInfo ? tempData.dateOfBirth : enrollmentData.dateOfBirth}
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.personalInfo }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nationality"
                name="nationality"
                value={editingSections.personalInfo ? tempData.nationality : enrollmentData.nationality}
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.personalInfo }}
              />
            </Grid>
          </Grid>
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            {renderSectionActionButton('personalInfo')}
          </Box> */}
        </AccordionDetails>
      </Accordion>

      {/* Contact Info */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />} 
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}>
          <Typography>Contact Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={editingSections.contactInfo ? tempData.email : enrollmentData.email || ""}
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.contactInfo }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phone"
                value={editingSections.contactInfo ? tempData.phone : enrollmentData.phone || ""}
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.contactInfo }}
              />
            </Grid>
          </Grid>
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            {renderSectionActionButton('contactInfo')}
          </Box> */}
        </AccordionDetails>
      </Accordion>

      {/* Address */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />} 
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}>
          <Typography>Address</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Country"
                name="country"
                value={editingSections.address ? tempData.address?.country : enrollmentData.address?.country || ""}
                onChange={handleAddressChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.address }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="City"
                name="city"
                value={editingSections.address ? tempData.address?.city : enrollmentData.address?.city || ""}
                onChange={handleAddressChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.address }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Street"
                name="street"
                value={editingSections.address ? tempData.address?.street : enrollmentData.address?.street || ""}
                onChange={handleAddressChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.address }}
              />
            </Grid>
          </Grid>
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            {renderSectionActionButton('address')}
          </Box> */}
        </AccordionDetails>
      </Accordion>

      {/* Faculty Info */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />} 
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}>
          <Typography>Faculty Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Faculty Name"
                name="facultyName"
                value={editingSections.facultyInfo ? tempData.facultyName : enrollmentData.facultyName || ""}
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.facultyInfo }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="GPA"
                name="GPA"
                value={editingSections.facultyInfo ? tempData.GPA : enrollmentData.GPA || ""}
                onChange={handleFieldChange}
                fullWidth
                InputProps={{ readOnly: !editingSections.facultyInfo }}
              />
            </Grid>
          </Grid>
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            {renderSectionActionButton('facultyInfo')}
          </Box> */}
        </AccordionDetails>
      </Accordion>

      {/* Motivation Letter */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />} 
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}>
          <Typography>Motivation Letter</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Motivation Letter"
            name="motivationLetter"
            value={editingSections.motivationLetter ? tempData.motivationLetter : enrollmentData.motivationLetter || ""}
            onChange={handleFieldChange}
            multiline
            rows={4}
            fullWidth
            InputProps={{ readOnly: !editingSections.motivationLetter }}
          />
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            {renderSectionActionButton('motivationLetter')}
          </Box> */}
        </AccordionDetails>
      </Accordion>

      {/* Exam (Read-only) */}
      {/* <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />} 
          sx={{ bgcolor: "#181B21", color: "#46C98B" }}>
          <Typography>Entry Exam Response</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ mb: 1 }}>{enrollmentData.exam?.[0]?.question || "Question 1"}</Typography>
          <Typography>✅ {enrollmentData.exam?.[0]?.answer || "N/A"}</Typography>

          <Box sx={{ mt: 2 }}>
            <Typography sx={{ mb: 1 }}>{enrollmentData.exam?.[1]?.question || "Question 2"}</Typography>
            <Typography>{enrollmentData.exam?.[1]?.answer || "N/A"}</Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography sx={{ mb: 1 }}>{enrollmentData.exam?.[2]?.question || "Question 3"}</Typography>
            <Typography>{enrollmentData.exam?.[2]?.answer || "N/A"}</Typography>
          </Box>
        </AccordionDetails>
      </Accordion> */}

      {/* Exam */}
<Accordion defaultExpanded>
  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ bgcolor: "#181B21", color: "#46C98B" }} />} 
    sx={{ bgcolor: "#181B21", color: "#46C98B" }}>
    <Typography>Entry Exam Response</Typography>
  </AccordionSummary>
  <AccordionDetails>
    {/* Question 1 */}
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ mb: 1 }}>{enrollmentData.exam?.[0]?.question || "Question 1"}</Typography>
      <TextField
        value={enrollmentData.exam?.[0]?.answer || "N/A"}
        fullWidth
        multiline
        rows={2}
        variant="outlined"
        InputProps={{ readOnly: true }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: 'transparent' },
          },
        }}
      />
    </Box>

    {/* Question 2 */}
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ mb: 1 }}>{enrollmentData.exam?.[1]?.question || "Question 2"}</Typography>
      <TextField
        value={enrollmentData.exam?.[1]?.answer || "N/A"}
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        InputProps={{ readOnly: true }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: 'transparent' },
          },
        }}
      />
    </Box>

    {/* Question 3 */}
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ mb: 1 }}>{enrollmentData.exam?.[2]?.question || "Question 3"}</Typography>
      <TextField
        value={enrollmentData.exam?.[2]?.answer || "N/A"}
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        InputProps={{ readOnly: true }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: 'transparent' },
          },
        }}
      />
    </Box>
  </AccordionDetails>
</Accordion>

      <FormControlLabel
        control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
        label={
          <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
            I confirm that all information provided is accurate.
          </Typography>
        }
        sx={{ mt: 2 }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="contained" color="error" onClick={() => navigate("/enrollment/entryExam")}>
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