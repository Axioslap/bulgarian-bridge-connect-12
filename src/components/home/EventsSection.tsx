
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const EventsSection = () => {
  const [isIPhone, setIsIPhone] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIPhone(isAppleDevice);
  }, []);

  const featuredEvents = [{
    id: 1,
    title: "Tech Networking Mixer",
    date: "June 15, 2025 • 6:30 PM",
    location: "Sofia Tech Park",
    description: "Connect with fellow tech professionals and U.S. alumni in a casual networking event designed to foster new connections and potential collaborations.",
    type: "networking" as const,
    isUpcoming: true
  }, {
    id: 2,
    title: "Entrepreneurship Workshop: From Idea to Business Plan",
    date: "June 28, 2025 • 10:00 AM",
    location: "American Corner Sofia",
    description: "Learn how to transform your innovative ideas into viable business plans with guidance from experienced entrepreneurs and mentors from the U.S.",
    type: "workshop" as const,
    isUpcoming: true
  }, {
    id: 3,
    title: "Panel Discussion: U.S.-Bulgaria Tech Partnerships",
    date: "July 10, 2025 • 5:00 PM",
    location: "U.S. Embassy Sofia",
    description: "Join industry leaders and diplomats for an insightful discussion on strengthening technological partnerships between the United States and Bulgaria.",
    type: "panel" as const,
    isUpcoming: true
  }];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(30,64,175,0.04),transparent)] opacity-60"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.03),transparent)] opacity-60"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 sm:mb-16">
          <div className="mb-6 sm:mb-8 lg:mb-0">
            <h2 className={`font-bold text-slate-900 mb-3 sm:mb-4 ${
              isIPhone ? 'text-3xl sm:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl'
            }`}>Upcoming Events</h2>
            <p className={`text-slate-600 text-lg sm:text-xl max-w-2xl`}>Join us for exciting networking and learning opportunities that drive innovation and collaboration</p>
          </div>
          <Link to="/events">
            <Button 
              variant="outline" 
              className={`shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-blue-600 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base group touch-manipulation ${
                isIPhone 
                  ? 'px-6 py-3 text-base min-h-[44px]' 
                  : 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base'
              }`}
            >
              View All Events
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <div className={`grid gap-6 sm:gap-8 ${
          isIPhone ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {featuredEvents.map(event => (
            <div key={event.id} className="transform hover:scale-105 transition-transform duration-300 touch-manipulation">
              <EventCard 
                title={event.title} 
                date={event.date} 
                location={event.location} 
                description={event.description} 
                type={event.type} 
                isUpcoming={event.isUpcoming} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
