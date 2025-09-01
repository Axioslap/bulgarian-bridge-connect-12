import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EventCard from "@/components/EventCard";
import { supabase } from "@/integrations/supabase/client";

const EventsTab = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = events.filter(event => new Date(event.event_date) > new Date());
  const pastEvents = events.filter(event => new Date(event.event_date) <= new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Events</CardTitle>
        <CardDescription>
          Exclusive events for ABTC Bulgaria members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upcoming Events</h3>
                <div className="grid gap-4">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        title={event.title}
                        date={new Date(event.event_date).toLocaleDateString()}
                        location={event.location || 'TBA'}
                        description={event.description}
                        type={event.event_type}
                        isUpcoming={true}
                        registrationUrl={event.registration_url}
                      />
                    ))
                  ) : (
                    <p className="text-gray-600">No upcoming events scheduled.</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Past Events</h3>
                <div className="grid gap-4">
                  {pastEvents.length > 0 ? (
                    pastEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        title={event.title}
                        date={new Date(event.event_date).toLocaleDateString()}
                        location={event.location || 'TBA'}
                        description={event.description}
                        type={event.event_type}
                        isUpcoming={false}
                        registrationUrl={event.registration_url}
                      />
                    ))
                  ) : (
                    <p className="text-gray-600">No past events to display.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsTab;