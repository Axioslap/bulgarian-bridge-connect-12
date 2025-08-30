
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface ResourceLibraryCardProps {
  resources: Array<{
    title: string;
    type: string;
  }>;
}

const ResourceLibraryCard = ({ resources }: ResourceLibraryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Resource Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {resources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center">
                <BookOpen size={16} className="text-primary mr-2" />
                <span className="text-sm">{resource.title}</span>
              </div>
              <Badge variant="outline">{resource.type}</Badge>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" className="w-full">Browse all resources</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceLibraryCard;
