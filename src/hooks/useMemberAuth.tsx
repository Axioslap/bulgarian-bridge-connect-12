
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const useMemberAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userSkills, setUserSkills] = useState<string[]>(["Business Strategy", "Marketing", "Leadership"]);
  const [newsInterests, setNewsInterests] = useState<string[]>(["AI", "Fintech", "Blockchain", "Startup"]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Load user profile from Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (profile) {
          setUserProfile({
            name: `${profile.first_name} ${profile.last_name}`,
            email: profile.email,
            usEducation: profile.university,
            joinDate: new Date(profile.created_at).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            }),
            role: "Member",
            skills: userSkills,
            bio: `${profile.job_title} at ${profile.company}. Located in ${profile.city}, ${profile.country}.`,
            areas_of_interest: profile.areas_of_interest,
            job_title: profile.job_title,
            company: profile.company,
            city: profile.city,
            country: profile.country
          });
        }
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Load user profile from Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (profile) {
            setUserProfile({
              name: `${profile.first_name} ${profile.last_name}`,
              email: profile.email,
              usEducation: profile.university,
              joinDate: new Date(profile.created_at).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              }),
              role: "Member",
              skills: userSkills,
              bio: `${profile.job_title} at ${profile.company}. Located in ${profile.city}, ${profile.country}.`,
              areas_of_interest: profile.areas_of_interest,
              job_title: profile.job_title,
              company: profile.company,
              city: profile.city,
              country: profile.country
            });
          }
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [userSkills]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    navigate('/');
  };

  return {
    user,
    userProfile,
    userSkills,
    setUserSkills,
    newsInterests,
    setNewsInterests,
    handleLogout
  };
};
