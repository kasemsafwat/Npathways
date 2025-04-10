import { Box, CardMedia, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import image from "../../assets/Rectangle 72.png";
import person from "../../assets/user.png";
import { loadStripe } from "@stripe/stripe-js";
export default function CourseDetails() {
  let [course, setCourse] = React.useState({});
  let [loading, setLoading] = React.useState(true);
  let { id } = useParams();
  let userName = localStorage.getItem("userName");
  async function getSingleCourse() {
    try {
      const response = await axios.get(
        `http://localhost:5024/api/course/${id}`
      );
      setCourse(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  }
  useEffect(() => {
    getSingleCourse();
  }, []);
  const priceAfterDiscount = course.price - course.discount;
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

  const makePayment = async () => {
    try {
      setIsProcessingPayment(true);

      const stripe = await loadStripe(
        "pk_test_51RBR2iDc21UouuAB3g41OrIvrbvj72VbEl4QNUXzYJwNwUvi6XWWE4RNP7VytWVw1T1fe3K96z1EZqDAfe2uOhhy00UJqUHsHN"
      );

      const response = await axios.post(
        "http://localhost:5024/api/payment/create-session",
        { courseId: course._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Check if response has sessionUrl (direct redirect)
      if (response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
        return;
      }

      // Fallback to redirectToCheckout if no sessionUrl
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (result.error) {
        console.error(result.error.message);
        alert("Payment failed: " + result.error.message);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment processing failed. Please try again later.");
    } finally {
      setIsProcessingPayment(false);
    }
  };
  const instructorNames = course.instructors
    ? course.instructors
        .map((instructor) => instructor.firstName + " " + instructor.lastName)
        .join(", ")
    : [];
  return (
    <>
      <Grid container my={2} spacing={2}>
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            alt={course.name}
            image={image}
            sx={{
              objectFit: "cover",
              borderRadius: "16px",
              width: "85%",
              height: "auto",
              margin: "auto",
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ boxShadow: 1, borderRadius: "12px", py: 1 }}
        >
          <Box style={{ width: "90%", margin: "auto" }}>
            <Box sx={{ m: 1 }} display="flex" alignItems="center">
              <Typography
                variant="h5"
                style={{ color: "text.secondary", marginRight: "12px" }}
              >
                ${priceAfterDiscount || "39.99"}
              </Typography>
              <Typography
                variant="body2"
                style={{
                  textDecoration: "line-through",
                  color: "gray",
                }}
              >
                ${course.price || "50.00"}
              </Typography>
            </Box>
            <button
              style={{
                background: "#46C98B",
                width: "100%",
                paddingBlock: "6px",
                color: "white",
                borderRadius: "10px",
                marginTop: "16px",
                fontSize: "14px",
                fontWeight: "bold",
                border: "none",
                cursor: isProcessingPayment ? "not-allowed" : "pointer",
                opacity: isProcessingPayment ? 0.7 : 1,
              }}
              onClick={makePayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? "Processing..." : "Buy"}
            </button>
            <button
              style={{
                width: "100%",
                paddingBlock: "8px",
                color: "grey",
                borderRadius: "15px",
                marginBlock: "10px",
                fontSize: "16px",
                fontWeight: "bold",
                border: "2px solid grey",
              }}
            >
              <i className="fa-regular fa-heart"></i> Wishlist
            </button>
            <Typography variant="subtitle1" sx={{ m: 1 }}>
              <strong>Course Name</strong>: {course.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ m: 1 }}>
              <strong>Course Description</strong>: {course.description}
            </Typography>
            <Typography variant="subtitle1" sx={{ m: 1 }}>
              <strong>Course Status</strong>: {course.status}
            </Typography>
            <Typography variant="subtitle1" sx={{ m: 1 }}>
              <strong>Lessons</strong>: {course?.lessons?.length || 0}
            </Typography>
          </Box>
        </Grid>
        <Box sx={{ ml: "20px", mt: 3 }}>
          <Typography variant="h5" sx={{ m: 2 }}>
            <strong>{course.name}</strong>
          </Typography>
          <Box display="flex" sx={{ my: 2 }}>
            <CardMedia
              component="img"
              alt={course.name}
              image={person}
              sx={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "50%",
                ml: 2,
              }}
            />
            <Typography variant="subtitle1" sx={{ my: "auto", ml: 2 }}>
              <strong>{instructorNames}</strong>
              <br />
              Bim Engineer
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ m: 2 }}>
            <strong>About Course</strong>
          </Typography>
          <Grid item xs={12} md={8}>
            <Typography variant="body1" sx={{ m: 2 }}>
              {course.description}
            </Typography>
          </Grid>
        </Box>
      </Grid>
    </>
  );
}
