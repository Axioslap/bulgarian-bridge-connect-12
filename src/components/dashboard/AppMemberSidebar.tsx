import { Home, Users, MessageCircle, Search, UserCheck, Calendar, Video, BookOpen, Heart, User as UserIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarSeparator,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { mockMessages } from "@/data/mockData";

interface AppMemberSidebarProps {
  userProfile: {
    name: string;
    joinDate: string;
    role: string;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppMemberSidebar = ({ userProfile, activeTab, setActiveTab }: AppMemberSidebarProps) => {
  const unreadMessageCount = mockMessages.filter((m) => m.unread).length;

  const groups = [
    {
      label: "Overview",
      items: [
        { key: "dashboard", label: "Dashboard", Icon: Home },
      ],
    },
    {
      label: "Communication",
      items: [
        { key: "discussion", label: "Discussion", Icon: Users },
        { key: "messages", label: "Messages", Icon: MessageCircle, badge: unreadMessageCount },
      ],
    },
    {
      label: "Networking",
      items: [
        { key: "search", label: "Find Members", Icon: Search },
        { key: "experts", label: "Find Experts", Icon: UserCheck },
        { key: "events", label: "Events", Icon: Calendar },
      ],
    },
    {
      label: "Learning",
      items: [
        { key: "videos", label: "Videos", Icon: Video },
        { key: "resources", label: "Resources", Icon: BookOpen },
      ],
    },
    {
      label: "Community",
      items: [
        { key: "community-impact", label: "Impact Stories", Icon: Heart },
        { key: "calendar", label: "Calendar & Schedule", Icon: Calendar },
      ],
    },
  ] as const;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <UserIcon className="h-5 w-5" />
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{userProfile.name}</div>
            <div className="text-[11px] text-muted-foreground truncate">Member since {userProfile.joinDate}</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group, gi) => (
          <div key={group.label}>
            <SidebarGroup>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map(({ key, label, Icon, badge }) => (
                    <SidebarMenuItem key={key}>
                      <SidebarMenuButton
                        isActive={activeTab === key}
                        onClick={() => setActiveTab(key)}
                        tooltip={label}
                      >
                        <Icon />
                        <span>{label}</span>
                      </SidebarMenuButton>
                      {badge ? (
                        <SidebarMenuBadge className="bg-destructive/20 text-destructive">
                          {badge}
                        </SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {gi < groups.length - 1 && <SidebarSeparator />}
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
};

export default AppMemberSidebar;
