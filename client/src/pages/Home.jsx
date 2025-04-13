import React from "react";
import { Box } from "@mui/material";
import BenefitsSection from "../Components/Landing/BenefitsSection";
import FeaturesSection from "../Components/Landing/featuresSection";
import NewHeroSection from "../Components/Landing/NewHeroSection";
import TestimonialsSection from "../Components/Landing/TestimonialsSection";
import StatsSection from "../Components/Landing/StatsSection";
import CTASection from "../Components/Landing/CTASection";

function Home() {
  return (
    <Box sx={{ overflowX: "hidden" }}>
      <NewHeroSection />
      <StatsSection />
      <BenefitsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </Box>
  );
}

export default Home;
