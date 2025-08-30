
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ResourcesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Library</CardTitle>
        <CardDescription>
          Access exclusive resources and materials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Resource library will be expanded in the next phase.
        </p>
      </CardContent>
    </Card>
  );
};

export default ResourcesTab;
