import { CheckCircle } from "lucide-react";
import { useState, useEffect, useMemo, memo } from "react";

const BenefitsSection = memo(() => {
  const [isIPhone, setIsIPhone] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIPhone(isAppleDevice);
  }, []);

  const benefits = useMemo(() => [
    "Access to exclusive networking events", 
    "Mentorship opportunities with industry leaders", 
    "Professional development workshops", 
    "Job placement assistance", 
    "Business partnership connections", 
    "Cultural exchange programs"
  ], []);

  return (
    <section className="py-12 sm:py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-red-50/50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className={`font-bold text-slate-900 mb-4 sm:mb-6 ${
            isIPhone ? 'text-2xl sm:text-3xl' : 'text-2xl sm:text-3xl md:text-4xl'
          }`}>Why Join American Business & Technology Club?</h2>
          <p className={`text-slate-600 max-w-3xl mx-auto ${
            isIPhone ? 'text-lg sm:text-xl' : 'text-lg sm:text-xl'
          }`}>
            Unlock exclusive opportunities and build meaningful connections in the US-Bulgaria business ecosystem
          </p>
        </div>
        
        <div className={`grid gap-4 sm:gap-6 ${
          isIPhone ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {benefits.map((benefit, index) => (
            <div key={index} className={`flex items-center space-x-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group touch-manipulation ${
              isIPhone ? 'p-4' : 'p-3 sm:p-4'
            }`}>
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className={`text-slate-700 font-medium ${
                isIPhone ? 'text-base' : 'text-sm sm:text-base'
              }`}>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

BenefitsSection.displayName = 'BenefitsSection';

export default BenefitsSection;
