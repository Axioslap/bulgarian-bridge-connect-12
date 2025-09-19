import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Search, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProfileModal from "@/components/ProfileModal";
import mapboxgl from 'mapbox-gl';
import Supercluster from 'supercluster';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MemberLocation {
  id: string;
  first_name: string;
  profile_photo_url?: string;
  country: string;
  state?: string;
  city: string;
  lat?: number;
  lng?: number;
  areas_of_interest: string[];
  membership_type: string;
  user_id: string;
}

type MapLevel = 'world' | 'country' | 'state';

interface CountryCenter {
  name: string;
  center: [number, number];
  zoom: number;
}

const MapTab = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLevel, setMapLevel] = useState<MapLevel>('world');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const { toast } = useToast();

  // Country centers for initial view
  const countryData: CountryCenter[] = [
    { name: 'United States', center: [-98.5, 39.8], zoom: 3.5 },
    { name: 'USA', center: [-98.5, 39.8], zoom: 3.5 },
    { name: 'Bulgaria', center: [25.3, 42.7], zoom: 6 }
  ];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize Mapbox (you'll need to add your token as an environment variable)
    mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdC11c2VyIiwiYSI6ImNsempycWlhZTEwZGwzbHM0Y2hpNG9uNzEifQ.example'; // Replace with your Mapbox token

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [20, 40],
      zoom: 2,
      projection: 'globe'
    });

    map.current.on('load', () => {
      loadWorldView();
    });

    return () => {
      clearMarkers();
      map.current?.remove();
    };
  }, []);

  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  const createClusterMarker = (count: number, coordinates: [number, number], onClick: () => void) => {
    const el = document.createElement('div');
    el.className = 'flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-semibold cursor-pointer hover:bg-primary/90 transition-colors border-2 border-background shadow-lg';
    el.innerHTML = count.toString();
    el.onclick = onClick;

    const marker = new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .addTo(map.current!);

    markers.current.push(marker);
    return marker;
  };

  const createMemberMarker = (member: MemberLocation, coordinates: [number, number]) => {
    const el = document.createElement('div');
    el.className = 'relative cursor-pointer hover:scale-110 transition-transform';
    
    const avatar = document.createElement('img');
    avatar.src = member.profile_photo_url || '/placeholder-avatar.png';
    avatar.className = 'w-10 h-10 rounded-full border-2 border-background shadow-lg';
    avatar.onerror = () => {
      avatar.src = '/placeholder-avatar.png';
    };
    
    el.appendChild(avatar);
    el.onclick = () => handleProfileClick(member);

    const marker = new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .addTo(map.current!);

    markers.current.push(marker);
    return marker;
  };

  const loadWorldView = async () => {
    try {
      setLoading(true);
      clearMarkers();
      
      const { data: countryStats, error } = await supabase
        .from('profiles')
        .select('country')
        .neq('country', '')
        .eq('is_public', true);

      if (error) throw error;

      // Count members by country
      const countryCounts: { [key: string]: number } = {};
      countryStats?.forEach(profile => {
        const country = profile.country.trim();
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      });

      // Create markers for countries with members
      countryData.forEach(country => {
        const count = countryCounts[country.name] || 0;
        if (count > 0) {
          createClusterMarker(count, country.center, () => {
            setSelectedCountry(country.name);
            setMapLevel('country');
            map.current!.flyTo({
              center: country.center,
              zoom: country.zoom,
              duration: 1500
            });
            loadCountryView(country.name);
          });
        }
      });
    } catch (error) {
      console.error('Error loading world view:', error);
      toast({
        title: "Error",
        description: "Failed to load world map",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCountryView = async (country: string) => {
    try {
      setLoading(true);
      clearMarkers();

      const { data: members, error } = await supabase
        .from('profiles')
        .select('id, first_name, profile_photo_url, country, state, city, lat, lng, areas_of_interest, membership_type, user_id')
        .eq('country', country)
        .neq('city', '')
        .eq('is_public', true);

      if (error) throw error;

      if (!members || members.length === 0) return;

      // For USA, cluster by state. For smaller countries, show cities directly
      if (country === 'United States' || country === 'USA') {
        const stateGroups: { [state: string]: MemberLocation[] } = {};
        
        members.forEach(member => {
          const state = member.state || 'Unknown';
          if (!stateGroups[state]) stateGroups[state] = [];
          stateGroups[state].push(member);
        });

        // Create state cluster markers (using approximate state centers)
        Object.entries(stateGroups).forEach(([state, stateMembers]) => {
          // Use first member's location as state center approximation
          const centerMember = stateMembers[0];
          if (centerMember.lat && centerMember.lng) {
            createClusterMarker(stateMembers.length, [centerMember.lng, centerMember.lat], () => {
              setSelectedState(state);
              setMapLevel('state');
              map.current!.flyTo({
                center: [centerMember.lng, centerMember.lat],
                zoom: 7,
                duration: 1500
              });
              loadStateView(country, state);
            });
          }
        });
      } else {
        // For smaller countries, show members directly
        members.forEach(member => {
          if (member.lat && member.lng) {
            createMemberMarker(member, [member.lng, member.lat]);
          }
        });
      }
    } catch (error) {
      console.error('Error loading country view:', error);
      toast({
        title: "Error",
        description: "Failed to load country data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStateView = async (country: string, state: string) => {
    try {
      setLoading(true);
      clearMarkers();

      const { data: members, error } = await supabase
        .from('profiles')
        .select('id, first_name, profile_photo_url, country, state, city, lat, lng, areas_of_interest, membership_type, user_id')
        .eq('country', country)
        .eq('state', state)
        .neq('city', '')
        .eq('is_public', true);

      if (error) throw error;

      members?.forEach(member => {
        if (member.lat && member.lng) {
          createMemberMarker(member, [member.lng, member.lat]);
        }
      });
    } catch (error) {
      console.error('Error loading state view:', error);
      toast({
        title: "Error",
        description: "Failed to load state data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = async (member: MemberLocation) => {
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
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    }
  };

  const goBack = () => {
    if (mapLevel === 'state') {
      setSelectedState(null);
      setMapLevel('country');
      const countryInfo = countryData.find(c => c.name === selectedCountry);
      if (countryInfo) {
        map.current!.flyTo({
          center: countryInfo.center,
          zoom: countryInfo.zoom,
          duration: 1500
        });
        loadCountryView(selectedCountry!);
      }
    } else if (mapLevel === 'country') {
      setSelectedCountry(null);
      setMapLevel('world');
      map.current!.flyTo({
        center: [20, 40],
        zoom: 2,
        duration: 1500
      });
      loadWorldView();
    }
  };

  const getViewTitle = () => {
    if (mapLevel === 'world') return 'Global Members Map';
    if (mapLevel === 'country') return `Members in ${selectedCountry}`;
    if (mapLevel === 'state') return `Members in ${selectedState}, ${selectedCountry}`;
    return 'Members Map';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{getViewTitle()}</h2>
          <p className="text-muted-foreground">
            {mapLevel === 'world' && 'Click on a country to explore members by location'}
            {mapLevel === 'country' && 'Click on state clusters to zoom in, or member avatars to view profiles'}
            {mapLevel === 'state' && 'Click on member avatars to view their profiles'}
          </p>
        </div>
        {mapLevel !== 'world' && (
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
      </div>

      <Card className="relative overflow-hidden">
        <div 
          ref={mapContainer} 
          className="w-full h-[600px] bg-muted/20 rounded-lg"
          style={{ minHeight: '600px' }}
        />
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
          <div className="text-sm font-medium text-foreground mb-1">Map Guide</div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>🔵 Blue circles = Member clusters</div>
            <div>👤 Avatars = Individual members</div>
            <div>Click to zoom in or view profiles</div>
          </div>
        </div>
      </Card>

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profileId={selectedProfile?.id || ''}
        initial={selectedProfile}
      />
    </div>
  );
};

export default MapTab;