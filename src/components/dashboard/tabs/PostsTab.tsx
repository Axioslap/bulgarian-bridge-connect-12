import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useMemberAuth } from '@/hooks/useMemberAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import SkillSelector from '@/components/SkillSelector';
import { ArrowRight, Plus, MessageSquare } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
  comments?: { count: number }[];
}

const PostsTab = () => {
  const navigate = useNavigate();
  const { user } = useMemberAuth();
  const { toast } = useToast();
  
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch user's own posts
      const { data: userPosts, error: userPostsError } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          body,
          tags,
          created_at,
          comments:comments(count)
        `)
        .eq('author_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(4);

      if (userPostsError) throw userPostsError;
      setMyPosts(userPosts || []);

      // Fetch recent community posts (excluding user's own)
      const { data: communityPosts, error: communityPostsError } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          body,
          tags,
          created_at,
          comments:comments(count)
        `)
        .neq('author_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(4);

      if (communityPostsError) throw communityPostsError;
      setRecentPosts(communityPosts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPostTitle.trim() || !newPostBody.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          title: newPostTitle.trim(),
          body: newPostBody.trim(),
          tags: newPostTags
        })
        .select()
        .single();

      if (error) throw error;

      // Clear form
      setNewPostTitle('');
      setNewPostBody('');
      setNewPostTags([]);

      toast({
        title: "Post created!",
        description: "Your post has been published successfully.",
      });

      // Redirect to community posts page
      navigate('/community-posts');
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create New Post Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Post title..."
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <Textarea
            placeholder="What would you like to share with the community?"
            value={newPostBody}
            onChange={(e) => setNewPostBody(e.target.value)}
            rows={4}
          />
          <div>
            <label className="text-sm font-medium mb-2 block">Tags (optional)</label>
            <SkillSelector
              skills={newPostTags}
              onSkillsChange={setNewPostTags}
              placeholder="Add relevant tags..."
            />
          </div>
          <Button 
            onClick={handleCreatePost}
            disabled={!newPostTitle.trim() || !newPostBody.trim() || submitting}
            className="w-full"
          >
            {submitting ? 'Publishing...' : 'Publish Post'}
          </Button>
        </CardContent>
      </Card>

      {/* View All Posts Button */}
      <div className="text-center">
        <Button 
          onClick={() => navigate('/community-posts')}
          variant="outline"
          className="flex items-center gap-2"
        >
          See All Community Posts
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Your Posts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {myPosts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              You haven't created any posts yet. Start sharing with the community!
            </p>
          ) : (
            <div className="space-y-4">
              {myPosts.map((post) => (
                <div 
                  key={post.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate(`/community-posts/${post.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold line-clamp-1">{post.title}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      {post.comments?.[0]?.count || 0}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {post.body}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Community Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Community Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPosts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No recent community posts to show.
            </p>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div 
                  key={post.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate(`/community-posts/${post.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold line-clamp-1">{post.title}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      {post.comments?.[0]?.count || 0}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {post.body}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostsTab;