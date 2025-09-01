
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
    let mounted = true;

    // Get current session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (mounted) {
          setUser(null);
          setUserProfile(null);
        }
      }
    };

    const loadUserProfile = async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error loading profile:', error);
          return;
        }
        
        if (profile) {
          setUserProfile({
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User',
            email: profile.email || '',
            usEducation: profile.university || '',
            joinDate: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            }) : '',
            role: "Member",
            skills: userSkills,
            bio: `${profile.job_title || 'Professional'} at ${profile.company || 'Company'}. Located in ${profile.city || 'City'}, ${profile.country || 'Country'}.`,
            areas_of_interest: profile.areas_of_interest || [],
            job_title: profile.job_title || '',
            company: profile.company || '',
            city: profile.city || '',
            country: profile.country || ''
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        if (mounted) {
          setUserProfile(null);
        }
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Remove userSkills dependency to prevent infinite loops

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
