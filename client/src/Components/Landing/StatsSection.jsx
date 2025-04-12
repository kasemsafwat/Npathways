import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Icons
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const stats = [
  {
    value: 15000,
    label: "Students Enrolled",
    icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    color: "#46c98b",
  },
  {
    value: 25,
    label: "Expert Instructors",
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    color: "#3683fc",
  },
  {
    value: 95,
    suffix: "%",
    label: "Job Placement Rate",
    icon: <WorkIcon sx={{ fontSize: 40 }} />,
    color: "#f59e0b",
  },
  {
    value: 40,
    suffix: "+",
    label: "Industry Partners",
    icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
    color: "#8b5cf6",
  },
];

// Counter animation hook
const useCounter = (end, start = 0, duration = 1.5) => {
  const [count, setCount] = useState(start);
  const nodeRef = useRef(null);
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    let startTime;
    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * (end - start) + start);

      setCount(currentCount);

      if (progress < 1) {
        nodeRef.current = requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };

    nodeRef.current = requestAnimationFrame(animateCount);

    return () => {
      if (nodeRef.current) {
        cancelAnimationFrame(nodeRef.current);
      }
    };
  }, [end, start, duration, inView]);

  return [count, ref];
};

const StatsSection = () => {
  const theme = useTheme();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: "#0B162C",
        color: "white",
      }}
      component="section"
      aria-labelledby="stats-title"
    >
      <Container maxWidth="lg">
        <Box
          ref={ref}
          component={motion.div}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <Typography
            id="stats-title"
            component={motion.h2}
            variants={itemVariants}
            variant="h2"
            align="center"
            sx={{
              mb: { xs: 3, md: 5 },
              fontWeight: 700,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              color: "white",
            }}
          >
            NPathways Impact
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            {stats.map((stat, index) => {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const [count, countRef] = useCounter(stat.value);

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={index}
                  component={motion.div}
                  variants={itemVariants}
                  ref={countRef}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 4,
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        color: stat.color,
                        p: 1.5,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {stat.icon}
                    </Box>

                    <Typography
                      variant="h3"
                      component="p"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "2rem", md: "2.5rem" },
                        color: "white",
                        mb: 1,
                      }}
                    >
                      {count.toLocaleString()}
                      {stat.suffix || ""}
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default StatsSection;
