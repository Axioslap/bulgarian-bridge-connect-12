import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { upcomingEvents } from "@/data/mockData";
import { addDays, format } from "date-fns";
import { Link } from "react-router-dom";

const OverviewCalendar = () => {
  const [selected, setSelected] = React.useState<Date | undefined>();

  // Try to hydrate registrations from localStorage; fallback to the first event as a demo
  const registeredTitles = (JSON.parse(localStorage.getItem("registered_events") || "[]") as string[]);
  const registeredEvents = (upcomingEvents || []).filter((e) => registeredTitles.includes(e.title));
  const demoRegistered = registeredEvents.length > 0 ? registeredEvents : (upcomingEvents || []).slice(0, 1);

  // Simple demo meetings; in a real app, fetch from backend
  const meetings = [
    { title: "Coffee with Alex Petrov", date: addDays(new Date(), 3), location: "Sofia" },
    { title: "Mentorship Session", date: addDays(new Date(), 10), location: "Online" },
  ];

  const toDate = (s: string) => new Date(s);

  const registeredDates = demoRegistered.map((e) => toDate(e.date));
  const upcomingDates = (upcomingEvents || []).map((e) => toDate(e.date));
  const meetingDates = meetings.map((m) => m.date);

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
              Your registrations, upcoming events, and member meetings
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
                meeting: meetingDates,
                upcoming: upcomingDates,
              }}
              modifiersClassNames={{
                registered: "bg-primary/20",
                meeting: "bg-amber-200/50",
                upcoming: "bg-accent/60",
              }}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-primary/40" /> Registered</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-amber-300/60" /> Meeting</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-accent" /> Upcoming</span>
            </div>
          </div>
          <div className="space-y-4">
            <section>
              <h4 className="text-sm font-medium mb-2">Your Registered Events</h4>
              {demoRegistered.length === 0 ? (
                <p className="text-sm text-gray-500">No registrations yet.</p>
              ) : (
                <div className="space-y-3">
                  {demoRegistered.map((e, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{e.title}</p>
                          <p className="text-xs text-gray-500">{e.date} • {e.location}</p>
                        </div>
                        <Badge variant="outline">Registered</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h4 className="text-sm font-medium mb-2">Upcoming Events</h4>
              <div className="space-y-3">
                {(upcomingEvents || []).map((e, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">{e.title}</p>
                    <p className="text-xs text-gray-500">{e.date} • {e.location}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-sm font-medium mb-2">Your Booked Meetings</h4>
              {meetings.length === 0 ? (
                <p className="text-sm text-gray-500">No meetings booked.</p>
              ) : (
                <div className="space-y-3">
                  {meetings.map((m, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <p className="text-sm font-medium">{m.title}</p>
                      <p className="text-xs text-gray-500">{format(m.date, "PPP")} • {m.location}</p>
                    </div>
                  ))}
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
