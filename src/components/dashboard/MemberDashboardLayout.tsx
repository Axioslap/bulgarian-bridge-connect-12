
import { useRef } from "react";

interface MemberDashboardLayoutProps {
  userProfile: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const MemberDashboardLayout = ({ 
  userProfile, 
  activeTab, 
  onTabChange, 
  children 
}: MemberDashboardLayoutProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  


  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 flex flex-col min-h-0">
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0 flex-1 min-h-0">
          
          {/* Main content area - Responsive padding and sizing */}
          <div ref={contentRef} className="flex-1 min-h-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 lg:p-6 h-full min-h-[calc(100vh-8rem)] lg:min-h-0 overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboardLayout;
