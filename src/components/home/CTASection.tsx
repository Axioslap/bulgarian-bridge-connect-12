
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone } from "lucide-react";
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
              Interested in Joining Our <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">Community</span>?
            </h2>
            <p className={`text-white/95 mb-4 sm:mb-6 max-w-4xl mx-auto leading-relaxed drop-shadow-lg ${
              isIPhone ? 'text-lg sm:text-xl md:text-2xl' : 'text-lg sm:text-xl md:text-2xl'
            }`}>
              Our membership is invitation-only. We're building an exclusive network of professionals bridging the U.S. and Bulgaria.
            </p>
            <p className={`text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto ${
              isIPhone ? 'text-base sm:text-lg' : 'text-base sm:text-lg'
            }`}>
              Get in touch with us to learn about membership opportunities and how you can be part of our growing community.
            </p>
            
            <div className="flex flex-col gap-6 max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="mailto:asen.ivanov@a2balliance.com" className="w-full sm:w-auto">
                  <Button 
                    size={isMobile ? "default" : "lg"} 
                    className={`bg-blue-600 text-white hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-semibold group w-full sm:w-auto touch-manipulation border-2 border-blue-500 hover:border-blue-400 ${
                      isIPhone 
                        ? 'px-8 py-4 text-base min-h-[48px]' 
                        : 'px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg'
                    }`}
                  >
                    <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Contact Us by Email
                  </Button>
                </a>
                
                <a href="https://wa.me/359877032223" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size={isMobile ? "default" : "lg"} 
                    className={`border-2 border-blue-500 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold w-full sm:w-auto touch-manipulation ${
                      isIPhone 
                        ? 'px-6 py-4 text-base min-h-[48px]' 
                        : 'px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg'
                    }`}
                  >
                    <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    WhatsApp / Viber
                  </Button>
                </a>
              </div>
              
              <div className="text-center">
                <p className="text-white/80 text-sm mb-2">Or call us directly:</p>
                <a href="tel:+359877032223" className="text-white font-semibold hover:text-blue-300 transition-colors">
                  +359 877 032223
                </a>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Link to="/about" className="w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  size={isMobile ? "default" : "lg"} 
                  className={`text-white border-2 border-white/30 hover:text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 font-medium w-full sm:w-auto touch-manipulation ${
                    isIPhone 
                      ? 'px-6 py-3 text-sm min-h-[44px]' 
                      : 'px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base'
                  }`}
                >
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
