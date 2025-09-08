import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_photo_url?: string;
  university: string;
  job_title?: string;
  company?: string;
  country: string;
  city: string;
  areas_of_interest?: string[];
  linkedin_profile?: string;
  membership_type: string;
  created_at: string;
  reason_for_joining?: string;
  willing_to_mentor?: string;
}

const MemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            id,
            first_name,
            last_name,
            email,
            profile_photo_url,
            university,
            job_title,
            company,
            country,
            city,
            areas_of_interest,
            linkedin_profile,
            membership_type,
            created_at,
            reason_for_joining,
            willing_to_mentor
          `)
          .eq("id", id)
          .eq("is_public", true)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          navigate("/member?tab=search");
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error("Error:", error);
        navigate("/member?tab=search");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Profile not found</p>
            <Button 
              variant="outline" 
              onClick={() => navigate("/member?tab=search")}
              className="mt-4"
            >
              Back to Members
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/member?tab=search")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Members
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.profile_photo_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold">
                    {profile.first_name} {profile.last_name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mt-1">
                    📍 {profile.city}, {profile.country}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="capitalize">
                      {profile.membership_type || 'Member'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Member since {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoSection label="Education" value={profile.university} />
                <InfoSection label="Current Role" value={profile.job_title} />
                <InfoSection label="Company" value={profile.company} />
                <InfoSection 
                  label="LinkedIn" 
                  value={profile.linkedin_profile} 
                  isLink 
                />
              </div>

              {profile.areas_of_interest && profile.areas_of_interest.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Areas of Interest
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.areas_of_interest.map((interest, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.reason_for_joining && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Why They Joined
                  </h3>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    {profile.reason_for_joining}
                  </p>
                </div>
              )}

              {profile.willing_to_mentor && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Mentoring
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {profile.willing_to_mentor === 'yes' ? '✅ Available for mentoring' : '❌ Not available for mentoring'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

interface InfoSectionProps {
  label: string;
  value?: string;
  isLink?: boolean;
}

const InfoSection = ({ label, value, isLink = false }: InfoSectionProps) => {
  if (!value) return null;
  
  return (
    <div className="p-4 rounded-lg border bg-muted/20">
      <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
        {label}
      </div>
      <div className="mt-1">
        {isLink ? (
          <a 
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all text-sm"
          >
            {value}
          </a>
        ) : (
          <div className="font-medium text-sm">{value}</div>
        )}
      </div>
    </div>
  );
};

export default MemberProfile;