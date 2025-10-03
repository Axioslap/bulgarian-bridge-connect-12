import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  event_date: string;
  location: string | null;
  registration_url: string | null;
  image_url: string | null;
  is_upcoming: boolean;
}

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_upcoming', true)
        .order('event_date', { ascending: true })
        .limit(3);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM dd, yyyy • h:mm a");
  };

  const getEventType = (eventType: string): "networking" | "workshop" | "panel" | "social" => {
    const type = eventType.toLowerCase();
    if (type.includes('workshop')) return 'workshop';
    if (type.includes('panel')) return 'panel';
    if (type.includes('social')) return 'social';
    return 'networking';
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent)] opacity-60"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.08),transparent)] opacity-60"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 sm:mb-16">
          <div className="mb-6 sm:mb-8 lg:mb-0">
            <h2 className="font-bold text-white mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl">Upcoming Events</h2>
            <p className="text-gray-300 text-lg sm:text-xl max-w-2xl">Join us for exciting networking and learning opportunities that drive innovation and collaboration</p>
          </div>
          <Link to="/events">
            <Button 
              variant="outline" 
              className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium border-2 border-blue-500 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-400 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base group touch-manipulation"
            >
              View All Events
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-300">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300">No upcoming events at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map(event => (
              <div key={event.id} className="transform hover:scale-105 transition-transform duration-300 touch-manipulation">
                <EventCard 
                  title={event.title} 
                  date={formatEventDate(event.event_date)} 
                  location={event.location || 'TBA'} 
                  description={event.description} 
                  type={getEventType(event.event_type)} 
                  isUpcoming={event.is_upcoming}
                  registrationUrl={event.registration_url || undefined}
                  imageUrl={event.image_url || undefined}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
