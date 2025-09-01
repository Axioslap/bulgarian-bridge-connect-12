import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SkillSelector from "@/components/SkillSelector";
import DiscussionPost from "@/components/DiscussionPost";
import { useToast } from "@/hooks/use-toast";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { supabase } from "@/integrations/supabase/client";

const DiscussionTab = () => {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, userProfile } = useMemberAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const { data, error } = await supabase
        .from('discussions')
        .select(`
          *,
          profiles!inner(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching discussions:', error);
        return;
      }
      
      setDiscussions(data || []);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a post.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('discussions')
        .insert({
          user_id: user.id,
          title: newPostTitle,
          content: newPostContent,
          tags: newPostTags
        });

      if (error) throw error;

      toast({
        title: "Post created successfully!",
        description: "Your post has been shared with the community.",
      });
      
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostTags([]);
      fetchDiscussions(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create post.",
        variant: "destructive",
      });
    }
  };

  // Filter posts to show user's posts and other posts
  const userPosts = discussions.filter(post => post.user_id === user?.id);
  const otherPosts = discussions.filter(post => post.user_id !== user?.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
          <CardDescription>
            Share updates, opportunities, or start discussions with the community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Post title..."
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <Textarea
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={3}
          />
          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <SkillSelector
              skills={newPostTags}
              onSkillsChange={setNewPostTags}
              placeholder="Add tags (e.g., startup, networking)..."
            />
          </div>
          <Button onClick={handlePostSubmit} className="w-full">
            Share Post
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/all-posts')}
          className="px-8"
        >
          See All Posts
        </Button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading discussions...</p>
          </div>
        ) : (
          <>
            <section aria-labelledby="your-posts">
              <h3 className="text-lg font-semibold mb-4">Your Posts</h3>
              {userPosts.length === 0 ? (
                <p className="text-sm text-muted-foreground">You haven't posted yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userPosts.slice(0, 4).map((post) => (
                    <DiscussionPost 
                      key={post.id} 
                      post={{
                        id: post.id,
                        title: post.title,
                        content: post.content,
                        author: post.profiles ? `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim() : 'Unknown User',
                        timeAgo: new Date(post.created_at).toLocaleDateString(),
                        likes: post.likes_count,
                        comments: post.comments_count,
                        tags: post.tags || []
                      }} 
                    />
                  ))}
                </div>
              )}
            </section>

            <section aria-labelledby="recent-posts">
              <h3 className="text-lg font-semibold mb-4">Recent Community Posts</h3>
              {otherPosts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent posts from the community.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherPosts.slice(0, 4).map((post) => (
                    <DiscussionPost 
                      key={post.id} 
                      post={{
                        id: post.id,
                        title: post.title,
                        content: post.content,
                        author: post.profiles ? `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim() : 'Unknown User',
                        timeAgo: new Date(post.created_at).toLocaleDateString(),
                        likes: post.likes_count,
                        comments: post.comments_count,
                        tags: post.tags || []
                      }} 
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default DiscussionTab;