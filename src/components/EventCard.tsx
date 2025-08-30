
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  description: string;
  type: "networking" | "workshop" | "panel" | "social";
  isUpcoming: boolean;
  registrationUrl?: string;
}

const EventCard = ({
  title,
  date,
  location,
  description,
  type,
  isUpcoming,
  registrationUrl
}: EventCardProps) => {
  const typeColors = {
    networking: "bg-blue-100 text-blue-800",
    workshop: "bg-green-100 text-green-800",
    panel: "bg-purple-100 text-purple-800",
    social: "bg-amber-100 text-amber-800"
  };
  
  const typeLabels = {
    networking: "Networking",
    workshop: "Workshop",
    panel: "Panel Discussion",
    social: "Social Gathering"
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
          <Badge variant="outline" className={typeColors[type]}>
            {typeLabels[type]}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <Calendar size={16} className="mr-2" />
          <span>{date}</span>
        </div>
        <div className="text-sm text-gray-500 mt-1 ml-6">
          {location}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter>
        {isUpcoming ? (
          <Button className="w-full" asChild>
            <a href={registrationUrl || "#"} target="_blank" rel="noopener noreferrer">
              Register Now
            </a>
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            Event Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
