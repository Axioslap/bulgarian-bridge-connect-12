import { Home, Users, MessageCircle, Search, MapPin, UserCheck, Calendar, Video, BookOpen, Heart, User as UserIcon, FileText } from "lucide-react";
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useMemberAuth } from "@/hooks/useMemberAuth";

interface AppMemberSidebarProps {
  userProfile: {
    name: string;
    joinDate: string;
    role: string;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isInConversationView?: boolean;
  onMessagesReset?: (() => void) | null;
}

const AppMemberSidebar = ({ userProfile, activeTab, setActiveTab, isInConversationView, onMessagesReset }: AppMemberSidebarProps) => {
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const { user } = useMemberAuth();

  // Fetch unread message count
  useEffect(() => {
    if (!user?.id) return;

    const fetchUnreadCount = async () => {
      try {
        const { data, error } = await supabase
          .from('message_receipts')
          .select('message_id, messages!inner(recipient_id)')
          .eq('user_id', user.id)
          .eq('messages.recipient_id', user.id)
          .is('read_at', null)
          .is('deleted_at', null);

        if (error) {
          console.error('Error fetching unread message count:', error);
          return;
        }

        setUnreadMessageCount(data?.length || 0);
      } catch (error) {
        console.error('Error fetching unread message count:', error);
      }
    };

    fetchUnreadCount();

    // Set up real-time subscription for receipts updates
    const channel = supabase
      .channel('unread-message-receipts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_receipts',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

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
        { key: "posts", label: "Community Posts", Icon: FileText },
        { key: "messages", label: "Messages", Icon: MessageCircle, badge: unreadMessageCount },
      ],
    },
    {
      label: "Networking",
      items: [
        { key: "search", label: "Find Members", Icon: Search },
        { key: "map", label: "Members Map", Icon: MapPin },
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
            <div className="text-sm font-medium truncate">{userProfile?.name || 'Member'}</div>
            <div className="text-[11px] text-muted-foreground truncate">Member since {userProfile?.joinDate || 'Recently'}</div>
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
                        onClick={() => {
                          if (key === 'messages' && isInConversationView && onMessagesReset) {
                            onMessagesReset();
                          } else {
                            setActiveTab(key);
                          }
                        }}
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
