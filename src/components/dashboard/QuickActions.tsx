import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Users, Video, BookOpen, Heart } from "lucide-react";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  const quickActions = [
    {
      id: "events",
      label: "Join Event",
      icon: Calendar,
      description: "Browse upcoming events",
      color: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
    },
    {
      id: "posts",
      label: "Start Discussion",
      icon: MessageSquare,
      description: "Create new post",
      color: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
    },
    {
      id: "search",
      label: "Find Members",
      icon: Users,
      description: "Connect with peers",
      color: "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
    },
    {
      id: "videos",
      label: "Watch Videos",
      icon: Video,
      description: "Learn from stories",
      color: "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
    },
    {
      id: "resources",
      label: "Browse Resources",
      icon: BookOpen,
      description: "Access materials",
      color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
    },
    {
      id: "community-impact",
      label: "Share Story",
      icon: Heart,
      description: "Inspire others",
      color: "bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className={`h-20 flex flex-col items-center justify-center space-y-1 border-2 transition-all ${action.color}`}
                onClick={() => onActionClick(action.id)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium text-center">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;