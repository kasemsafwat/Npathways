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
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

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

const NavBarNew = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    isAuthenticated,
    logout,
    isEnrolled,
    isStudent,
    isInstructor,
    isLoading,
    user,
  } = useContext(AuthContext);

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
        {
          label: "How It Works",
          path: "/how-it-works",
          icon: <HelpOutlineIcon fontSize="small" />,
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
      <List sx={{ pt: 2 }}>
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
        height: { xs: 70, sm: 80 },
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
              options={[]}
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
                    style: {
                      fontFamily: "Poppins-Medium, Helvetica",
                      fontWeight: 500,
                      color: "white",
                      fontSize: "0.875rem",
                    },
                  }}
                />
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
                    <Tooltip
                      title={user?.name || "User Profile"}
                      onClick={() => {
                        if (isInstructor) {
                          navigate("/instructor/dashboard");
                        }
                        if (isStudent) {
                          navigate("/student/mypathway");
                        }
                      }}
                    >
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
            {!isSmallScreen && (
              <Tooltip title="Search">
                <IconButton
                  sx={{
                    color: "white",
                    mr: 1,
                  }}
                  aria-label="search courses"
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* User Avatar for Mobile (when logged in) */}
            {(isInstructor || isStudent) && !isLoading && (
              <Tooltip
                title={user?.name || "User Profile"}
                onClick={() => {
                  if (isInstructor) {
                    navigate("/instructor/dashboard");
                  }
                  if (isStudent) {
                    navigate("/student/mypathway");
                  }
                }}
              >
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

        {/* Mobile Menu Drawer */}
        {mobileMenu}
      </Toolbar>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
    </AppBar>
  );
};

export default NavBarNew;
