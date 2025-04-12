import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SchoolIcon from "@mui/icons-material/School";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  AppBar,
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Fade,
  ListItemIcon,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { debounce } from "lodash";

// Add "How It Works" to the navigation items
let navigationItems = [
  { label: "Home", path: "/", icon: <HomeIcon fontSize="small" /> },
  {
    label: "How It Works",
    path: "/how-it-works",
    icon: <HelpOutlineIcon fontSize="small" />,
  },
  {
    label: "Enrollment",
    path: "/enrollment/Welcome",
    icon: <SchoolIcon fontSize="small" />,
  },
];

// Function to fetch courses for search
const fetchCourses = async () => {
  try {
    const response = await axios.get("http://localhost:5024/api/course/");
    return response.data;
  } catch (error) {
    console.error("Error fetching courses for search:", error);
    throw new Error("Failed to load courses");
  }
};

// Function to search courses with a query parameter and limit to 4 results
const searchCourses = async (query) => {
  if (!query || query.trim().length < 2) return [];

  try {
    const response = await axios.get(
      `http://localhost:5024/api/course/search?q=${encodeURIComponent(query)}`
    );
    // Limit to 4 results
    return response.data.slice(0, 4);
  } catch (error) {
    console.error("Error searching courses:", error);
    throw new Error("Search failed");
  }
};

const NavBarNew = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isAuthenticated,
    logout,
    isEnrolled,
    isStudent,
    isInstructor,
    isLoading,
    user,
  } = useContext(AuthContext);

  // Fetch all courses for initial autocomplete options
  const {
    data: courses,
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    onError: (error) => {
      setErrorMessage("Failed to load courses: " + error.message);
      setShowError(true);
    },
  });

  // Effect to update search results based on courses data
  useEffect(() => {
    if (courses && !searchValue) {
      setSearchResults(courses.slice(0, 4));
    }
  }, [courses]);

  // Handle search debounced function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        // When no search query, show only first 4 courses
        setSearchResults(courses?.slice(0, 4) || []);
        return;
      }

      try {
        // First try to use the specific search endpoint
        const results = await searchCourses(query);
        setSearchResults(results);
      } catch (error) {
        // Fallback to client-side filtering if API search fails
        if (courses) {
          const filtered = courses
            .filter(
              (course) =>
                course.name?.toLowerCase().includes(query.toLowerCase()) ||
                course.description
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
                course.category?.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 4); // Limit to 4 results
          setSearchResults(filtered);
        }
      }
    }, 300),
    [courses]
  );

  // Effect to trigger search when value changes
  useEffect(() => {
    debouncedSearch(searchValue);

    // Cleanup debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchValue, debouncedSearch]);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update navigation based on user role
  useEffect(() => {
    if (isStudent) {
      navigationItems = [
        {
          label: "My Pathway",
          path: "/student/mypathway",
          icon: <SchoolIcon fontSize="small" />,
        },
        {
          label: "Courses",
          path: "/courses",
          icon: <MenuIcon fontSize="small" />,
        },
        {
          label: "Chat",
          path: "/chat",
          icon: <ChatIcon fontSize="small" />,
        },
      ];
    } else if (isInstructor) {
      navigationItems = [
        {
          label: "Instructor Dashboard",
          path: "/instructor/dashboard",
          icon: <DashboardIcon fontSize="small" />,
        },
      ];
    } else {
      // For non-authenticated users or default case
      navigationItems = [
        { label: "Home", path: "/", icon: <HomeIcon fontSize="small" /> },
        {
          label: "How It Works",
          path: "/how-it-works",
          icon: <HelpOutlineIcon fontSize="small" />,
        },
        {
          label: "Enrollment",
          path: "/enrollment/Welcome",
          icon: <SchoolIcon fontSize="small" />,
        },
      ];
    }
  }, [isStudent, isInstructor]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Gets the active state for navigation items
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle search submission
  const handleSearchSubmit = (value) => {
    if (!value) return;

    // Navigate to courses page with search query
    navigate(`/courses?search=${encodeURIComponent(value)}`);
    setSearchValue("");

    if (isMobile) {
      setSearchOpen(false);
    }
  };

  // Handle course selection
  const handleCourseSelect = (course) => {
    if (course && course._id) {
      navigate(`/courseDetails/${course._id}`);
      setSearchValue("");
    }
  };

  // Mobile search handling
  const handleMobileSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  // Handle error snackbar close
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowError(false);
  };

  // Option rendering for Autocomplete
  const renderOption = (props, option) => (
    <Box
      component="li"
      {...props}
      onClick={() => handleCourseSelect(option)}
      sx={{
        cursor: "pointer",
        borderRadius: 1,
        "&:hover": {
          backgroundColor: "rgba(70, 201, 139, 0.1)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          component="img"
          src={option.image || "/course-placeholder.jpg"}
          alt={option.name}
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            mr: 1,
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/course-placeholder.jpg";
          }}
        />
        <Box>
          <Typography variant="body2" noWrap>
            {option.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {option.category || "BIM Course"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const mobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          width: "70%",
          maxWidth: "300px",
          bgcolor: "#0B162C",
          color: "white",
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
        },
      }}
      aria-label="mobile navigation menu"
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {user && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                bgcolor: "#46c98b",
                width: 36,
                height: 36,
                mr: 2,
              }}
            >
              {user.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <AccountCircleIcon />
              )}
            </Avatar>
            <Typography
              variant="subtitle1"
              sx={{ fontFamily: "Poppins-Medium" }}
            >
              {user.name || "User"}
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={handleMobileMenuToggle}
          sx={{ color: "white" }}
          aria-label="close menu"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ bgcolor: "white", opacity: 0.2 }} />

      {/* Mobile search bar within drawer */}
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Autocomplete
          freeSolo
          options={searchResults || []}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name
          }
          loading={coursesLoading}
          onChange={(event, newValue) => {
            if (typeof newValue === "object" && newValue !== null) {
              handleCourseSelect(newValue);
              handleMobileMenuToggle();
            }
          }}
          onInputChange={(event, newInputValue) => {
            setSearchValue(newInputValue);
          }}
          inputValue={searchValue}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search courses..."
              variant="outlined"
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {coursesLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
                startAdornment: (
                  <SearchIcon sx={{ color: "rgba(0, 0, 0, 0.54)", mr: 1 }} />
                ),
                style: { color: "white" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  borderRadius: "30px",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#46c98b",
                  },
                },
                "& .MuiAutocomplete-endAdornment": {
                  color: "white",
                },
                mb: 2,
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit(e.target.value);
                  handleMobileMenuToggle();
                }
              }}
            />
          )}
          renderOption={renderOption}
          noOptionsText="No courses found"
          loadingText="Searching..."
        />
      </Box>

      <List sx={{ pt: 1 }}>
        {navigationItems.map((item) => (
          <ListItem
            key={item.label}
            component={Link}
            to={item.path}
            onClick={handleMobileMenuToggle}
            selected={isActive(item.path)}
            sx={{
              textDecoration: "none",
              color: "white",
              borderRadius: "8px",
              mx: 1,
              mb: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
              },
              "&.Mui-selected": {
                bgcolor: "rgba(70, 201, 139, 0.2)",
                "&:hover": {
                  bgcolor: "rgba(70, 201, 139, 0.3)",
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: "#46c98b", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontFamily: "Poppins-Medium, Helvetica",
                fontWeight: 500,
                fontSize: "1rem",
              }}
            />
          </ListItem>
        ))}
        <Divider sx={{ bgcolor: "white", opacity: 0.2, my: 2 }} />

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={30} sx={{ color: "#46c98b" }} />
          </Box>
        ) : (
          <Box sx={{ px: 2, py: 1 }}>
            {!isEnrolled && isAuthenticated && !isInstructor && (
              <Button
                fullWidth
                sx={{
                  color: "white",
                  backgroundColor: "#46c98b",
                  textTransform: "none",
                  borderRadius: "100px",
                  py: 1.2,
                  fontFamily: "Poppins-Medium, Helvetica",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  mb: 2,
                  boxShadow: "0 4px 10px rgba(70, 201, 139, 0.3)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "#3ab77a",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(70, 201, 139, 0.4)",
                  },
                }}
                variant="contained"
                component={Link}
                to="/enrollment/welcome"
                onClick={handleMobileMenuToggle}
                startIcon={<SchoolIcon />}
                aria-label="Enroll in courses"
              >
                Enroll Now
              </Button>
            )}
            {isInstructor || isStudent ? (
              <Button
                fullWidth
                sx={{
                  color: "white",
                  backgroundColor: "#46c98b",
                  textTransform: "none",
                  borderRadius: "100px",
                  py: 1.2,
                  fontFamily: "Poppins-Medium, Helvetica",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  boxShadow: "0 4px 10px rgba(70, 201, 139, 0.3)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "#3ab77a",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(70, 201, 139, 0.4)",
                  },
                }}
                variant="contained"
                onClick={() => {
                  logout();
                  handleMobileMenuToggle();
                }}
                aria-label="Log out of your account"
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  fullWidth
                  component={Link}
                  to="/login"
                  onClick={handleMobileMenuToggle}
                  sx={{
                    fontFamily: "Poppins-Medium, Helvetica",
                    fontWeight: 500,
                    color: "white",
                    fontSize: "0.875rem",
                    textTransform: "none",
                    mb: 2,
                    border: "1px solid rgba(255,255,255,0.5)",
                    borderRadius: "100px",
                    py: 1.2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                      borderColor: "#fff",
                    },
                  }}
                  aria-label="Log in to your account"
                >
                  Log in
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  component={Link}
                  to="/register"
                  onClick={handleMobileMenuToggle}
                  sx={{
                    bgcolor: "#46c98b",
                    borderRadius: "100px",
                    py: 1.2,
                    fontFamily: "Poppins-Medium, Helvetica",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    boxShadow: "0 4px 10px rgba(70, 201, 139, 0.3)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "#3ab77a",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 12px rgba(70, 201, 139, 0.4)",
                    },
                  }}
                  aria-label="Create a new account"
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </List>
    </Drawer>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: scrolled ? "rgba(11, 22, 44, 0.95)" : "#0B162C",
        height: { xs: searchOpen ? 120 : 70, sm: 80 },
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.15)" : "none",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <Toolbar
        sx={{
          height: "100%",
          px: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Logo and Brand Name */}
        <Box
          display="flex"
          alignItems="center"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        >
          <Box
            component="img"
            src="/pathways_chiropractic-removebg-preview.png"
            alt="Npathways Logo"
            sx={{
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              ml: { xs: 1, sm: 1.5 },
              fontFamily: "Poppins-Bold, Helvetica",
              fontWeight: 700,
              color: "white",
              fontSize: { xs: "1.2rem", sm: "1.4rem" },
              letterSpacing: "-0.40px",
              display: { xs: "none", sm: "block" },
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Npathways
          </Typography>
        </Box>

        {/* Navigation Items - Desktop view */}
        {!isMobile && (
          <Stack
            direction="row"
            spacing={{ sm: 2, md: 3 }}
            sx={{
              ml: { sm: 3, md: 6 },
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            {navigationItems.map((item) => (
              <Tooltip
                key={item.label}
                title={item.label}
                arrow
                enterDelay={700}
              >
                <Box
                  component={Link}
                  to={item.path}
                  sx={{
                    fontFamily: "Poppins-Medium, Helvetica",
                    fontWeight: 500,
                    color: isActive(item.path) ? "#46c98b" : "white",
                    fontSize: "0.9rem",
                    letterSpacing: "-0.18px",
                    cursor: "pointer",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    position: "relative",
                    py: 1,
                    px: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    "&::after": {
                      content: "''",
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      backgroundColor: "#46c98b",
                      borderRadius: "3px",
                      transform: isActive(item.path)
                        ? "scaleX(1)"
                        : "scaleX(0)",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover": {
                      color: "#46c98b",
                      "&::after": {
                        transform: "scaleX(1)",
                      },
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mr: 0.5,
                    }}
                  >
                    {item.icon}
                  </Box>
                  {item.label}
                </Box>
              </Tooltip>
            ))}
          </Stack>
        )}

        {/* Search Box - Desktop view */}
        {!isMobile && (
          <Box
            sx={{
              ml: "auto",
              mr: 2,
              width: { sm: 150, md: 200, lg: 250 },
              height: 46,
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              px: 2,
              borderRadius: "100px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s ease",
              position: "relative",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&:focus-within": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "#46c98b",
                boxShadow: "0 0 0 2px rgba(70, 201, 139, 0.2)",
              },
            }}
          >
            <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.7)", mr: 1 }} />
            <Autocomplete
              freeSolo
              options={searchResults || []}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.name
              }
              loading={coursesLoading}
              onChange={(event, newValue) => {
                if (typeof newValue === "object" && newValue !== null) {
                  handleCourseSelect(newValue);
                }
              }}
              onInputChange={(event, newInputValue) => {
                setSearchValue(newInputValue);
              }}
              inputValue={searchValue}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search Course"
                  variant="standard"
                  aria-label="Search courses"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    endAdornment: (
                      <>
                        {coursesLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                    style: {
                      fontFamily: "Poppins-Medium, Helvetica",
                      fontWeight: 500,
                      color: "white",
                      fontSize: "0.875rem",
                    },
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearchSubmit(e.target.value);
                    }
                  }}
                />
              )}
              renderOption={renderOption}
              noOptionsText="No courses found"
              loadingText="Searching..."
              PaperComponent={({ children, ...props }) => (
                <Paper
                  {...props}
                  sx={{
                    borderRadius: 2,
                    mt: 1,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    maxHeight: 300,
                    overflowY: "auto",
                  }}
                >
                  {children}
                </Paper>
              )}
            />
          </Box>
        )}

        {/* Auth Related Buttons - Desktop view */}
        {!isMobile && (
          <>
            {isLoading ? (
              <Box
                sx={{ display: "flex", width: 140, justifyContent: "center" }}
              >
                <CircularProgress
                  size={24}
                  thickness={4}
                  sx={{ color: "#46c98b" }}
                />
              </Box>
            ) : (
              <>
                {!isEnrolled && isAuthenticated && !isInstructor && (
                  <Button
                    sx={{
                      color: "white",
                      backgroundColor: "#46c98b",
                      textTransform: "none",
                      borderRadius: "100px",
                      px: 3,
                      height: 44,
                      fontFamily: "Poppins-Medium, Helvetica",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      boxShadow: "0 4px 10px rgba(70, 201, 139, 0.3)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "#3ab77a",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 12px rgba(70, 201, 139, 0.4)",
                      },
                    }}
                    variant="contained"
                    component={Link}
                    to="/enrollment/welcome"
                    aria-label="Enroll in courses"
                    startIcon={<SchoolIcon />}
                  >
                    Enroll Now
                  </Button>
                )}
                {isInstructor || isStudent ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Tooltip title={user?.name || "User Profile"}>
                      <Avatar
                        sx={{
                          bgcolor: "#46c98b",
                          width: 38,
                          height: 38,
                          mr: 2,
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 2px 8px rgba(70, 201, 139, 0.5)",
                          },
                        }}
                      >
                        {user?.name ? (
                          user.name.charAt(0).toUpperCase()
                        ) : (
                          <AccountCircleIcon />
                        )}
                      </Avatar>
                    </Tooltip>
                    <Button
                      sx={{
                        color: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        textTransform: "none",
                        borderRadius: "100px",
                        px: 3,
                        height: 44,
                        fontFamily: "Poppins-Medium, Helvetica",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.15)",
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                      }}
                      variant="outlined"
                      onClick={logout}
                      aria-label="Log out of your account"
                    >
                      Logout
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Button
                      component={Link}
                      to="/login"
                      sx={{
                        fontFamily: "Poppins-Medium, Helvetica",
                        fontWeight: 500,
                        color: "white",
                        fontSize: "0.875rem",
                        textTransform: "none",
                        mr: 2,
                        px: 3,
                        height: 44,
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "100px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                          borderColor: "#fff",
                          transform: "translateY(-2px)",
                        },
                      }}
                      aria-label="Log in to your account"
                    >
                      Log in
                    </Button>
                    <Button
                      variant="contained"
                      component={Link}
                      to="/register"
                      sx={{
                        bgcolor: "#46c98b",
                        borderRadius: "100px",
                        px: 3,
                        height: 44,
                        fontFamily: "Poppins-Medium, Helvetica",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        textTransform: "none",
                        boxShadow: "0 4px 10px rgba(70, 201, 139, 0.3)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "#3ab77a",
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 12px rgba(70, 201, 139, 0.4)",
                        },
                      }}
                      aria-label="Create a new account"
                    >
                      Register
                    </Button>
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
            {/* Mobile Search Button */}
            <Tooltip title="Search">
              <IconButton
                sx={{
                  color: "white",
                  mr: 1,
                }}
                aria-label="search courses"
                onClick={handleMobileSearchToggle}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>

            {/* User Avatar for Mobile (when logged in) */}
            {(isInstructor || isStudent) && !isLoading && (
              <Tooltip title={user?.name || "User Profile"}>
                <Avatar
                  sx={{
                    bgcolor: "#46c98b",
                    width: 34,
                    height: 34,
                    mr: 1.5,
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {user?.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <AccountCircleIcon />
                  )}
                </Avatar>
              </Tooltip>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <CircularProgress
                size={24}
                thickness={4}
                sx={{
                  color: "#46c98b",
                  mr: 2,
                }}
              />
            )}

            {/* Menu Button */}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="open menu"
              onClick={handleMobileMenuToggle}
              sx={{
                color: "white",
                backgroundColor: "rgba(255,255,255,0.05)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {/* Mobile Search Bar */}
        {isMobile && searchOpen && (
          <Box
            sx={{
              position: "absolute",
              top: 70,
              left: 0,
              right: 0,
              px: 2,
              py: 1,
              backgroundColor: "#0B162C",
              zIndex: 1200,
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Autocomplete
              freeSolo
              options={searchResults || []}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.name
              }
              loading={coursesLoading}
              onChange={(event, newValue) => {
                if (typeof newValue === "object" && newValue !== null) {
                  handleCourseSelect(newValue);
                }
              }}
              onInputChange={(event, newInputValue) => {
                setSearchValue(newInputValue);
              }}
              inputValue={searchValue}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search courses..."
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {coursesLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                    startAdornment: (
                      <SearchIcon
                        sx={{ color: "rgba(255, 255, 255, 0.7)", mr: 1 }}
                      />
                    ),
                    style: { color: "white" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      borderRadius: "30px",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#46c98b",
                      },
                    },
                    "& .MuiAutocomplete-endAdornment": {
                      color: "white",
                    },
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearchSubmit(e.target.value);
                    }
                  }}
                />
              )}
              renderOption={renderOption}
              noOptionsText="No courses found"
              loadingText="Searching..."
            />
          </Box>
        )}

        {/* Error Snackbar */}
        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseError} severity="error" variant="filled">
            {errorMessage}
          </Alert>
        </Snackbar>

        {/* Mobile Menu Drawer */}
        {mobileMenu}
      </Toolbar>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
    </AppBar>
  );
};

export default NavBarNew;
