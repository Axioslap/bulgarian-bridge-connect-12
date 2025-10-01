import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PartnersSlider from "@/components/PartnersSlider";
import HeroSection from "@/components/home/HeroSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import VideoSection from "@/components/home/VideoSection";
import EventsSection from "@/components/home/EventsSection";
import CTASection from "@/components/home/CTASection";
import SEO from "@/components/common/SEO";

const Index = () => {
  const [isIPhone, setIsIPhone] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIPhone(isAppleDevice);
  }, []);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "American Business & Technology Club",
    "description": "Connecting business and tech professionals with strong US-Bulgaria ties",
    "url": window.location.origin,
    "logo": `${window.location.origin}/lovable-uploads/1184c5a6-8163-4552-9dba-3d1f2157fb51.png`,
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "asen.ivanov@a2balliance.com",
      "contactType": "General Inquiries"
    }
  };

  return (
    <>
      <SEO
        title="American Business & Technology Club | US-Bulgaria Professional Network"
        description="Join a thriving community of innovators, entrepreneurs, and leaders shaping the future of business and technology. Connect with professionals with strong US-Bulgaria ties."
        keywords="business networking, technology professionals, US Bulgaria, American club, tech community, entrepreneurship, innovation, international business"
        structuredData={structuredData}
      />
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
    </>
  );
};

export default Index;
