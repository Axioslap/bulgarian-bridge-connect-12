import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Events = () => {
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;

      const formattedEvents = (data || []).map(event => ({
        id: event.id,
        title: event.title,
        date: format(new Date(event.event_date), "MMMM d, yyyy • h:mm a"),
        location: event.location || "TBA",
        description: event.description,
        type: event.event_type,
        isUpcoming: new Date(event.event_date) > new Date(),
        registrationUrl: event.registration_url,
        imageUrl: event.image_url
      }));

      setAllEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };
  
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
                    <SelectItem value="social">Social Event</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
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
                  registrationUrl={event.registrationUrl}
                  imageUrl={event.imageUrl}
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
