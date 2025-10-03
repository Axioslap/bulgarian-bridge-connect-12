import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Globe, Award } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [isIPhone, setIsIPhone] = useState(() => /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()));

  // Memoize stats to prevent unnecessary re-renders
  const stats = useMemo(() => [{
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
  }], []);

  // Memoize device detection
  const handleResize = useCallback(() => {
    const newIsMobile = window.innerWidth < 768;
    setIsMobile(newIsMobile);
    
    if (isIPhone) {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  }, [isIPhone]);

  // Optimize image loading
  const preloadImage = useCallback(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      console.warn('Background image failed to load, continuing without it');
      setImageLoaded(true);
    };
    // Use webp format if supported, fallback to png
    img.src = '/lovable-uploads/1184c5a6-8163-4552-9dba-3d1f2157fb51.png';
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    
    // Add resize listener with debounce
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', debouncedResize, { passive: true });
    handleResize();
    
    // Preload image with intersection observer for better performance
    requestIdleCallback(preloadImage, { timeout: 2000 });
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize, preloadImage]);
  return <section className={`relative flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary overflow-hidden ${isIPhone ? 'h-[calc(var(--vh,1vh)*80)] min-h-[600px]' : 'h-[600px] sm:h-[700px]'}`}>
      <div className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-700 ${imageLoaded ? 'opacity-10' : 'opacity-0'}`} style={{
      backgroundImage: imageLoaded ? `url('/lovable-uploads/1184c5a6-8163-4552-9dba-3d1f2157fb51.png')` : 'none',
      transform: isLoaded ? 'scale(1)' : 'scale(1.02)',
      transition: 'transform 0.8s ease-out, opacity 700ms ease-in',
      willChange: 'transform, opacity',
      backgroundSize: isMobile ? 'cover' : 'contain'
    }}></div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60"></div>
      <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }}></div>
      
      <div className={`relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${isIPhone ? 'px-6' : ''}`}>
        
        <h1 className={`font-bold text-foreground mb-8 sm:mb-10 leading-[1.1] tracking-tight ${isIPhone ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl'}`}>
          The marketplace for <span className="gradient-accent-text">US-Bulgaria</span> business connections
        </h1>
        <p className={`text-muted-foreground mb-12 sm:mb-16 leading-relaxed max-w-3xl mx-auto ${isIPhone ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}>
          Connecting business and tech professionals confidently and quickly. Whether networking, securing partnerships, or accessing exclusive events, our community offers transparency, rigor, and frictionless collaboration.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 sm:mb-20">
          <a href="mailto:asen.ivanov@a2balliance.com" className="w-full sm:w-auto">
            <Button variant="premium" size={isMobile ? "default" : "lg"} className={`w-full sm:w-auto touch-manipulation group ${isIPhone ? 'min-h-[48px]' : ''}`}>
              Request a demo
            </Button>
          </a>
          <Link to="/about-partners" className="w-full sm:w-auto">
            <Button variant="ghost" size={isMobile ? "default" : "lg"} className={`w-full sm:w-auto touch-manipulation font-medium ${isIPhone ? 'min-h-[48px]' : ''}`}>
              Talk to an expert
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <p className={`text-sm font-medium text-muted-foreground mb-8 ${isIPhone ? 'text-xs' : ''}`}>Our Targets by 2028</p>
        </div>
        <div className={`grid grid-cols-3 max-w-3xl mx-auto ${isIPhone ? 'gap-4 sm:gap-6' : 'gap-6 sm:gap-8'}`}>
          {stats.map((stat, index) => <div key={index} className="text-center group hover:scale-[1.02] transition-smooth touch-manipulation glass-card rounded-2xl p-6 shadow-elegant hover:shadow-premium">
              <div className={`font-bold text-foreground mb-2 ${isIPhone ? 'text-3xl sm:text-4xl' : 'text-3xl sm:text-5xl'}`}>
                {stat.number}
              </div>
              <div className={`text-muted-foreground font-medium ${isIPhone ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>{stat.label}</div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default HeroSection;