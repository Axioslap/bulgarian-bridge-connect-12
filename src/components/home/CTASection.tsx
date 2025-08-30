
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const CTASection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isIPhone, setIsIPhone] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = window.innerWidth < 768;
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    
    setIsMobile(isMobileDevice);
    setIsIPhone(isAppleDevice);
  }, []);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url('/lovable-uploads/2cc62f2e-d04c-4da0-8baf-406cc6eccd43.png')`
      }}></div>
      
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-red-900/40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative bg-black/30 rounded-3xl shadow-2xl text-center overflow-hidden backdrop-blur-sm border border-white/20 ${
          isIPhone ? 'p-8 sm:p-12' : 'p-8 sm:p-12 md:p-20'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="absolute top-10 right-10 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-white/10 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-white/5 animate-pulse delay-200"></div>
          
          <div className="relative">
            <h2 className={`font-bold text-white mb-6 sm:mb-8 drop-shadow-2xl leading-tight ${
              isIPhone ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-3xl sm:text-4xl md:text-6xl'
            }`}>
              Ready to Join Our <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">Community</span>?
            </h2>
            <p className={`text-white/95 mb-4 sm:mb-6 max-w-4xl mx-auto leading-relaxed drop-shadow-lg ${
              isIPhone ? 'text-lg sm:text-xl md:text-2xl' : 'text-lg sm:text-xl md:text-2xl'
            }`}>
              Become a member today and gain access to exclusive events, resources, and a network of professionals bridging the U.S. and Bulgaria.
            </p>
            <p className={`text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto ${
              isIPhone ? 'text-base sm:text-lg' : 'text-base sm:text-lg'
            }`}>
              Join over 500 professionals who are already building the future of US-Bulgaria business relations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link to="/register" className="w-full sm:w-auto">
                <Button 
                  size={isMobile ? "default" : "lg"} 
                  className={`bg-white text-blue-800 hover:bg-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-semibold group w-full sm:w-auto touch-manipulation ${
                    isIPhone 
                      ? 'px-8 py-4 text-base min-h-[48px]' 
                      : 'px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg'
                  }`}
                >
                  Join American Business & Technology Club
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size={isMobile ? "default" : "lg"} 
                  className={`border-2 border-white text-white hover:bg-white hover:text-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold w-full sm:w-auto touch-manipulation ${
                    isIPhone 
                      ? 'px-6 py-4 text-base min-h-[48px]' 
                      : 'px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg'
                  }`}
                >
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
