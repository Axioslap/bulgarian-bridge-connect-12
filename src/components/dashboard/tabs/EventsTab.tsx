
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const EventsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Events</CardTitle>
        <CardDescription>
          Exclusive events for ABTC Bulgaria members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Member event registration will be implemented in the next phase.
        </p>
      </CardContent>
    </Card>
  );
};

export default EventsTab;
