import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  CardMedia,
  Grid,
  Typography,
  Container,
  Paper,
  Button,
  Divider,
  Chip,
  Avatar,
  Rating,
  Skeleton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
  Tabs,
  Tab,
  Breadcrumbs,
  CircularProgress,
  Card,
  CardContent,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { AuthContext } from "../../contexts/AuthContext";
import image from "../../assets/Rectangle 72.png";
import person from "../../assets/user.png";

// Icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LinkIcon from "@mui/icons-material/Link";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

// Styled components
const CourseImage = styled(CardMedia)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  height: 400,
  boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12)",
  [theme.breakpoints.down("md")]: {
    height: 300,
  },
  [theme.breakpoints.down("sm")]: {
    height: 220,
  },
}));

const PriceTag = styled(Box)(({ theme, hasDiscount }) => ({
  display: "inline-block",
  backgroundColor: hasDiscount
    ? theme.palette.success.light
    : theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(0.5, 2),
  borderRadius: theme.spacing(5),
  fontWeight: 700,
  fontSize: "1.2rem",
}));

const CourseActionButton = styled(Button)(({ theme, purchased }) => ({
  borderRadius: theme.spacing(5),
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  fontSize: "1rem",
  textTransform: "none",
  boxShadow: purchased ? "none" : theme.shadows[2],
  backgroundColor: purchased
    ? theme.palette.grey[500]
    : theme.palette.primary.main,
  "&:hover": {
    backgroundColor: purchased
      ? theme.palette.grey[600]
      : theme.palette.primary.dark,
    boxShadow: purchased ? "none" : theme.shadows[4],
  },
  transition: "all 0.3s ease",
}));

const InstructorAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100%",
  borderRadius: theme.shape.borderRadius * 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(4),
  paddingBottom: theme.spacing(1),
  fontWeight: 700,
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 60,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

export default function CourseDetails() {
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Check if user has already purchased this course
  useEffect(() => {
    if (user && user.courses && user.courses.includes(id)) {
      setAlreadyPurchased(true);
    }
  }, [user, id]);

  // Fetch course details
  async function getSingleCourse() {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:5024/api/course/${id}`
      );

      // Handle course image
      let courseImage = response.data.image;
      if (courseImage) {
        try {
          await axios.get(courseImage);
        } catch (error) {
          courseImage = image;
        }
      } else {
        courseImage = image;
      }

      setCourse({
        ...response.data,
        image: courseImage,
      });
    } catch (error) {
      console.error("Error fetching course details:", error);
      setError("Failed to load course details. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSingleCourse();
  }, [id]);

  // Calculate price after discount
  const priceAfterDiscount = course.price - (course.discount || 0);
  const hasDiscount = course.discount > 0;

  // Handle payment process
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

      if (response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (result.error) {
        console.error(result.error.message);
        setError("Payment failed: " + result.error.message);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setError("Payment processing failed. Please try again later.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Format instructor names
  const instructorNames = course.instructors
    ? course.instructors
        .map((instructor) =>
          `${instructor.firstName || ""} ${instructor.lastName || ""}`.trim()
        )
        .filter((name) => name)
        .join(", ")
    : "Instructor information unavailable";

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Toggle bookmark
  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // You would typically save this to user preferences via API call
  };
  console.log(course);
  // Generate course features
  const courseFeatures = [
    {
      icon: <AccessTimeIcon color="primary" />,
      label: "Duration",
      value: course.lessons
        ? `${course.lessons.reduce(
            (total, lesson) => total + (lesson.duration || 0),
            0
          )} mins`
        : "Self-paced",
    },
    {
      icon: <EventNoteIcon color="primary" />,
      label: "Last Updated",
      value: new Date(course.updatedAt || Date.now()).toLocaleDateString(),
    },
    {
      icon: <PeopleIcon color="primary" />,
      label: "Enrolled",
      value: course.enrollmentCount || "0 students",
    },
    {
      icon: <PlayArrowIcon color="primary" />,
      label: "Lessons",
      value: `${course?.lessons?.length || 0} lessons`,
    },
  ];

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          alignItems="center"
          mb={3}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
          <Skeleton variant="text" width={150} height={30} />
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 4, mb: 2 }}
            />
            <Skeleton variant="text" height={60} width="80%" />
            <Skeleton variant="text" height={25} width="40%" />
            <Box sx={{ mt: 3 }}>
              <Skeleton
                variant="rectangular"
                height={50}
                sx={{ borderRadius: 2, mb: 2 }}
              />
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 4 }}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert
          severity="error"
          variant="outlined"
          action={
            <Button color="inherit" onClick={getSingleCourse}>
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="contained"
            onClick={() => navigate("/courses")}
          >
            Back to Courses
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Breadcrumbs navigation */}
      <Box
        mb={3}
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Button
            color="inherit"
            onClick={() => navigate("/courses")}
            startIcon={<ArrowBackIcon />}
            sx={{ textTransform: "none" }}
          >
            Courses
          </Button>
          <Typography color="text.primary" fontWeight={500}>
            {course.name || "Course Details"}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={4}>
        {/* Left content - Course details */}
        <Grid item xs={12} md={8}>
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Course image */}
            <CourseImage
              component="img"
              image={course.image}
              alt={course.name}
              sx={{
                width: "100%",
                objectFit: "cover",
                mb: 3,
              }}
            />

            {/* Course title and category */}
            <Box mb={4}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Chip
                  label={course.category || "BIM Course"}
                  color="primary"
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />

                {/* <Box>
                  <Tooltip
                    title={
                      isBookmarked ? "Remove from saved" : "Save for later"
                    }
                  >
                    <IconButton
                      aria-label={
                        isBookmarked ? "Remove from saved" : "Save for later"
                      }
                      onClick={handleToggleBookmark}
                      color={isBookmarked ? "primary" : "default"}
                      sx={{ ml: 1 }}
                    >
                      {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Share course">
                    <IconButton aria-label="Share course" sx={{ ml: 1 }}>
                      <LinkIcon />
                    </IconButton>
                  </Tooltip>
                </Box> */}
              </Box>

              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h1"
                fontWeight={700}
                gutterBottom
              >
                {course.name}
              </Typography>

              <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
                {/* Instructor info */}
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={
                      (course.instructors && course.instructors[0]?.avatar) ||
                      person
                    }
                    alt={instructorNames.split(",")[0]}
                    sx={{ mr: 1, border: "2px solid white", boxShadow: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    By{" "}
                    <Typography
                      component="span"
                      color="text.primary"
                      fontWeight={500}
                    >
                      {instructorNames}
                    </Typography>
                  </Typography>
                </Box>

                {/* Course rating */}
                <Box display="flex" alignItems="center">
                  <Rating
                    value={course.rating || 4.5}
                    precision={0.5}
                    readOnly
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    (
                    {course.reviewCount || Math.floor(Math.random() * 500) + 10}{" "}
                    reviews)
                  </Typography>
                </Box>

                {/* Enrollment count */}
                <Chip
                  icon={<PeopleIcon />}
                  label={`${course.enrollmentCount || 120} enrolled`}
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            </Box>

            {/* Tabs navigation */}
            <Box mb={4}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="course details tabs"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  mb: 3,
                }}
              >
                <Tab label="Overview" id="tab-0" aria-controls="tabpanel-0" />
                {course.instructors && course.instructors.length > 0 && (
                  <Tab
                    label="Instructors"
                    id="tab-1"
                    aria-controls="tabpanel-1"
                  />
                )}
              </Tabs>

              {/* Tab Panel - Overview */}
              <div
                role="tabpanel"
                hidden={activeTab !== 0}
                id="tabpanel-0"
                aria-labelledby="tab-0"
              >
                {activeTab === 0 && (
                  <Fade in>
                    <Box>
                      {/* Description */}
                      <SectionTitle variant="h5" component="h2">
                        About This Course
                      </SectionTitle>
                      <Typography
                        variant="body1"
                        paragraph
                        sx={{
                          lineHeight: 1.7,
                          color: "text.secondary",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {course.description ||
                          "No description available for this course."}
                      </Typography>

                      {/* Course features grid */}
                      <Grid container spacing={3} sx={{ mt: 4 }}>
                        {courseFeatures.map((feature, index) => (
                          <Grid item xs={6} sm={3} key={index}>
                            <FeatureCard elevation={1}>
                              {feature.icon}
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                                sx={{ mt: 1 }}
                              >
                                {feature.label}
                              </Typography>
                              <Typography
                                variant="subtitle2"
                                align="center"
                                fontWeight={600}
                                sx={{ mt: 0.5 }}
                              >
                                {feature.value}
                              </Typography>
                            </FeatureCard>
                          </Grid>
                        ))}
                      </Grid>

                      {/* What you'll learn section */}
                      <Box sx={{ mt: 4 }}>
                        <SectionTitle variant="h5" component="h2">
                          What You&apos;ll Learn
                        </SectionTitle>
                        <Grid container spacing={2}>
                          {course.objectives?.length > 0 ? (
                            course.objectives.map((objective, index) => (
                              <Grid item xs={12} sm={6} key={index}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <CheckCircleIcon
                                    color="success"
                                    sx={{ mr: 1, mt: 0.25 }}
                                    fontSize="small"
                                  />
                                  <Typography variant="body1">
                                    {objective}
                                  </Typography>
                                </Box>
                              </Grid>
                            ))
                          ) : (
                            <Grid item xs={12}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Learning objectives not specified for this
                                course.
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </Box>
                  </Fade>
                )}
              </div>

              {/* Tab Panel - Instructors */}
              {course.instructors && course.instructors.length > 0 && (
                <div
                  role="tabpanel"
                  hidden={activeTab !== 1}
                  id="tabpanel-1"
                  aria-labelledby="tab-1"
                >
                  {activeTab === 1 && (
                    <Fade in>
                      <Box>
                        <SectionTitle variant="h5" component="h2">
                          Meet Your Instructors
                        </SectionTitle>

                        <Grid container spacing={4}>
                          {course.instructors.map((instructor, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                              <Card
                                variant="outlined"
                                sx={{
                                  borderRadius: 2,
                                  overflow: "visible",
                                  position: "relative",
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    boxShadow: 3,
                                    transform: "translateY(-5px)",
                                  },
                                }}
                              >
                                <CardContent sx={{ pb: 2 }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: {
                                        xs: "column",
                                        sm: "row",
                                      },
                                      alignItems: {
                                        xs: "center",
                                        sm: "flex-start",
                                      },
                                      mb: 2,
                                    }}
                                  >
                                    <InstructorAvatar
                                      src={instructor.avatar || person}
                                      alt={`${instructor.firstName || ""} ${
                                        instructor.lastName || ""
                                      }`}
                                      sx={{
                                        mb: { xs: 2, sm: 0 },
                                        mr: { sm: 2 },
                                      }}
                                    />
                                    <Box>
                                      <Typography variant="h6" fontWeight={600}>
                                        {`${instructor.firstName || ""} ${
                                          instructor.lastName || ""
                                        }`.trim() || "Instructor"}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        {instructor.title || "BIM Expert"}
                                      </Typography>
                                      <Rating
                                        value={instructor.rating || 4.8}
                                        readOnly
                                        size="small"
                                        precision={0.1}
                                      />
                                    </Box>
                                  </Box>

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {instructor.bio ||
                                      "This instructor has not added a bio yet."}
                                  </Typography>

                                  <Box
                                    sx={{
                                      mt: 2,
                                      display: "flex",
                                      gap: 1,
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <Chip
                                      icon={<SchoolIcon fontSize="small" />}
                                      label={`${
                                        instructor.courseCount ||
                                        Math.floor(Math.random() * 10) + 1
                                      } Courses`}
                                      size="small"
                                      variant="outlined"
                                    />
                                    <Chip
                                      icon={<PeopleIcon fontSize="small" />}
                                      label={`${
                                        instructor.students ||
                                        Math.floor(Math.random() * 1000) + 100
                                      } Students`}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Fade>
                  )}
                </div>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Right sidebar - Course purchase card */}
        <Grid item xs={12} md={4}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{ position: "sticky", top: 100 }}
          >
            <Card
              elevation={4}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
            >
              <CardMedia
                component="img"
                image={course.image}
                alt={course.name}
                height={180}
              />

              <CardContent sx={{ p: 3 }}>
                {/* Price display */}
                <Box mb={3}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <PriceTag hasDiscount={hasDiscount}>
                      ${priceAfterDiscount || "39.99"}
                    </PriceTag>

                    {hasDiscount && (
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: "line-through",
                          color: "text.disabled",
                        }}
                      >
                        ${course.price}
                      </Typography>
                    )}

                    {hasDiscount && (
                      <Chip
                        label={`${Math.round(
                          (course.discount / course.price) * 100
                        )}% off`}
                        color="error"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Stack>

                  <Typography variant="caption" color="text.secondary">
                    Full lifetime access
                  </Typography>
                </Box>

                {/* Action buttons */}
                <Stack spacing={2} mb={3}>
                  <CourseActionButton
                    variant="contained"
                    fullWidth
                    purchased={alreadyPurchased}
                    startIcon={
                      alreadyPurchased ? (
                        <CheckCircleIcon />
                      ) : (
                        <ShoppingCartIcon />
                      )
                    }
                    onClick={makePayment}
                    disabled={isProcessingPayment || alreadyPurchased}
                    aria-label={
                      isProcessingPayment
                        ? "Processing payment"
                        : alreadyPurchased
                        ? "Already purchased"
                        : "Buy this course"
                    }
                  >
                    {isProcessingPayment ? (
                      <>
                        <CircularProgress
                          size={20}
                          color="inherit"
                          sx={{ mr: 1 }}
                        />
                        Processing...
                      </>
                    ) : alreadyPurchased ? (
                      "Purchased"
                    ) : (
                      "Buy Now"
                    )}
                  </CourseActionButton>

                  {alreadyPurchased && (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<PlayArrowIcon />}
                      onClick={() => navigate(`/courseContent/${course._id}`)}
                      sx={{
                        borderRadius: 5,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Continue Learning
                    </Button>
                  )}
                </Stack>

                {/* Course includes */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    This course includes:
                  </Typography>
                  <List dense disablePadding>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <PlayArrowIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${course?.lessons?.length || 0} lessons`}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <AccessTimeIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={course.duration || "Self-paced learning"}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <DescriptionIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Downloadable resources"
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <AssignmentIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Completion certificate"
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <VerifiedIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Full lifetime access"
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
