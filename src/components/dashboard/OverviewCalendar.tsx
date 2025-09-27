import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, MapPin, Clock, Users } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isValid } from "date-fns";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  event_type: string;
  registration_url?: string;
  member_access_level: string;
}

interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  event?: Event;
}

const OverviewCalendar = () => {
  const [selected, setSelected] = useState<Date | undefined>();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch events and registrations
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });

        if (eventsError) throw eventsError;

        // Fetch user's registrations
        const { data: registrationsData, error: registrationsError } = await supabase
          .from('event_registrations')
          .select(`
            *,
            event:events(*)
          `);

        if (registrationsError) throw registrationsError;

        setEvents(eventsData || []);
        setRegistrations(registrationsData || []);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        toast({
          title: "Error",
          description: "Failed to load calendar data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Handle date selection
  useEffect(() => {
    if (selected) {
      const selectedDateStr = format(selected, 'yyyy-MM-dd');
      const eventsOnDate = events.filter(event => {
        const eventDate = format(parseISO(event.event_date), 'yyyy-MM-dd');
        return eventDate === selectedDateStr;
      });
      setSelectedDateEvents(eventsOnDate);
    } else {
      setSelectedDateEvents([]);
    }
  }, [selected, events]);

  // Register for event
  const handleRegister = async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('event_registrations')
        .insert([{ event_id: eventId, user_id: user.id }]);

      if (error) throw error;

      // Refetch registrations
      const { data: registrationsData } = await supabase
        .from('event_registrations')
        .select(`
          *,
          event:events(*)
        `);

      setRegistrations(registrationsData || []);
      toast({
        title: "Success",
        description: "Successfully registered for event",
      });
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive",
      });
    }
  };

  // Unregister from event
  const handleUnregister = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId);

      if (error) throw error;

      // Refetch registrations
      const { data: registrationsData } = await supabase
        .from('event_registrations')
        .select(`
          *,
          event:events(*)
        `);

      setRegistrations(registrationsData || []);
      toast({
        title: "Success",
        description: "Successfully unregistered from event",
      });
    } catch (error) {
      console.error('Error unregistering from event:', error);
      toast({
        title: "Error",
        description: "Failed to unregister from event",
        variant: "destructive",
      });
    }
  };

  // Get dates for calendar modifiers
  const registeredEvents = registrations.map(r => r.event).filter(Boolean) as Event[];
  const upcomingEvents = events.filter(event => new Date(event.event_date) > new Date());
  
  const registeredDates = registeredEvents.map(e => parseISO(e.event_date));
  const upcomingDates = upcomingEvents.map(e => parseISO(e.event_date));

  const isRegistered = (eventId: string) => {
    return registrations.some(r => r.event_id === eventId);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading calendar...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-blue-600" />
              Calendar & Schedule
            </CardTitle>
            <CardDescription>
              Your registrations, upcoming events, and meetings
            </CardDescription>
          </div>
          <Link to="/events">
            <Button variant="outline" size="sm">View All Events</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              className="rounded-md border"
              modifiers={{
                registered: registeredDates,
                upcoming: upcomingDates,
              }}
              modifiersClassNames={{
                registered: "bg-primary/20",
                upcoming: "bg-accent/60",
              }}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-primary/40" /> Registered
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-accent" /> Upcoming
              </span>
            </div>

            {/* Selected Date Events */}
            {selected && selectedDateEvents.length > 0 && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <h5 className="text-sm font-medium mb-2">
                  Events on {format(selected, "PPP")}
                </h5>
                <div className="space-y-2">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 bg-background rounded border">
                      <div>
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          {event.location}
                        </p>
                      </div>
                      {isRegistered(event.id) ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUnregister(event.id)}
                        >
                          Unregister
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleRegister(event.id)}
                        >
                          Register
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Registered Events */}
            <section>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Your Registered Events
              </h4>
              {registeredEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No registrations yet.</p>
              ) : (
                <div className="space-y-3">
                  {registeredEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {format(parseISO(event.event_date), "PPP")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <MapPin className="inline h-3 w-3 mr-1" />
                            {event.location}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant="outline">Registered</Badge>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleUnregister(event.id)}
                          >
                            Unregister
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Upcoming Events */}
            <section>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Upcoming Events
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {upcomingEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {format(parseISO(event.event_date), "PPP")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          {event.location}
                        </p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {event.event_type}
                        </Badge>
                      </div>
                      {isRegistered(event.id) ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUnregister(event.id)}
                        >
                          Unregister
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleRegister(event.id)}
                        >
                          Register
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {upcomingEvents.length > 5 && (
                <div className="mt-3">
                  <Link to="/events">
                    <Button variant="outline" size="sm" className="w-full">
                      View All {upcomingEvents.length} Events
                    </Button>
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewCalendar;
