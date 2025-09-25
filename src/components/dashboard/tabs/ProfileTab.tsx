
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SkillSelector from "@/components/SkillSelector";
import { Camera, MapPin, X, Check, ChevronsUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { validateTextInput } from "@/utils/security";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ProfileTabProps {
  userProfile: {
    bio: string;
    name: string;
    city: string;
    country: string;
    profile_photo_url: string;
    areas_of_interest: string[];
  };
  userSkills: string[];
  setUserSkills: (skills: string[]) => void;
}

// Popular cities data for autocomplete
const popularCities = [
  // US Cities
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
  "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC",
  "San Francisco, CA", "Indianapolis, IN", "Seattle, WA", "Denver, CO", "Washington, DC",
  "Boston, MA", "Nashville, TN", "Detroit, MI", "Oklahoma City, OK", "Portland, OR",
  "Las Vegas, NV", "Memphis, TN", "Louisville, KY", "Baltimore, MD", "Milwaukee, WI",
  "Albuquerque, NM", "Tucson, AZ", "Fresno, CA", "Sacramento, CA", "Mesa, AZ",
  "Kansas City, MO", "Atlanta, GA", "Long Beach, CA", "Colorado Springs, CO", "Raleigh, NC",
  "Miami, FL", "Virginia Beach, VA", "Omaha, NE", "Oakland, CA", "Minneapolis, MN",
  "Tulsa, OK", "Arlington, TX", "Tampa, FL", "New Orleans, LA", "Wichita, KS",
  
  // Bulgarian Cities
  "Sofia, Bulgaria", "Plovdiv, Bulgaria", "Varna, Bulgaria", "Burgas, Bulgaria", "Ruse, Bulgaria",
  "Stara Zagora, Bulgaria", "Pleven, Bulgaria", "Sliven, Bulgaria", "Dobrich, Bulgaria", "Shumen, Bulgaria",
  "Pernik, Bulgaria", "Haskovo, Bulgaria", "Yambol, Bulgaria", "Pazardzhik, Bulgaria", "Blagoevgrad, Bulgaria",
  "Veliko Tarnovo, Bulgaria", "Gabrovo, Bulgaria", "Asenovgrad, Bulgaria", "Vidin, Bulgaria", "Vratsa, Bulgaria",
  
  // European Cities
  "London, UK", "Paris, France", "Berlin, Germany", "Madrid, Spain", "Rome, Italy",
  "Amsterdam, Netherlands", "Vienna, Austria", "Brussels, Belgium", "Prague, Czech Republic", "Warsaw, Poland",
  "Stockholm, Sweden", "Copenhagen, Denmark", "Helsinki, Finland", "Oslo, Norway", "Dublin, Ireland",
  "Lisbon, Portugal", "Athens, Greece", "Budapest, Hungary", "Bucharest, Romania", "Zagreb, Croatia",
  "Ljubljana, Slovenia", "Bratislava, Slovakia", "Tallinn, Estonia", "Riga, Latvia", "Vilnius, Lithuania"
];

const ProfileTab = ({ userProfile, userSkills, setUserSkills }: ProfileTabProps) => {
  const { toast } = useToast();
  const [profilePicture, setProfilePicture] = useState<string>(userProfile?.profile_photo_url || "");
  const [location, setLocation] = useState(`${userProfile?.city || ""}, ${userProfile?.country || ""}`.replace(", ", "").trim());
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>(userProfile?.areas_of_interest || []);
  const [newInterest, setNewInterest] = useState("");
  const [isProfileVisibleToSupporters, setIsProfileVisibleToSupporters] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setProfilePicture(userProfile.profile_photo_url || "");
      const loc = `${userProfile.city || ""}, ${userProfile.country || ""}`.replace(", ", "").trim();
      setLocation(loc);
      setInterests(userProfile.areas_of_interest || []);
    }
  }, [userProfile]);

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addInterest = () => {
    // Validate and sanitize interest input
    const { isValid, sanitized } = validateTextInput(newInterest, 50);
    if (isValid && !interests.includes(sanitized) && interests.length < 10) {
      setInterests([...interests, sanitized]);
      setNewInterest("");
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile.",
          variant: "destructive",
        });
        return;
      }

      // Parse location into city and country
      const locationParts = location.split(',').map(part => part.trim());
      const city = locationParts[0] || '';
      const country = locationParts[1] || '';

      const { error } = await supabase
        .from('profiles')
        .update({
          city,
          country,
          areas_of_interest: interests,
          profile_photo_url: profilePicture,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>
          Manage your profile information, skills, and interests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture Section */}
        <div>
          <label className="text-sm font-medium mb-2 block">Profile Picture</label>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profilePicture} alt={userProfile?.name || 'Member'} />
              <AvatarFallback className="text-lg">
                {(userProfile?.name || 'M').split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
                id="profile-picture-upload"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('profile-picture-upload')?.click()}
              >
                <Camera className="w-4 h-4 mr-2" />
                Upload Picture
              </Button>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max 5MB)</p>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isLocationOpen}
                className="w-full justify-between"
              >
                {location || "Select city..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput 
                  placeholder="Search cities..." 
                  value={location}
                  onValueChange={setLocation}
                />
                <CommandList>
                  <CommandEmpty>No city found.</CommandEmpty>
                  <CommandGroup>
                    {popularCities
                      .filter(city => 
                        city.toLowerCase().includes(location.toLowerCase())
                      )
                      .slice(0, 10)
                      .map((city) => (
                        <CommandItem
                          key={city}
                          value={city}
                          onSelect={(currentValue) => {
                            setLocation(currentValue);
                            setIsLocationOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              location === city ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {city}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Bio Section */}
        <div>
          <label className="text-sm font-medium mb-2 block">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself, your professional background, and what you're passionate about..."
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {bio.length}/500 characters
          </p>
        </div>

        {/* Skills Section */}
        <div>
          <label className="text-sm font-medium mb-2 block">Your Skills & Expertise</label>
          <SkillSelector
            skills={userSkills}
            onSkillsChange={setUserSkills}
            placeholder="Add a skill or area of expertise..."
          />
        </div>

        {/* Interests Section */}
        <div>
          <label className="text-sm font-medium mb-2 block">Interests</label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add an interest..."
                className="flex-1"
                maxLength={50}
              />
              <Button onClick={addInterest} size="sm">Add</Button>
            </div>
          </div>
        </div>

        {/* Profile Visibility Settings */}
        <div className="border-t pt-6">
          <label className="text-sm font-medium mb-3 block">Profile Visibility Settings</label>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="profile-visibility"
              checked={isProfileVisibleToSupporters}
              onCheckedChange={(checked) => setIsProfileVisibleToSupporters(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="profile-visibility"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Make my profile visible to supporters
              </label>
              <p className="text-xs text-muted-foreground">
                Allow supporters to see your profile information and connect with you. You can change this setting later in your profile.
              </p>
            </div>
          </div>
        </div>

        <div>
          <Button 
            onClick={handleSaveChanges} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
