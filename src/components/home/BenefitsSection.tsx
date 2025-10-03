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
    <section className="py-20 sm:py-32 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Subtle patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.06),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.04),transparent_50%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className={`font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent leading-tight ${
            isIPhone ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-4xl sm:text-5xl md:text-6xl'
          }`}>
            Why Join Our Community?
          </h2>
          <p className={`text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium ${
            isIPhone ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
          }`}>
            Unlock exclusive opportunities in the US-Bulgaria business ecosystem
          </p>
        </div>
        
        <div className={`grid gap-6 sm:gap-8 ${
          isIPhone ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group flex items-start gap-4 bg-white rounded-2xl shadow-soft hover:shadow-elegant transition-all duration-500 hover:scale-[1.02] border border-slate-200/60 ${
                isIPhone ? 'p-6' : 'p-6 sm:p-8'
              }`}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <span className={`text-slate-700 leading-relaxed font-medium pt-2 ${
                isIPhone ? 'text-base sm:text-lg' : 'text-base sm:text-lg'
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
