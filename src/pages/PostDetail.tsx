import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useMemberAuth } from '@/hooks/useMemberAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar, MessageSquare, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Post {
  id: string;
  title: string;
  body: string;
  tags: string[];
  author_id: string;
  created_at: string;
}

interface Comment {
  id: string;
  body: string;
  author_id: string;
  created_at: string;
  profiles?: {
    user_id: string;
    first_name: string;
    last_name: string;
  };
}

interface Profile {
  user_id: string;
  first_name: string;
  last_name: string;
}

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useMemberAuth();
  const { toast } = useToast();
  
  const [post, setPost] = useState<Post | null>(null);
  const [postAuthor, setPostAuthor] = useState<Profile | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .is('deleted_at', null)
        .single();

      if (postError) throw postError;
      setPost(postData);

      // Fetch post author
      const { data: authorData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .eq('user_id', postData.author_id)
        .single();

      if (authorData) {
        setPostAuthor(authorData);
      }

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('id, body, author_id, created_at')
        .eq('post_id', postId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Fetch comment authors
      const authorIds = commentsData?.map(comment => comment.author_id) || [];
      const { data: commentAuthors } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', authorIds);

      // Merge comment authors
      const commentsWithAuthors = commentsData?.map(comment => ({
        ...comment,
        profiles: commentAuthors?.find(author => author.user_id === comment.author_id)
      })) || [];

      setComments(commentsWithAuthors);
    } catch (error) {
      console.error('Error fetching post details:', error);
      toast({
        title: "Error",
        description: "Failed to load post details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      setSubmittingComment(true);

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          body: newComment.trim()
        })
        .select()
        .single();

      if (error) throw error;

      // Fetch the author info for the new comment
      const { data: authorData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .eq('user_id', user.id)
        .single();

      // Add comment to state
      const newCommentWithAuthor = {
        ...data,
        profiles: authorData
      };

      setComments(prev => [...prev, newCommentWithAuthor]);
      setNewComment('');

      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully.",
      });

      navigate('/community-posts');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading post...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Post not found</h2>
            <Button onClick={() => navigate('/community-posts')}>
              Back to Community Posts
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/community-posts')}
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Community Posts
          </Button>

          {/* Post Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {postAuthor ? `${postAuthor.first_name} ${postAuthor.last_name}` : 'Anonymous'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {user && post.author_id === user.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeletePost}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Post
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none mb-6">
                <p className="whitespace-pre-wrap">{post.body}</p>
              </div>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Comment Form */}
              {user && (
                <div className="mb-6">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-3"
                    rows={3}
                  />
                  <Button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || submittingComment}
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-l-2 border-muted pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {comment.profiles ? 
                            `${comment.profiles.first_name} ${comment.profiles.last_name}` : 
                            'Anonymous'
                          }
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{comment.body}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetail;