import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, MapPin } from "lucide-react";
import ProfileModal from "@/components/ProfileModal";
import "mapbox-gl/dist/mapbox-gl.css";

const STATE_CONFIG: Record<string, { center: [number, number]; zoom: number; name: string }> = {
  FL: { center: [-82.5, 28.1], zoom: 6, name: "Florida" },
  NY: { center: [-75.4, 42.9], zoom: 6, name: "New York" },
  CA: { center: [-119.7, 36.7], zoom: 5.2, name: "California" },
  TX: { center: [-99.4, 31.0], zoom: 5.5, name: "Texas" },
  IL: { center: [-89.4, 40.0], zoom: 6, name: "Illinois" },
  PA: { center: [-77.7, 41.1], zoom: 6, name: "Pennsylvania" },
  OH: { center: [-82.8, 40.3], zoom: 6, name: "Ohio" },
  GA: { center: [-83.44, 32.65], zoom: 6, name: "Georgia" },
  NC: { center: [-79.02, 35.50], zoom: 6, name: "North Carolina" },
  MI: { center: [-84.76, 44.30], zoom: 6, name: "Michigan" },
  // Add more states as needed
};

interface Member {
  id: string;
  first_name: string;
  last_name?: string;
  city?: string;
  lat?: number;
  lng?: number;
  profile_photo_url?: string;
  user_id: string;
}

interface StateMembersMapProps {
  state: string;
  onBack?: () => void;
}

const StateMembersMap = ({ state, onBack }: StateMembersMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const stateConfig = STATE_CONFIG[state.toUpperCase()] || { 
    center: [-98.5, 39.8] as [number, number], 
    zoom: 4, 
    name: state 
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      try {
        // Get Mapbox token from edge function
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.error('No active session for Mapbox token');
          setLoading(false);
          return;
        }

        const { data: tokenData, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (tokenError || !tokenData?.token) {
          console.error('Failed to get Mapbox token:', tokenError);
          setLoading(false);
          return;
        }

        // Set Mapbox access token
        mapboxgl.accessToken = tokenData.token;

        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/light-v11",
          center: stateConfig.center,
          zoom: stateConfig.zoom,
          projection: 'mercator'
        });

        map.current.on('load', loadMembers);

      } catch (error) {
        console.error('Error initializing map:', error);
        setLoading(false);
      }
    };

    const loadMembers = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, city, lat, lng, profile_photo_url, user_id")
          .eq("country", "United States")
          .eq("state", state.toUpperCase())
          .eq("is_public", true);

        if (error) {
          console.error('Error loading members:', error);
          return;
        }

        setMembers(data || []);

        // Add member markers to map
        data?.forEach((member) => {
          if (member.lat && member.lng) {
            const el = document.createElement("div");
            el.className = "member-marker relative cursor-pointer hover:scale-110 transition-transform";
            
            const avatar = document.createElement("img");
            avatar.src = member.profile_photo_url || '/placeholder-avatar.png';
            avatar.className = "w-8 h-8 rounded-full border-2 border-background shadow-lg";
            avatar.onerror = () => {
              avatar.src = '/placeholder-avatar.png';
            };
            
            el.appendChild(avatar);
            el.onclick = () => handleMemberClick(member);

            new mapboxgl.Marker(el).setLngLat([member.lng, member.lat]).addTo(map.current!);
          }
        });

      } catch (error) {
        console.error('Error loading state members:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, [state, stateConfig]);

  const handleMemberClick = async (member: Member) => {
    try {
      const { data: profile, error } = await supabase
        .rpc('get_profile_public', { _id: member.id });

      if (error) throw error;
      
      if (profile && profile.length > 0) {
        setSelectedProfile(profile[0]);
        setProfileModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const membersWithoutLocation = members.filter(m => !m.lat || !m.lng);
  const membersWithLocation = members.filter(m => m.lat && m.lng);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Members in {stateConfig.name}
          </h2>
          <p className="text-muted-foreground">
            {membersWithLocation.length} members with location • {membersWithoutLocation.length} members listed below
          </p>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to USA
          </Button>
        )}
      </div>

      <Card className="relative overflow-hidden">
        <div 
          ref={mapContainer} 
          className="h-[400px] w-full rounded-lg bg-muted/20"
        />
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading {stateConfig.name} members...</p>
            </div>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
          <div className="text-sm font-medium mb-1">{stateConfig.name} Members</div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>👤 Avatars = Individual members</div>
            <div>Click avatar to view profile</div>
          </div>
        </div>
      </Card>

      {/* Members list - especially useful for those without location data */}
      {members.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">All Members in {stateConfig.name}</h3>
          <div className="grid gap-3">
            {members.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleMemberClick(member)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.profile_photo_url} />
                  <AvatarFallback>
                    {member.first_name?.charAt(0)}{member.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">
                    {member.first_name} {member.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {member.city || "Location not specified"}
                  </div>
                </div>
                {!member.lat || !member.lng && (
                  <div className="text-xs text-muted-foreground">
                    Not on map
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {members.length === 0 && !loading && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            No members found in {stateConfig.name} yet.
          </div>
        </Card>
      )}

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profileId={selectedProfile?.id || ''}
        initial={selectedProfile}
      />
    </div>
  );
};

export default StateMembersMap;