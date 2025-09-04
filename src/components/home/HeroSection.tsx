import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Globe, Award } from "lucide-react";
import { useState, useEffect } from "react";
const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIPhone, setIsIPhone] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = window.innerWidth < 768;
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsMobile(isMobileDevice);
    setIsIPhone(isAppleDevice);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (isAppleDevice) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.warn('Background image failed to load, continuing without it');
      setImageLoaded(true);
    };
    img.src = isMobileDevice ? '/lovable-uploads/1184c5a6-8163-4552-9dba-3d1f2157fb51.png' : '/lovable-uploads/1184c5a6-8163-4552-9dba-3d1f2157fb51.png';
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const stats = [{
    number: "500+",
    label: "Active Members",
    icon: Users
  }, {
    number: "50+",
    label: "Partner Companies",
    icon: Globe
  }, {
    number: "15+",
    label: "Events Hosted",
    icon: Award
  }];
  return <section className={`relative flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden ${isIPhone ? 'h-[calc(var(--vh,1vh)*80)] min-h-[600px]' : 'h-[600px] sm:h-[700px]'}`}>
      <div className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-700 ${imageLoaded ? 'opacity-15' : 'opacity-0'}`} style={{
      backgroundImage: imageLoaded ? `url('/lovable-uploads/1184c5a6-8163-4552-9dba-3d1f2157fb51.png')` : 'none',
      transform: isLoaded ? 'scale(1)' : 'scale(1.02)',
      transition: 'transform 0.8s ease-out, opacity 700ms ease-in',
      willChange: 'transform, opacity',
      backgroundSize: isMobile ? 'cover' : 'contain'
    }}></div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/70"></div>
      
      <div className={`relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${isIPhone ? 'px-6' : ''}`}>
        
        <h1 className={`font-bold text-slate-900 mb-6 sm:mb-8 drop-shadow-lg leading-tight ${isIPhone ? 'text-3xl sm:text-4xl md:text-6xl' : 'text-3xl sm:text-5xl md:text-7xl'}`}>
          Welcome to <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">American Business & Technology Club</span>
        </h1>
        <p className={`text-slate-700 mb-4 sm:mb-6 leading-relaxed drop-shadow-md max-w-4xl mx-auto ${isIPhone ? 'text-lg sm:text-xl md:text-2xl' : 'text-lg sm:text-xl md:text-3xl'}`}>
          Connecting business and tech professionals with strong <span className="font-semibold text-blue-700 whitespace-nowrap">US-Bulgaria</span> ties
        </p>
        <p className={`text-slate-600 mb-6 sm:mb-8 max-w-3xl mx-auto ${isIPhone ? 'text-base sm:text-lg md:text-xl' : 'text-base sm:text-lg md:text-xl'}`}>
          Join a thriving community of innovators, entrepreneurs, and leaders shaping the future of business and technology
        </p>
        
        <div className="mb-3 sm:mb-4 text-center">
          <p className={`font-semibold text-slate-700 mb-4 sm:mb-6 ${isIPhone ? 'text-base sm:text-lg' : 'text-base sm:text-lg'}`}>Our Target by 2028:</p>
        </div>
        <div className={`grid grid-cols-3 mb-8 sm:mb-12 max-w-2xl mx-auto ${isIPhone ? 'gap-4 sm:gap-6' : 'gap-3 sm:gap-4 md:gap-8'}`}>
          {stats.map((stat, index) => <div key={index} className="text-center group hover:scale-105 transition-transform duration-200 touch-manipulation">
              <div className={`font-bold text-blue-700 mb-1 sm:mb-2 group-hover:text-blue-800 transition-colors ${isIPhone ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-xl sm:text-2xl md:text-4xl'}`}>
                {stat.number}
              </div>
              <div className={`text-slate-600 ${isIPhone ? 'text-sm sm:text-base' : 'text-xs sm:text-sm md:text-base'}`}>{stat.label}</div>
            </div>)}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="mailto:asen.ivanov@a2balliance.com" className="w-full sm:w-auto">
            <Button size={isMobile ? "default" : "lg"} className={`bg-blue-800 hover:bg-blue-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-semibold group w-full sm:w-auto touch-manipulation ${isIPhone ? 'px-8 py-4 text-base min-h-[48px]' : 'px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg'}`}>
              Contact Us to Join
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
          <Link to="/about" className="w-full sm:w-auto">
            <Button variant="outline" size={isMobile ? "default" : "lg"} className={`shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold border-2 border-slate-300 hover:border-blue-600 hover:text-blue-700 w-full sm:w-auto touch-manipulation ${isIPhone ? 'px-6 py-4 text-base min-h-[48px]' : 'px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg'}`}>
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
export default HeroSection;