
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Search, Play, Filter, Plus, Heart, Eye, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@supabase/supabase-js";
import ShareVideoBox from "@/components/ShareVideoBox";

interface Video {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  youtube_video_id: string;
  thumbnail_url: string;
  category: string;
  duration: string;
  tags: string[];
  is_featured: boolean;
  view_count: number;
  like_count: number;
  created_at: string;
  user_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
  is_liked?: boolean;
}

const VideosTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    youtube_url: "",
    category: "Community",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [canUpload, setCanUpload] = useState(false);
  
  const { toast } = useToast();
  const { user: authUser, hasRoleOrHigher, loading: authLoading } = useAuth();
  
  const categories = ["All", "Tech", "Education", "Business", "Community", "Inspiration", "Success Stories"];

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

  // Robust auth wiring
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: session } = await supabase.auth.getSession();
      if (mounted) setUser(session?.session?.user ?? null);
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const checkPermissions = async () => {
      if (authUser) {
        const isSuperAdmin = await hasRoleOrHigher('superadmin');
        setCanUpload(isSuperAdmin);
      } else {
        setCanUpload(false);
      }
    };
    
    checkPermissions();
  }, [authUser, hasRoleOrHigher]);

  useEffect(() => {
    fetchVideos();
  }, [user]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      const { data: videosData, error } = await supabase
        .from("videos")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles for video authors
      const userIds = videosData?.map(video => video.user_id) || [];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name")
        .in("user_id", userIds);

      const profilesMap = new Map(
        profilesData?.map(profile => [profile.user_id, profile]) || []
      );

      // Check which videos current user has liked
      let videosWithLikes: Video[] = [];
      if (user && videosData) {
        const { data: likeData } = await supabase
          .from("video_likes")
          .select("video_id")
          .eq("user_id", user.id);

        const likedVideoIds = new Set(likeData?.map(like => like.video_id) || []);
        
        videosWithLikes = videosData.map(video => ({
          ...video,
          profiles: profilesMap.get(video.user_id) || null,
          is_liked: likedVideoIds.has(video.id)
        }));
      } else if (videosData) {
        videosWithLikes = videosData.map(video => ({
          ...video,
          profiles: profilesMap.get(video.user_id) || null,
          is_liked: false
        }));
      }

      setVideos(videosWithLikes);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Error",
        description: "Failed to load videos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addVideo = async () => {
    console.log("addVideo called - user:", user);
    
    if (!user) {
      console.log("No user found, showing auth error");
      toast({
        title: "Authentication required",
        description: "Please log in to share videos.",
        variant: "destructive",
      });
      return;
    }

    if (!newVideo.title || !newVideo.youtube_url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const videoId = extractYouTubeId(newVideo.youtube_url);
    if (!videoId) {
      toast({
        title: "Error",
        description: "Please enter a valid YouTube URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("videos")
        .insert({
          title: newVideo.title,
          description: newVideo.description,
          youtube_url: newVideo.youtube_url,
          youtube_video_id: videoId,
          thumbnail_url: getYouTubeThumbnail(videoId),
          category: newVideo.category,
          tags: newVideo.tags,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video added successfully!",
      });

      setIsAddVideoOpen(false);
      setNewVideo({
        title: "",
        description: "",
        youtube_url: "",
        category: "Community",
        tags: [],
      });
      setTagInput("");
      fetchVideos();
    } catch (err: any) {
      console.error("Error adding video:", err);
      toast({
        title: "Insert failed",
        description: `${err?.message || 'Unknown error'} (code ${err?.code || 'n/a'})`,
        variant: "destructive",
      });
    }
  };

  const toggleLike = async (videoId: string, isCurrentlyLiked: boolean) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like videos.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isCurrentlyLiked) {
        const { error } = await supabase
          .from("video_likes")
          .delete()
          .eq("video_id", videoId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("video_likes")
          .insert({
            video_id: videoId,
            user_id: user.id,
          });

        if (error) throw error;
      }

      // Update local state
      setVideos(prev => prev.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              is_liked: !isCurrentlyLiked,
              like_count: isCurrentlyLiked ? video.like_count - 1 : video.like_count + 1
            }
          : video
      ));
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteVideo = async (videoId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", videoId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video deleted successfully!",
      });

      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      toast({
        title: "Error",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !newVideo.tags.includes(tagInput.trim())) {
      setNewVideo(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewVideo(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openPlayer = (video: Video) => {
    setActiveVideo(video);
    setPlayerOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Storytelling - Videos</CardTitle>
            <CardDescription>
              Watch inspiring stories and insights from our community
            </CardDescription>
          </div>
          {canUpload && (
            <Dialog open={isAddVideoOpen} onOpenChange={setIsAddVideoOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Share Video
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Share a YouTube Video</DialogTitle>
                  <DialogDescription>
                    Share an inspiring video with the ABTC community
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter video title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="youtube_url">YouTube URL *</Label>
                    <Input
                      id="youtube_url"
                      value={newVideo.youtube_url}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, youtube_url: e.target.value }))}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newVideo.description}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this video is about"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newVideo.category} onValueChange={(value) => setNewVideo(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat !== "All").map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {newVideo.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddVideoOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      console.log("Share Video button clicked");
                      addVideo();
                    }}>
                      Share Video
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Debug Video Sharing Component */}
        {user && (
          <ShareVideoBox />
        )}

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="h-4 w-4 mt-3 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Video Player Modal */}
        <Dialog open={playerOpen} onOpenChange={setPlayerOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{activeVideo?.title || "Video"}</DialogTitle>
              <DialogDescription>{activeVideo?.description || ""}</DialogDescription>
            </DialogHeader>
            <AspectRatio ratio={16/9} className="w-full overflow-hidden rounded-lg">
              <iframe
                src={activeVideo ? `https://www.youtube-nocookie.com/embed/${activeVideo.youtube_video_id}?autoplay=1&rel=0&modestbranding=1` : undefined}
                title={activeVideo?.title || "YouTube video player"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </AspectRatio>
            <div className="flex justify-end pt-3">
              <Button asChild variant="outline">
                <a href={activeVideo ? `https://youtu.be/${activeVideo.youtube_video_id}` : '#'} target="_blank" rel="noopener noreferrer">
                  Open on YouTube
                </a>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Videos Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <img 
                    src={video.thumbnail_url} 
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-t-lg cursor-pointer"
                    onClick={() => openPlayer(video)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg cursor-pointer" onClick={() => openPlayer(video)}>
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    YouTube
                  </Badge>
                  {user?.id === video.user_id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteVideo(video.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {video.category}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {video.view_count}
                      </div>
                      <button
                        onClick={() => toggleLike(video.id, video.is_liked || false)}
                        className={`flex items-center gap-1 transition-colors ${
                          video.is_liked ? 'text-red-500' : 'hover:text-red-500'
                        }`}
                      >
                        <Heart className={`h-3 w-3 ${video.is_liked ? 'fill-current' : ''}`} />
                        {video.like_count}
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h3>
                  {video.description && (
                    <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{video.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-xs">
                      By {video.profiles?.first_name} {video.profiles?.last_name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(video.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {video.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredVideos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No videos found</p>
            <p className="text-sm">
              {searchTerm || selectedCategory !== "All" 
                ? "Try adjusting your search or filters"
                : "Be the first to share an inspiring video with the community!"
              }
            </p>
            {user && !searchTerm && selectedCategory === "All" && (
              <Button className="mt-4" onClick={() => setIsAddVideoOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Share Your First Video
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideosTab;
