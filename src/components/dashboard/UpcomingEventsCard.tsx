
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface UpcomingEventsCardProps {
  events: Array<{
    title: string;
    date: string;
    location: string;
  }>;
}

const UpcomingEventsCard = ({ events }: UpcomingEventsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Calendar size={16} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{event.title}</h4>
                <p className="text-xs text-gray-500">{event.date} at {event.location}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" className="w-full">View all events</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEventsCard;
