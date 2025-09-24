import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import EventCard from "@/components/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const EventsTab = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [canManageEvents, setCanManageEvents] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: '',
    location: '',
    registration_url: '',
    event_date: undefined as Date | undefined,
    member_access_level: 'free'
  });

  const { user, hasRoleOrHigher, role } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const checkPermissions = async () => {
      if (user) {
        const isSuperAdmin = await hasRoleOrHigher('superadmin');
        setCanManageEvents(isSuperAdmin);
      } else {
        setCanManageEvents(false);
      }
    };
    
    checkPermissions();
  }, [user, hasRoleOrHigher]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      
      // Filter events based on user role
      let filteredEvents = data || [];
      if (user && role) {
        const userRole = role;
        filteredEvents = data?.filter(event => {
          if (userRole === 'superadmin' || userRole === 'admin') return true;
          if (userRole === 'paid') return event.member_access_level === 'free' || event.member_access_level === 'paid';
          return event.member_access_level === 'free';
        }) || [];
      } else {
        filteredEvents = data?.filter(event => event.member_access_level === 'free') || [];
      }
      
      setEvents(filteredEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.event_date || !newEvent.event_type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .insert([{
          title: newEvent.title,
          description: newEvent.description,
          event_type: newEvent.event_type,
          location: newEvent.location,
          registration_url: newEvent.registration_url,
          event_date: newEvent.event_date.toISOString(),
          member_access_level: newEvent.member_access_level,
          created_by: user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Event Created",
        description: "The event has been successfully created.",
      });

      setNewEvent({
        title: '',
        description: '',
        event_type: '',
        location: '',
        registration_url: '',
        event_date: undefined,
        member_access_level: 'free'
      });
      setIsAdminPanelOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Event Deleted",
        description: "The event has been successfully deleted.",
      });

      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive"
      });
    }
  };

  const upcomingEvents = events.filter(event => new Date(event.event_date) > new Date());
  const pastEvents = events.filter(event => new Date(event.event_date) <= new Date());

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Member Events</CardTitle>
            <CardDescription>
              Exclusive events for ABTC Bulgaria members
            </CardDescription>
          </div>
          {canManageEvents && (
            <Dialog open={isAdminPanelOpen} onOpenChange={setIsAdminPanelOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Create a new event for ABTC Bulgaria members
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="Enter event title"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      placeholder="Enter event description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="event_type">Event Type *</Label>
                      <Select value={newEvent.event_type} onValueChange={(value) => setNewEvent({...newEvent, event_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="networking">Networking</SelectItem>
                          <SelectItem value="webinar">Webinar</SelectItem>
                          <SelectItem value="seminar">Seminar</SelectItem>
                          <SelectItem value="social">Social Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="access_level">Member Access Level</Label>
                      <Select value={newEvent.member_access_level} onValueChange={(value) => setNewEvent({...newEvent, member_access_level: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select access level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free Members</SelectItem>
                          <SelectItem value="paid">Paid Members Only</SelectItem>
                          <SelectItem value="admin">Admin Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Event Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !newEvent.event_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newEvent.event_date ? format(newEvent.event_date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newEvent.event_date}
                          onSelect={(date) => setNewEvent({...newEvent, event_date: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      placeholder="Enter event location"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="registration_url">Registration URL</Label>
                    <Input
                      id="registration_url"
                      value={newEvent.registration_url}
                      onChange={(e) => setNewEvent({...newEvent, registration_url: e.target.value})}
                      placeholder="Enter registration URL"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAdminPanelOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEvent}>
                    Create Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upcoming Events</h3>
                <div className="grid gap-4">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div key={event.id} className="relative">
                        <EventCard 
                          title={event.title}
                          date={new Date(event.event_date).toLocaleDateString()}
                          location={event.location || 'TBA'}
                          description={event.description}
                          type={event.event_type}
                          isUpcoming={true}
                          registrationUrl={event.registration_url}
                        />
                        {canManageEvents && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No upcoming events scheduled.</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Past Events</h3>
                <div className="grid gap-4">
                  {pastEvents.length > 0 ? (
                    pastEvents.map((event) => (
                      <div key={event.id} className="relative">
                        <EventCard 
                          title={event.title}
                          date={new Date(event.event_date).toLocaleDateString()}
                          location={event.location || 'TBA'}
                          description={event.description}
                          type={event.event_type}
                          isUpcoming={false}
                          registrationUrl={event.registration_url}
                        />
                        {canManageEvents && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No past events to display.</p>
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