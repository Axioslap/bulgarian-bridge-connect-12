
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { validateToken, sanitizeInput } from "@/utils/security";

export const useMemberAuth = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userSkills, setUserSkills] = useState<string[]>(["Business Strategy", "Marketing", "Leadership"]);
  const [newsInterests, setNewsInterests] = useState<string[]>(["AI", "Fintech", "Blockchain", "Startup"]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate authentication and load user profile
    const authToken = localStorage.getItem('auth_token');
    const userEmail = localStorage.getItem('user_email');
    
    if (!authToken || !userEmail) {
      navigate('/login');
      return;
    }
    
    // Validate token
    const tokenData = validateToken(authToken);
    if (!tokenData) {
      navigate('/login');
      return;
    }
    
    // Set user profile from token
    setUserProfile({
      name: sanitizeInput(userEmail.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())),
      email: sanitizeInput(userEmail),
      usEducation: "MBA, Harvard Business School",
      joinDate: "May 2023",
      role: tokenData.role || "Member",
      skills: userSkills,
      bio: "Experienced business strategist with 8+ years in tech startups. Passionate about connecting Bulgarian talent with global opportunities."
    });
  }, [navigate, userSkills]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    navigate('/login');
  };

  return {
    userProfile,
    userSkills,
    setUserSkills,
    newsInterests,
    setNewsInterests,
    handleLogout
  };
};
