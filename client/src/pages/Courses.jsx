import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  InputAdornment,
  TextField,
  Skeleton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Pagination,
  Backdrop,
  CircularProgress,
  useMediaQuery,
  Alert,
  AlertTitle,
  Paper,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { styled, alpha, useTheme } from "@mui/material/styles";
import axios from "axios";
import CoursesCard from "../Components/Courses/CoursesCard";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import SortIcon from "@mui/icons-material/Sort";

// Styled components
const SearchInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 50,
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.07)",
    },
    "&.Mui-focused": {
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.09)",
    },
  },
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
  position: "relative",
  display: "inline-block",
  marginBottom: theme.spacing(1),
  fontWeight: 700,
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: 60,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
  },
}));

function Courses() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // State variables
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:5024/api/course/");
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter and sort courses
  useEffect(() => {
    let result = [...courses];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.name?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query) ||
          course.instructors?.some((instructor) =>
            `${instructor.firstName} ${instructor.lastName}`
              .toLowerCase()
              .includes(query)
          )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "price-low":
        result.sort((a, b) => a.price - a.discount - (b.price - b.discount));
        break;
      case "price-high":
        result.sort((a, b) => b.price - b.discount - (a.price - a.discount));
        break;
      case "popular":
      default:
        // Assuming there's an enrollmentCount field, or you could use a different metric
        result.sort(
          (a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0)
        );
        break;
    }

    setFilteredCourses(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [courses, searchQuery, sortBy]);

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const pageCount = Math.ceil(filteredCourses.length / coursesPerPage);

  // Event handlers
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top when changing page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Generate skeleton loaders for loading state
  const skeletonCards = Array(8)
    .fill(0)
    .map((_, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
        <Skeleton
          variant="rounded"
          height={340}
          animation="wave"
          sx={{ borderRadius: 4 }}
        />
      </Grid>
    ));

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ mb: 5 }}
      >
        <SectionHeading variant="h4" component="h1">
          Explore Our Courses
        </SectionHeading>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 2, maxWidth: 800 }}
        >
          Discover comprehensive Building Information Modeling (BIM) courses
          designed to enhance your skills and advance your career in digital
          construction and architecture.
        </Typography>
      </Box>

      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        sx={{ mb: 4 }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Search field */}
          <Grid item xs={12} md={8}>
            <SearchInput
              fullWidth
              placeholder="Search courses, topics, or instructors..."
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              aria-label="Search courses"
            />
          </Grid>

          {/* Sort dropdown */}
          <Grid item xs={12} md={4}>
            <StyledFormControl fullWidth size="medium">
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="popular">Most Popular</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
              </Select>
            </StyledFormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Results summary */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
        component={motion.div}
        variants={itemVariants}
      >
        <Typography variant="subtitle1" color="text.secondary">
          Showing{" "}
          {filteredCourses.length > 0
            ? `${indexOfFirstCourse + 1}-${Math.min(
                indexOfLastCourse,
                filteredCourses.length
              )} of ${filteredCourses.length}`
            : "0"}{" "}
          courses
        </Typography>
      </Box>

      {/* Error display */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 4 }}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Course grid */}
      <Grid
        container
        spacing={3}
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          // Show skeleton loaders while loading
          skeletonCards
        ) : filteredCourses.length > 0 ? (
          // Show course cards
          currentCourses.map((course) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={course._id}
              component={motion.div}
              variants={itemVariants}
            >
              <CoursesCard course={course} />
            </Grid>
          ))
        ) : (
          // No courses found
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 2,
              }}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <SchoolIcon
                sx={{
                  fontSize: 60,
                  color: "text.secondary",
                  opacity: 0.3,
                  mb: 2,
                }}
              />
              <Typography variant="h6" gutterBottom>
                No courses found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filter criteria to find what
                you&apos;re looking for.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Pagination */}
      {filteredCourses.length > coursesPerPage && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 6,
            mb: 2,
          }}
          component={motion.div}
          variants={itemVariants}
        >
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Loading backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}

export default Courses;
