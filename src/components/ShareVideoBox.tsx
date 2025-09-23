import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Lock } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";

export default function ShareVideoBox() {
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canUpload, setCanUpload] = useState(false);
  
  const { user, hasRoleOrHigher, loading } = useAuth();

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : "";
  };

  // Generate YouTube thumbnail URL
  const getYouTubeThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  useEffect(() => {
    const checkPermissions = async () => {
      if (user) {
        const isSuperAdmin = await hasRoleOrHigher('superadmin');
        setCanUpload(isSuperAdmin);
      } else {
        setCanUpload(false);
      }
    };
    
    checkPermissions();
  }, [user, hasRoleOrHigher]);

  async function share() {
    setStatus("");
    setIsSubmitting(true);

    if (!user) {
      setStatus("❌ Not logged in. Please log in first.");
      setIsSubmitting(false);
      return;
    }

    if (!canUpload) {
      setStatus("❌ Only Super Administrators can upload videos.");
      setIsSubmitting(false);
      return;
    }
    
    if (!title.trim() || !youtubeUrl.trim()) {
      setStatus("❌ Enter a title and a YouTube URL.");
      setIsSubmitting(false);
      return;
    }

    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      setStatus("❌ Please enter a valid YouTube URL.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("videos")
        .insert([{ 
          user_id: user.id, 
          title: title.trim(), 
          youtube_url: youtubeUrl.trim(),
          youtube_video_id: videoId,
          thumbnail_url: getYouTubeThumbnail(videoId),
          description: description.trim() || null,
          category: 'Community',
          tags: [],
          is_public: true
        }]);

      if (error) {
        setStatus(`❌ Insert failed: ${error.message} (code ${error.code || "n/a"})`);
      } else {
        setTitle(""); 
        setYoutubeUrl("");
        setDescription("");
        setStatus("✅ Video shared successfully!");
      }
    } catch (err: any) {
      setStatus(`❌ Unexpected error: ${err.message}`);
    }
    
    setIsSubmitting(false);
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!canUpload) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Video Upload Restricted
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Only Super Administrators can upload videos.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Share Video
        </CardTitle>
        <CardDescription>
          Share a YouTube video with the community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-xs rounded border p-3 bg-muted">
          <strong>Auth Status:</strong> {user ? (
            <>
              ✅ Logged in as {user.email} 
              <br />
              <span className="font-mono text-xs">uid: {user.id}</span>
            </>
          ) : (
            "❌ Not logged in"
          )}
        </div>

        <div>
          <Label htmlFor="title">Video Title *</Label>
          <Input
            id="title"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="youtube_url">YouTube URL *</Label>
          <Input
            id="youtube_url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe what this video is about"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          onClick={share}
          disabled={!user || !canUpload || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Sharing..." : "Share Video"}
        </Button>

        {status && (
          <div className={`text-sm p-3 rounded border ${
            status.includes("✅") ? "bg-green-50 border-green-200 text-green-800" : 
            "bg-red-50 border-red-200 text-red-800"
          }`}>
            {status}
          </div>
        )}
      </CardContent>
    </Card>
  );
}