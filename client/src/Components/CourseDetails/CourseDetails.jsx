import { Box, CardMedia, Grid, Grid2, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import image from "../../assets/Rectangle 72.png";
import { Button } from "bootstrap/dist/js/bootstrap.bundle.min";
export default function CourseDetails() {
  let [course, setCourse] = React.useState({});
  let [loading, setLoading] = React.useState(true);
  let { id } = useParams();
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
              {/* <Button variant="contained">Contained</Button> */}
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
                fontWeight: "bold"
              }}
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
            <i className="fa-regular fa-heart fa-lg"></i>  Wishlist
            </button>
<Typography variant="h5" sx={{ m: 1 }}>
  {course.name}
</Typography >
<Typography variant="h5" sx={{ m: 1 }}>
  {course.description}
</Typography >
<Typography variant="h5" sx={{ m: 1 }}>
  {course.status}
</Typography >
<Typography variant="h5" sx={{ m: 1 }}>
  {course.createdAt}
</Typography >
<Typography variant="h5" sx={{ m: 1 }}>
  {course.updatedAt}
</Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
