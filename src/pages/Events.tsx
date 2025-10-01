import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import SEO from "@/components/common/SEO";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Events = () => {
  // Sample events data
  const allEvents = [
    {
      id: 1,
      title: "Tech Networking Mixer",
      date: "June 15, 2025 • 6:30 PM",
      location: "Sofia Tech Park",
      description: "Connect with fellow tech professionals and U.S. alumni in a casual networking event designed to foster new connections and potential collaborations.",
      type: "networking" as const,
      isUpcoming: true,
    },
    {
      id: 2,
      title: "Entrepreneurship Workshop: From Idea to Business Plan",
      date: "June 28, 2025 • 10:00 AM",
      location: "American Corner Sofia",
      description: "Learn how to transform your innovative ideas into viable business plans with guidance from experienced entrepreneurs and mentors from the U.S.",
      type: "workshop" as const,
      isUpcoming: true,
    },
    {
      id: 3,
      title: "Panel Discussion: U.S.-Bulgaria Tech Partnerships",
      date: "July 10, 2025 • 5:00 PM",
      location: "U.S. Embassy Sofia",
      description: "Join industry leaders and diplomats for an insightful discussion on strengthening technological partnerships between the United States and Bulgaria.",
      type: "panel" as const,
      isUpcoming: true,
    },
    {
      id: 4,
      title: "Summer Social Gathering",
      date: "July 20, 2025 • 7:00 PM",
      location: "Garden Restaurant, Sofia",
      description: "Join us for a casual evening of socializing, networking, and celebrating the summer with fellow ABTC members and guests.",
      type: "social" as const,
      isUpcoming: true,
    },
    {
      id: 5,
      title: "Digital Marketing Strategies Workshop",
      date: "August 5, 2025 • 2:00 PM",
      location: "Online Webinar",
      description: "Learn the latest digital marketing strategies from experts in the field, with a focus on approaches that work in both U.S. and European markets.",
      type: "workshop" as const,
      isUpcoming: true,
    },
    {
      id: 6,
      title: "Spring Networking Event",
      date: "April 15, 2025 • 6:30 PM",
      location: "Sofia Business Park",
      description: "Our inaugural networking event brought together professionals from various industries to connect and explore potential collaborations.",
      type: "networking" as const,
      isUpcoming: false,
    },
    {
      id: 7,
      title: "Investment Opportunities Panel",
      date: "May 3, 2025 • 4:00 PM",
      location: "Grand Hotel Sofia",
      description: "This panel featured investors and entrepreneurs discussing the landscape of investment opportunities between the U.S. and Bulgaria.",
      type: "panel" as const,
      isUpcoming: false,
    },
    {
      id: 8,
      title: "Intro to AI Workshop",
      date: "May 20, 2025 • 10:00 AM",
      location: "American University in Bulgaria",
      description: "This hands-on workshop introduced participants to artificial intelligence concepts and practical applications in business.",
      type: "workshop" as const,
      isUpcoming: false,
    },
  ];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Apply filters
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesType = eventTypeFilter === "all" || event.type === eventTypeFilter;
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "upcoming" && event.isUpcoming) ||
                         (statusFilter === "past" && !event.isUpcoming);
                         
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <>
      <SEO
        title="Events | American Business & Technology Club"
        description="Discover networking events, workshops, panel discussions, and social gatherings. Join ABTC to connect with tech professionals and entrepreneurs."
        keywords="networking events, tech workshops, business events, professional meetups, US Bulgaria events, technology conferences"
      />
      <div className="flex flex-col min-h-screen">
        <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/8d65834e-7077-4171-8395-2d2dc55fc632.png')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/90 via-blue-700/85 to-red-600/90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-xl">Events</h1>
            <p className="text-xl md:text-2xl text-white/95 leading-relaxed drop-shadow-lg">
              Discover our upcoming events and past activities. Join us for networking, 
              workshops, panel discussions, and social gatherings.
            </p>
          </div>
        </div>
      </section>
      
      {/* Events Listing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-12 bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Select 
                  value={eventTypeFilter} 
                  onValueChange={setEventTypeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="panel">Panel Discussion</SelectItem>
                    <SelectItem value="social">Social Gathering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Event Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  description={event.description}
                  type={event.type}
                  isUpcoming={event.isUpcoming}
                  registrationUrl={event.isUpcoming ? "#" : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-500">No events found matching your criteria</h3>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setEventTypeFilter("all");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Want to propose or host an event?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We welcome event ideas and partnership opportunities from our community members 
              and partner organizations.
            </p>
            <Button>Contact Us</Button>
          </div>
        </div>
      </section>
      
      <Footer />
      </div>
    </>
  );
};

export default Events;
