import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export default function ShareVideoBox() {
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

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
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) setUser(data?.session?.user ?? null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null);
    });
    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, []);

  async function share() {
    setStatus("");
    setLoading(true);

    if (!user) {
      setStatus("❌ Not logged in. Please log in first.");
      setLoading(false);
      return;
    }
    
    if (!title.trim() || !youtubeUrl.trim()) {
      setStatus("❌ Enter a title and a YouTube URL.");
      setLoading(false);
      return;
    }

    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      setStatus("❌ Please enter a valid YouTube URL.");
      setLoading(false);
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
    
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Share Video (Debug Mode)
        </CardTitle>
        <CardDescription>
          Share a YouTube video with detailed error reporting
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
          disabled={!user || loading}
          className="w-full"
        >
          {loading ? "Sharing..." : "Share Video"}
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