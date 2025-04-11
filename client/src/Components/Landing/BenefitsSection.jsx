import React from 'react';
import Slider from 'react-slick';
import { Typography, Box, Card, CardContent, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, School, Code, People, Devices, AssignmentTurnedIn, Timeline, Payment, Analytics } from '@mui/icons-material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const benefits = [
  {
    title: "Personalized Learning Journey",
    description: "Npathways customizes the learning experience based on individual goals, skill levels, and interests—ensuring every learner is on the most effective and relevant path.",
    icon: <School fontSize="large" />
  },
  {
    title: "Skill-Oriented Curriculum",
    description: "Our platform focuses on real-world, job-ready skills. Courses are structured to bridge the gap between theoretical knowledge and practical application.",
    icon: <Code fontSize="large" />
  },
  {
    title: "Mentorship & Community Support",
    description: "Learners get access to experienced mentors and an active community to foster collaboration, peer learning, and professional growth.",
    icon: <People fontSize="large" />
  },
  {
    title: "Multi-Platform Accessibility",
    description: "Npathways is accessible across web and mobile platforms, making learning flexible and convenient—anytime, anywhere.",
    icon: <Devices fontSize="large" />
  },
  {
    title: "Integrated Assessments & Certifications",
    description: "Interactive quizzes, projects, and final assessments provide a clear measure of progress. Learners earn verifiable certificates upon course completion.",
    icon: <AssignmentTurnedIn fontSize="large" />
  },
  {
    title: "Career Path Guidance",
    description: "The platform provides structured roadmaps for various tech roles (e.g., Frontend Developer, Data Analyst), helping learners choose and follow the right path for their ambitions.",
    icon: <Timeline fontSize="large" />
  },
  {
    title: "Affordable & Flexible Payment Options",
    description: "With integrated payment gateways like Stripe, PayPal, and Google Pay, learners can enroll easily. We also offer flexible pricing models to suit different budgets.",
    icon: <Payment fontSize="large" />
  },
  {
    title: "Analytics for Instructors & Admins",
    description: "Instructors and admins can track learner performance, course engagement, and progress through intuitive dashboards and reports.",
    icon: <Analytics fontSize="large" />
  },
];
const ArrowLeft = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      left: -40,
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#46C98B',
      zIndex: 1,
      '&:hover': {
        backgroundColor: 'rgba(70, 201, 139, 0.1)',
      },
    }}
  >
    <ArrowBackIos />
  </IconButton>
);

const ArrowRight = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      right: -40,
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#46C98B',
      zIndex: 1,
      '&:hover': {
        backgroundColor: 'rgba(70, 201, 139, 0.1)',
      },
    }}
  >
    <ArrowForwardIos />
  </IconButton>
);

const BenefitsSection = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <ArrowRight />,
    prevArrow: <ArrowLeft />,
    responsive: [
      {
        breakpoint: 960,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Box
      sx={{
        backgroundColor: '#0B162C',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: { xs: 4, md: 8 },
        position: 'relative',
        minHeight: '800px',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h4"
          color="#F9F9F9"
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            position: 'relative',
            display: 'inline-block',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              backgroundColor: '#46C98B',
              transition: 'all 0.3s ease',
            },
            '&:hover:after': {
              width: '120px',
              backgroundColor: '#F9F9F9',
            }
          }}
        >
          Benefits of Npathways
        </Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          position: 'relative',
          px: { xs: 0, md: 4 },
        }}
      >
        <Slider {...settings}>
          {benefits.map((benefit, index) => (
            <Box key={index} px={2}>
              <Card
                sx={{
                  height: '360px',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#F9F9F9',
                  border: '2px solid #46C98B',
                  borderRadius: '12px',
                  padding: '24px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 15px 30px rgba(70, 201, 139, 0.2)',
                    borderColor: '#0B162C',
                  },
                }}
                elevation={0}
              >
                <CardContent 
                  sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    p: 0,
                  }}
                >
                  <Box sx={{ 
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#46C98B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    color: '#F9F9F9',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#0B162C',
                      transform: 'rotate(15deg) scale(1.1)',
                    }
                  }}>
                    {benefit.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    color="#0B162C"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2,
                      fontSize: '1.25rem',
                      textAlign: 'center',
                    }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="#0B162C"
                    sx={{ 
                      opacity: 0.9,
                      lineHeight: 1.6,
                      textAlign: 'center',
                    }}
                  >
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default BenefitsSection;