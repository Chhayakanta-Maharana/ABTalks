"use client";

import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import AtmosphericBackground from "@/components/AtmosphericBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import GiantTypography from "@/components/GiantTypography";
import PlatformShowcase from "@/components/PlatformShowcase";
import DataVisualization from "@/components/DataVisualization";
import LivePollSection from "@/components/LivePollSection";
import FeatureCards from "@/components/FeatureCards";
import FullScreenStatement from "@/components/FullScreenStatement";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <AtmosphericBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <LivePollSection />
        <StatsSection />
        <GiantTypography />
        <PlatformShowcase />
        <DataVisualization />
        <FeatureCards />
        <FullScreenStatement />
        <Testimonials />
        <CTASection />
        <Footer />
      </div>
    </SmoothScroll>
  );
}
