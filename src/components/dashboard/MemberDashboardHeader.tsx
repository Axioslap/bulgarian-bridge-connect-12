
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";


interface MemberDashboardHeaderProps {
  userProfile: {
    name: string;
    role: string;
  };
  onLogout: () => void;
}

const MemberDashboardHeader = ({ userProfile, onLogout }: MemberDashboardHeaderProps) => {
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
            <span className="text-sm text-gray-600 hidden sm:inline truncate max-w-32 md:max-w-none">
              Welcome, {userProfile?.name || 'Member'}
            </span>
            <Badge variant="outline" className="mr-2 hidden sm:inline-flex border-blue-200 text-blue-700 bg-blue-50 text-xs">
              {userProfile?.role || 'Member'}
            </Badge>
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
