
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from "lucide-react";


interface MemberDashboardHeaderProps {
  userProfile: {
    name: string;
    role: string;
    profile_photo_url?: string;
    email?: string;
    job_title?: string;
    company?: string;
    city?: string;
    country?: string;
    bio?: string;
    areas_of_interest?: string[];
  };
  onLogout: () => void;
  onProfileEdit?: () => void;
}

const MemberDashboardHeader = ({ userProfile, onLogout, onProfileEdit }: MemberDashboardHeaderProps) => {
  return (
    <header className="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-40 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <SidebarTrigger className="mr-1" />
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img 
                src="/lovable-uploads/a622b81f-1bc6-4b70-90bc-fdf0fd79ae53.png" 
                alt="ABTC Bulgaria Logo" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <span className="text-lg font-bold text-blue-700 mr-1">ABTC</span>
                <span className="text-lg font-bold text-red-600 tracking-tight">Bulgaria</span>
                <p className="text-xs text-gray-600 leading-tight hidden md:block">Member Portal</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile?.profile_photo_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600 hidden sm:inline truncate max-w-32 md:max-w-none">
                    {userProfile?.name || 'Member'}
                  </span>
                  <Badge variant="outline" className="hidden sm:inline-flex border-blue-200 text-blue-700 bg-blue-50 text-xs">
                    {userProfile?.role || 'Member'}
                  </Badge>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>My Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={userProfile?.profile_photo_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{userProfile?.name}</h3>
                      <p className="text-sm text-gray-600">{userProfile?.email}</p>
                      <p className="text-sm text-gray-600">{userProfile?.job_title} at {userProfile?.company}</p>
                      <p className="text-sm text-gray-600">{userProfile?.city}, {userProfile?.country}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm text-gray-600">{userProfile?.bio}</p>
                  </div>
                  {userProfile?.areas_of_interest && userProfile.areas_of_interest.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Areas of Interest</h4>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.areas_of_interest.map((interest: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button onClick={onProfileEdit}>
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm px-3"
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MemberDashboardHeader;
