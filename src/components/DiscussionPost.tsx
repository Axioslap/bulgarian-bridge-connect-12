
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
}

interface DiscussionPostProps {
  post: {
    id: string;
    author: string;
    title: string;
    content: string;
    tags: string[];
    likes: number;
    comments: number;
    timeAgo: string;
    isLiked?: boolean;
  };
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  showComments?: boolean;
}

const DiscussionPost = ({ post, onLike, onComment, showComments = false }: DiscussionPostProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [showCommentsSection, setShowCommentsSection] = useState(showComments);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  
  const { user } = useMemberAuth();
  const { toast } = useToast();

  useEffect(() => {
    checkIfUserLiked();
  }, [user, post.id]);

  useEffect(() => {
    if (showCommentsSection) {
      fetchComments();
    }
  }, [showCommentsSection]);

  const checkIfUserLiked = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('discussion_likes')
        .select('id')
        .eq('discussion_id', post.id)
        .eq('user_id', user.id)
        .single();
      
      setIsLiked(!!data);
    } catch (error) {
      // User hasn't liked this post
      setIsLiked(false);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      // First get comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('discussion_comments')
        .select('id, content, created_at, user_id')
        .eq('discussion_id', post.id)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Then get profile data for each comment
      const commentsWithProfiles = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', comment.user_id)
            .single();

          return {
            ...comment,
            profiles: profile
          };
        })
      );

      setComments(commentsWithProfiles);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('discussion_likes')
          .delete()
          .eq('discussion_id', post.id)
          .eq('user_id', user.id);
        
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        // Like
        await supabase
          .from('discussion_likes')
          .insert({
            discussion_id: post.id,
            user_id: user.id
          });
        
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
      onLike?.(post.id);
    } catch (error: any) {
      console.error('Error handling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive",
      });
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to comment.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Validation Error",
        description: "Comment cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setSubmittingComment(true);
    try {
      const { error } = await supabase
        .from('discussion_comments')
        .insert({
          discussion_id: post.id,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment("");
      setCommentCount(prev => prev + 1);
      await fetchComments();
      onComment?.(post.id);
      
      toast({
        title: "Comment Added",
        description: "Your comment has been posted successfully.",
      });
    } catch (error: any) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment.",
        variant: "destructive",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const toggleComments = () => {
    setShowCommentsSection(!showCommentsSection);
    onComment?.(post.id);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-sm">{post.author}</h4>
              <p className="text-xs text-gray-500">{post.timeAgo}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">{post.title}</h3>
          <p className="text-sm text-gray-700">{post.content}</p>
        </div>
        
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleComments}
              className="flex items-center space-x-1 text-gray-500"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{commentCount}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        
        {showCommentsSection && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Add Comment Form */}
            {user && (
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                    className="min-h-[60px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim() || submittingComment}
                      className="px-4"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      {submittingComment ? 'Posting...' : 'Comment'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Comments List */}
            <div className="space-y-3">
              {loadingComments ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading comments...</p>
                </div>
              ) : comments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {comment.profiles ? `${comment.profiles.first_name?.[0] || ''}${comment.profiles.last_name?.[0] || ''}` : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-sm font-medium">
                          {comment.profiles ? `${comment.profiles.first_name || ''} ${comment.profiles.last_name || ''}`.trim() : 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscussionPost;
