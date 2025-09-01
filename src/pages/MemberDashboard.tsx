
import { useState } from "react";
import MemberDashboardHeader from "@/components/dashboard/MemberDashboardHeader";
import MemberDashboardLayout from "@/components/dashboard/MemberDashboardLayout";
import DashboardTab from "@/components/dashboard/tabs/DashboardTab";
import DiscussionTab from "@/components/dashboard/tabs/DiscussionTab";
import MessagesTab from "@/components/dashboard/tabs/MessagesTab";
import SearchTab from "@/components/dashboard/tabs/SearchTab";
import ProfileTab from "@/components/dashboard/tabs/ProfileTab";
import EventsTab from "@/components/dashboard/tabs/EventsTab";
import ResourcesTab from "@/components/dashboard/tabs/ResourcesTab";
import VideosTab from "@/components/dashboard/tabs/VideosTab";
import ArticlesTab from "@/components/dashboard/tabs/ArticlesTab";
import JobsTab from "@/components/dashboard/tabs/JobsTab";
import ExpertsTab from "@/components/dashboard/tabs/ExpertsTab";
import NewsTab from "@/components/dashboard/tabs/NewsTab";
import CommunityImpactTab from "@/components/dashboard/tabs/CommunityImpactTab";
import CalendarTab from "@/components/dashboard/tabs/CalendarTab";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppMemberSidebar from "@/components/dashboard/AppMemberSidebar";


const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const {
    user,
    userProfile,
    userSkills,
    setUserSkills,
    newsInterests,
    setNewsInterests,
    handleLogout
  } = useMemberAuth();

  // Show loading if user profile not loaded yet
  // Show dashboard immediately even if profile is still loading
  const displayProfile = userProfile || {
    name: 'Member',
    email: user?.email || '',
    role: 'Member',
    joinDate: 'Recently joined',
    bio: 'Loading profile...',
    skills: [],
    areas_of_interest: []
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab userProfile={userProfile} onTabChange={setActiveTab} />;
      case "discussion":
        return <DiscussionTab />;
      case "messages":
        return <MessagesTab />;
      case "search":
        return <SearchTab />;
      case "profile":
        return <ProfileTab userProfile={userProfile} userSkills={userSkills} setUserSkills={setUserSkills} />;
      case "events":
        return <EventsTab />;
      case "resources":
        return <ResourcesTab />;
      case "videos":
        return <VideosTab />;
      case "community-impact":
        return <CommunityImpactTab />;
      case "calendar":
        return <CalendarTab />;
      case "articles":
        return <ArticlesTab />;
      case "jobs":
        return <JobsTab />;
      case "experts":
        return <ExpertsTab />;
      case "news":
        return <NewsTab newsInterests={newsInterests} setNewsInterests={setNewsInterests} />;
      default:
        return <DashboardTab userProfile={userProfile} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <MemberDashboardHeader 
          userProfile={displayProfile} 
          onLogout={handleLogout}
          onProfileEdit={() => setActiveTab('profile')}
        />

        <div className="flex flex-1 w-full">
          <AppMemberSidebar 
            userProfile={displayProfile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <SidebarInset>
            <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen flex flex-col">
              <MemberDashboardLayout
                userProfile={displayProfile}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              >
                {renderTabContent()}
              </MemberDashboardLayout>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MemberDashboard;
