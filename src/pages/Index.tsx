
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PartnersSlider from "@/components/PartnersSlider";
import HeroSection from "@/components/home/HeroSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import VideoSection from "@/components/home/VideoSection";
import EventsSection from "@/components/home/EventsSection";

import CTASection from "@/components/home/CTASection";

const Index = () => {
  const [isIPhone, setIsIPhone] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIPhone(isAppleDevice);
  }, []);

  return (
    <div className="flex flex-col min-h-screen scroll-smooth" style={{ minHeight: isIPhone ? 'calc(var(--vh, 1vh) * 100)' : '100vh' }}>
      <Header />
      <HeroSection />
      <BenefitsSection />
      <PartnersSlider />
      <VideoSection />
      <EventsSection />
      
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
