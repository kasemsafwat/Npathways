import { Box, CardMedia, Grid, Grid2, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import image from "../../assets/Rectangle 72.png";
import person from "../../assets/user.png";
import { Button } from "bootstrap/dist/js/bootstrap.bundle.min";
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
      // console.log(localStorage)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  }
  useEffect(() => {
    getSingleCourse();
  }, []);

  const makePayment = async () => {
    const stripe = await loadStripe(process.env.PUBLISH_KEY);

    const body = {
      amount: course.priceAfterDiscount || 39.99,
    };
    const response = await axios.post(
      `http://localhost:5024/api/payment/create-checkout-session`,
      body,
      { "Content-Type": "application/json" }
    );
    const session = response.data;
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  };
  return (
    <>
      <Grid container my={5}>
        <Grid xs={12} md={7}>
          <CardMedia
            component="img"
            alt={course.name}
            image={image}
            sx={{
              objectFit: "cover",
              borderRadius: "30px",
              width: "90%",
              margin: "auto",
            }}
          />
        </Grid>
        <Grid xs={12} md={4} boxShadow={2}>
          <Box style={{ width: "95%", margin: "auto" }}>
            <Box
              variant="body1"
              sx={{ m: 3 }}
              display="flex"
              alignItems="center"
            >
              <Typography
                variant="h3"
                style={{ color: "text.secondary", marginRight: "60px" }}
              >
                ${course.priceAfterDiscount || "39.99"}
              </Typography>
              <Typography
                variant="h6"
                style={{
                  textDecoration: "line-through",
                  color: "gray",
                }}
              >
                ${course.priceBeforeDiscount || "50.00"}
              </Typography>
            </Box>
            <button
              style={{
                background: "#46C98B",
                width: "100%",
                paddingBlock: "10px",
                color: "white",
                borderRadius: "20px",
                marginTop: "30px",
                fontSize: "25px",
                fontWeight: "bold",
              }}
              onClick={makePayment}
            >
              Buy
            </button>
            <button
              style={{
                width: "100%",
                paddingBlock: "10px",
                color: "grey",
                borderRadius: "20px",
                marginBlock: "10px",
                fontSize: "25px",
                fontWeight: "bolder",
                border: "3px solid grey",
              }}
            >
              <i className="fa-regular fa-heart fa-lg"></i> Wishlist
            </button>
            <Typography variant="h6" sx={{ m: 1 }}>
              <strong>Course Name</strong>: {course.name}
            </Typography>
            <Typography variant="h6" sx={{ m: 1 }}>
              <strong>Course Description</strong>: {course.description}
            </Typography>
            <Typography variant="h6" sx={{ m: 1 }}>
              <strong>Course Status</strong>: {course.status}
            </Typography>
            <Typography variant="h6" sx={{ m: 1 }}>
              <strong>Lessons</strong>: {course?.lessons?.length || 0}
            </Typography>
          </Box>
        </Grid>
        <Box sx={{ ml: "20px" }}>
          <Typography variant="h4" sx={{ m: 2 }}>
            <strong>Lorem ipsum dolor sit amet.</strong>
          </Typography>
          <Box container my={5} display="flex">
            <CardMedia
              component="img"
              alt={course.name}
              image={person}
              sx={{
                width: "10%",
                objectFit: "cover",
                borderRadius: "30px",
                marginLeft: "20px",
              }}
            ></CardMedia>
            <Typography variant="h5" sx={{ my: "auto", ml: 2 }}>
              <strong>{userName}</strong>
              <br />
              Bim Engineer
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ m: 2 }}>
            <strong>About Course</strong>
          </Typography>
          <Grid xs={8}>
            <Typography variant="h6" sx={{ m: 2 }}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Voluptatum similique itaque deserunt, ducimus dolorum officia,
              quia ipsum, doloremque mollitia et cumque id accusantium vero
              quas? Itaque tenetur voluptatem omnis qui odit exercitationem
              corporis dicta repellendus eum odio maxime aperiam, neque illum et
              sequi alias nihil deleniti nobis fugiat. Temporibus voluptate quae
              provident veniam, obcaecati minima sunt beatae ab! Dolore enim nam
              maxime dolor eius illo mollitia explicabo inventore iste fugiat
              officiis cumque
            </Typography>
          </Grid>
        </Box>
      </Grid>
    </>
  );
}
