import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, X, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  profileId: string;
  initial?: any;
  onMessageClick?: (member: any) => void;
}

export default function ProfileModal({
  open,
  onClose,
  profileId,
  initial,
  onMessageClick
}: ProfileModalProps) {
  const [profile, setProfile] = useState<any>(initial || null);
  const [loading, setLoading] = useState(!initial);
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    
    // Fetch only if not provided
    if (!initial) {
      console.log('Opening ProfileModal for:', profileId);
      (async () => {
        const { data, error } = await supabase
          .rpc('get_profile_public', { _id: profileId })
          .maybeSingle();
        
        if (error) {
          console.error('Profile fetch error:', error);
          toast({
            title: "Error loading profile",
            description: error.message,
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        if (!data) {
          console.error('No profile found for ID:', profileId);
          toast({
            title: "Profile not found",
            description: "This profile may be private or doesn't exist",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        console.log('Profile data loaded:', data);
        setProfile(data);
        setLoading(false);
      })();
    }

    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, profileId, initial, onClose]);

  if (!open) return null;

  const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || "Profile" : "Profile";

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div
        ref={ref}
        className="absolute left-1/2 top-6 -translate-x-1/2 w-[92vw] max-w-2xl
                   rounded-2xl bg-background shadow-xl p-6 md:top-20 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-xl font-semibold">{fullName}</h2>
          <button 
            onClick={onClose} 
            aria-label="Close" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 w-1/3 bg-muted rounded" />
            <div className="h-24 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.profile_photo_url || "/placeholder.svg"} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">{fullName}</h3>
                  <Badge variant="outline" className="text-xs capitalize">
                    {profile?.membership_type || 'Member'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                <div className="space-y-1">
                  {profile?.job_title && (
                    <p className="text-sm font-medium">
                      {profile.job_title}{profile?.company ? ` at ${profile.company}` : ""}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    📍 {profile?.city}, {profile?.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            {profile?.university && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Education
                </h4>
                <p className="text-sm">🎓 {profile.university}</p>
              </div>
            )}

            {/* Areas of Interest */}
            {profile?.areas_of_interest?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Areas of Interest
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.areas_of_interest.map((interest: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reason for Joining */}
            {profile?.reason_for_joining && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Why I Joined ABTC
                </h4>
                <p className="text-sm text-muted-foreground">{profile.reason_for_joining}</p>
              </div>
            )}

            {/* Mentoring */}
            {profile?.willing_to_mentor && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Mentoring
                </h4>
                <p className="text-sm text-muted-foreground">{profile.willing_to_mentor}</p>
              </div>
            )}

            {/* LinkedIn */}
            {profile?.linkedin_profile && (
              <div>
                <a 
                  href={profile.linkedin_profile} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  View LinkedIn Profile
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Member Since */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Member Since
              </h4>
              <p className="text-sm">{new Date(profile?.created_at).toLocaleDateString()}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
              {onMessageClick && (
                <Button 
                  onClick={() => {
                    onMessageClick(profile);
                    onClose();
                  }} 
                  className="flex-1"
                >
                  Send Message
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}