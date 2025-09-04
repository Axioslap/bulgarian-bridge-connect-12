import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";

const ExpertsSection = () => {
  const [isIPhone, setIsIPhone] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIPhone(isAppleDevice);
  }, []);

  const experts = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Technology Innovation Consultant",
      company: "TechBridge Solutions",
      location: "Sofia, Bulgaria",
      expertise: ["Digital Transformation", "AI Strategy", "Startup Mentoring"],
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b000?w=400&h=400&fit=crop&crop=face",
      description: "Former Silicon Valley executive with 15+ years helping Bulgarian companies scale internationally.",
      email: "sarah.johnson@techbridge.bg",
      linkedin: "sarah-johnson-tech"
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Business Development Director",
      company: "US-Bulgaria Trade Council",
      location: "Boston, MA",
      expertise: ["Market Entry", "Partnership Strategy", "Cross-border Investments"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description: "Specializes in helping Bulgarian companies enter US markets and establish strategic partnerships.",
      email: "m.chen@ustrade.org",
      linkedin: "michael-chen-trade"
    },
    {
      id: 3,
      name: "Elena Petrov",
      title: "Financial Advisory Partner",
      company: "Atlantic Capital Partners",
      location: "New York, NY",
      expertise: ["Venture Capital", "Financial Planning", "IPO Preparation"],
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      description: "Expert in securing funding for tech startups and established companies looking to expand.",
      email: "elena.petrov@atlanticcap.com",
      linkedin: "elena-petrov-finance"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.05),transparent)] opacity-60"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(239,68,68,0.03),transparent)] opacity-60"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className={`font-bold text-slate-900 mb-4 sm:mb-6 ${
            isIPhone ? 'text-3xl sm:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl'
          }`}>
            Meet Our <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">Experts</span>
          </h2>
          <p className={`text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8 ${
            isIPhone ? 'text-lg sm:text-xl' : 'text-lg sm:text-xl'
          }`}>
            Connect with experienced professionals who can help your company grow and navigate the US-Bulgaria business landscape
          </p>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-6 sm:p-8 max-w-4xl mx-auto">
            <h3 className={`font-bold text-slate-900 mb-6 ${
              isIPhone ? 'text-xl sm:text-2xl' : 'text-xl sm:text-2xl'
            }`}>
              Who This Is For
            </h3>
            <div className="text-left max-w-2xl mx-auto">
              <p className="text-slate-700 font-medium mb-4">
                ✅ Advisors, specialists, and freelancers who want to:
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  Offer trusted, high-value services to our members
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  Connect with entrepreneurs, startups, and growing companies
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  Build long-term, cross-border partnerships
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={`grid gap-6 sm:gap-8 ${
          isIPhone ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {experts.map((expert) => (
            <Card key={expert.id} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg touch-manipulation">
              <CardContent className={`${isIPhone ? 'p-6' : 'p-6'}`}>
                <div className="text-center mb-6">
                  <div className="relative mx-auto mb-4 w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className={`font-bold text-slate-900 mb-1 ${
                    isIPhone ? 'text-xl' : 'text-xl'
                  }`}>
                    {expert.name}
                  </h3>
                  <p className="text-slate-600 font-medium mb-1">{expert.title}</p>
                  <p className="text-slate-500 text-sm mb-2">{expert.company}</p>
                  <div className="flex items-center justify-center text-slate-500 text-sm mb-4">
                    <MapPin className="w-3 h-3 mr-1" />
                    {expert.location}
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-4 leading-relaxed text-center">
                  {expert.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3 text-center">Expertise</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {expert.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-4">
                    Our membership is invitation-only. Contact us to learn more.
                  </p>
                  <a href="mailto:asen.ivanov@a2balliance.com">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`hover:bg-blue-50 hover:border-blue-200 touch-manipulation ${
                        isIPhone ? 'min-h-[44px] px-4' : ''
                      }`}
                    >
                      Contact Us
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="mailto:asen.ivanov@a2balliance.com">
            <Button
              variant="outline"
              className={`shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-blue-600 group touch-manipulation ${
                isIPhone 
                  ? 'px-6 py-3 text-base min-h-[48px]' 
                  : 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg'
              }`}
            >
              Become an Expert
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ExpertsSection;