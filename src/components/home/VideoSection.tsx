
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const VideoSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isIPhone, setIsIPhone] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = window.innerWidth < 768;
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    
    setIsMobile(isMobileDevice);
    setIsIPhone(isAppleDevice);
  }, []);

  const featuredVideos = [{
    id: 1,
    title: "Building Tech Bridges: Bulgaria-US Partnerships",
    description: "A discussion on fostering international tech collaboration",
    duration: "15:30",
    thumbnail: "/placeholder.svg"
  }, {
    id: 2,
    title: "Educational Excellence: My Harvard Experience",
    description: "Personal story about studying at Harvard Business School",
    duration: "22:45",
    thumbnail: "/placeholder.svg"
  }, {
    id: 3,
    title: "Starting a Business in Sofia",
    description: "Entrepreneurship journey in Bulgaria's capital",
    duration: "18:20",
    thumbnail: "/placeholder.svg"
  }, {
    id: 4,
    title: "Community Impact: Giving Back",
    description: "How ABTC members are making a difference",
    duration: "12:15",
    thumbnail: "/placeholder.svg"
  }];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url('/lovable-uploads/65c1a96b-0098-4b43-9e35-3e825d4e89b8.png')`
      }}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/80 to-slate-900/85"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className={`font-bold mb-4 sm:mb-6 text-white ${
            isIPhone ? 'text-3xl sm:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl'
          }`}>Storytelling - Videos</h2>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 to-red-500 mx-auto mb-6 sm:mb-8 rounded-full"></div>
          <p className={`text-white/90 max-w-4xl mx-auto leading-relaxed ${
            isIPhone ? 'text-lg sm:text-xl' : 'text-lg sm:text-xl'
          }`}>
            Discover inspiring stories and insights from our community members who are making an impact across the globe.
          </p>
        </div>
        
        <div className={`grid gap-4 sm:gap-6 ${
          isIPhone ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}>
          {featuredVideos.map(video => (
            <Card key={video.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/95 backdrop-blur-sm transform hover:scale-105 touch-manipulation">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className={`w-full object-cover transition-transform duration-300 group-hover:scale-110 ${
                    isIPhone ? 'h-40 sm:h-48' : 'h-32 sm:h-40'
                  }`}
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg">
                  <Play className={`text-white drop-shadow-lg ${
                    isIPhone ? 'h-12 w-12' : 'h-8 w-8 sm:h-12 sm:w-12'
                  }`} />
                </div>
                <Badge className="absolute bottom-2 right-2 bg-black/80 text-white font-medium text-xs">
                  {video.duration}
                </Badge>
              </div>
              <CardContent className={isIPhone ? 'p-4' : 'p-3 sm:p-4'}>
                <h3 className={`font-semibold mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors ${
                  isIPhone ? 'text-sm' : 'text-xs sm:text-sm'
                }`}>{video.title}</h3>
                <p className="text-gray-600 text-xs line-clamp-2">{video.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8 sm:mt-12">
          <Link to="/member">
            <Button 
              size={isMobile ? "default" : "lg"} 
              className={`bg-white text-slate-900 hover:bg-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-semibold group touch-manipulation ${
                isIPhone 
                  ? 'px-8 py-4 text-base min-h-[48px]' 
                  : 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg'
              }`}
            >
              View All Videos
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
