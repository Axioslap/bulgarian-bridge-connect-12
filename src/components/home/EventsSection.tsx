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
    <section className="py-20 sm:py-32 relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50">
      {/* Elegant patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(139,92,246,0.08),transparent_55%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.06),transparent_55%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 sm:mb-20">
          <div className="mb-8 lg:mb-0">
            <h2 className="font-bold mb-4 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent leading-tight text-4xl sm:text-5xl md:text-6xl">Upcoming Events</h2>
            <p className="text-slate-600 text-xl sm:text-2xl max-w-2xl leading-relaxed font-medium">Join us for exclusive networking and learning opportunities</p>
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
