
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, BookOpen, Calendar, Search, MessageCircle, Users, Video, FileText, Heart, UserCheck, Home, Network, GraduationCap } from "lucide-react";

interface DashboardSidebarProps {
  userProfile: {
    name: string;
    joinDate: string;
    role: string;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessageCount: number;
}

const DashboardSidebar = ({ userProfile, activeTab, setActiveTab, unreadMessageCount }: DashboardSidebarProps) => {
  return (
    <div className="w-full md:w-64 mb-6 md:mb-0">
      <Card className="border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="text-lg">
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-600" />
              <Button 
                variant="ghost" 
                className="p-0 h-auto font-semibold text-lg justify-start text-gray-800 hover:text-blue-700"
                onClick={() => setActiveTab("profile")}
              >
                {userProfile?.name || 'Member'}
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="text-xs text-gray-600">
            Member since {userProfile.joinDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {/* Overview Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">Overview</h3>
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "dashboard" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>

          <Separator />

          {/* Communication Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">Communication</h3>
            <Button
              variant={activeTab === "discussion" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "discussion" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"}`}
              onClick={() => setActiveTab("discussion")}
            >
              <Users className="mr-2 h-4 w-4" />
              Discussion
            </Button>
            <Button
              variant={activeTab === "messages" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "messages" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"}`}
              onClick={() => setActiveTab("messages")}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Messages
              {unreadMessageCount > 0 && (
                <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 text-xs bg-red-500">
                  {unreadMessageCount}
                </Badge>
              )}
            </Button>
          </div>

          <Separator />

          {/* Networking Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">Networking</h3>
            <Button
              variant={activeTab === "search" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "search" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"}`}
              onClick={() => setActiveTab("search")}
            >
              <Search className="mr-2 h-4 w-4" />
              Find Members
            </Button>
            <Button
              variant={activeTab === "experts" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "experts" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"}`}
              onClick={() => setActiveTab("experts")}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Find Experts
            </Button>
            <Button
              variant={activeTab === "events" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "events" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"}`}
              onClick={() => setActiveTab("events")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Events
            </Button>
          </div>

          <Separator />

          {/* Learning Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">Learning</h3>
            <Button
              variant={activeTab === "videos" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "videos" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"}`}
              onClick={() => setActiveTab("videos")}
            >
              <Video className="mr-2 h-4 w-4" />
              Videos
            </Button>
            <Button
              variant={activeTab === "resources" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "resources" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"}`}
              onClick={() => setActiveTab("resources")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Resources
            </Button>
          </div>

          <Separator />

          {/* Community Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">Community</h3>
            <Button
              variant={activeTab === "community-impact" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "community-impact" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"}`}
              onClick={() => setActiveTab("community-impact")}
            >
              <Heart className="mr-2 h-4 w-4" />
              Impact Stories
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSidebar;
