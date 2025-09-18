import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProfileModal from "@/components/ProfileModal";

interface MemberLocation {
  id: string;
  first_name: string;
  profile_photo_url?: string;
  country: string;
  city: string;
  areas_of_interest: string[];
  membership_type: string;
  user_id: string;
}

interface LocationGroup {
  country: string;
  cities: {
    [city: string]: MemberLocation[];
  };
  totalMembers: number;
}

const MapTab = () => {
  const [membersByLocation, setMembersByLocation] = useState<{[country: string]: LocationGroup}>({});
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMemberLocations();
  }, []);

  const fetchMemberLocations = async () => {
    try {
      setLoading(true);
      
      const { data: members, error } = await supabase
        .from('profiles')
        .select('id, first_name, profile_photo_url, country, city, areas_of_interest, membership_type, user_id')
        .neq('country', '')
        .neq('city', '')
        .eq('is_public', true);

      if (error) throw error;

      // Group members by country and city
      const locationGroups: {[country: string]: LocationGroup} = {};
      
      members?.forEach((member) => {
        const country = member.country.trim();
        const city = member.city.trim();
        
        if (!country || !city) return;
        
        if (!locationGroups[country]) {
          locationGroups[country] = {
            country,
            cities: {},
            totalMembers: 0
          };
        }
        
        if (!locationGroups[country].cities[city]) {
          locationGroups[country].cities[city] = [];
        }
        
        locationGroups[country].cities[city].push(member);
        locationGroups[country].totalMembers++;
      });

      setMembersByLocation(locationGroups);
    } catch (error) {
      console.error('Error fetching member locations:', error);
      toast({
        title: "Error",
        description: "Failed to load member locations",
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

  const resetView = () => {
    setSelectedCountry(null);
    setSelectedCity(null);
  };

  const getCountryFlag = (country: string) => {
    const flags: {[key: string]: string} = {
      'United States': '🇺🇸',
      'USA': '🇺🇸',
      'Bulgaria': '🇧🇬',
      'Canada': '🇨🇦',
      'United Kingdom': '🇬🇧',
      'UK': '🇬🇧',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Spain': '🇪🇸',
      'Italy': '🇮🇹',
      'Netherlands': '🇳🇱',
      'Australia': '🇦🇺',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'India': '🇮🇳',
      'China': '🇨🇳',
      'Japan': '🇯🇵',
      'Russia': '🇷🇺'
    };
    return flags[country] || '🌍';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Member Locations Map</h2>
          <p className="text-muted-foreground">Loading member locations...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (selectedCity && selectedCountry) {
    const cityMembers = membersByLocation[selectedCountry]?.cities[selectedCity] || [];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {getCountryFlag(selectedCountry)} {selectedCity}, {selectedCountry}
            </h2>
            <p className="text-muted-foreground">
              {cityMembers.length} member{cityMembers.length !== 1 ? 's' : ''} in this city
            </p>
          </div>
          <Button variant="outline" onClick={resetView}>
            <Search className="h-4 w-4 mr-2" />
            Back to Map
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cityMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleProfileClick(member)}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.profile_photo_url} />
                    <AvatarFallback>
                      {member.first_name?.charAt(0)?.toUpperCase() || 'M'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {member.first_name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {member.city}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {member.membership_type}
                    </Badge>
                    {member.areas_of_interest?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.areas_of_interest.slice(0, 2).map((interest, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {member.areas_of_interest.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.areas_of_interest.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ProfileModal
          open={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          profileId={selectedProfile?.id || ''}
          initial={selectedProfile}
        />
      </div>
    );
  }

  if (selectedCountry) {
    const countryData = membersByLocation[selectedCountry];
    const cities = Object.entries(countryData.cities).sort(([,a], [,b]) => b.length - a.length);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {getCountryFlag(selectedCountry)} {selectedCountry}
            </h2>
            <p className="text-muted-foreground">
              {countryData.totalMembers} member{countryData.totalMembers !== 1 ? 's' : ''} across {cities.length} cit{cities.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
          <Button variant="outline" onClick={resetView}>
            <Search className="h-4 w-4 mr-2" />
            Back to Map
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map(([city, members]) => (
            <Card 
              key={city} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedCity(city)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    {city}
                  </span>
                  <Badge variant="secondary">
                    {members.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex -space-x-2">
                  {members.slice(0, 5).map((member, idx) => (
                    <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={member.profile_photo_url} />
                      <AvatarFallback className="text-xs">
                        {member.first_name?.charAt(0)?.toUpperCase() || 'M'}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {members.length > 5 && (
                    <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-medium">+{members.length - 5}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Click to view members
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Main map view - show countries
  const countries = Object.entries(membersByLocation).sort(([,a], [,b]) => b.totalMembers - a.totalMembers);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Member Locations Map</h2>
        <p className="text-muted-foreground">
          Discover members around the world. Click on a country to explore cities and connect with members in your region.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map(([country, data]) => (
          <Card 
            key={country}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedCountry(country)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <span className="text-2xl mr-2">{getCountryFlag(country)}</span>
                  {country}
                </span>
                <Badge variant="default">
                  {data.totalMembers}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                {Object.keys(data.cities).length} cit{Object.keys(data.cities).length !== 1 ? 'ies' : 'y'}
              </div>
              <div className="flex -space-x-2 mt-3">
                {Object.values(data.cities).flat().slice(0, 5).map((member, idx) => (
                  <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={member.profile_photo_url} />
                    <AvatarFallback className="text-xs">
                      {member.first_name?.charAt(0)?.toUpperCase() || 'M'}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {data.totalMembers > 5 && (
                  <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs font-medium">+{data.totalMembers - 5}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {countries.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Member Locations Found</h3>
            <p className="text-muted-foreground">
              Member location data will appear here once members add their location information to their profiles.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapTab;