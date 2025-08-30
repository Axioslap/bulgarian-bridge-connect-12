
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SkillSelector from "@/components/SkillSelector";
import DiscussionPost from "@/components/DiscussionPost";
import { mockDiscussionPosts } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useMemberAuth } from "@/hooks/useMemberAuth";

const DiscussionTab = () => {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const { toast } = useToast();
  const { userProfile, userSkills } = useMemberAuth();
  const navigate = useNavigate();

  const userName = userProfile?.name || "";
  
  const yourPosts = mockDiscussionPosts.filter((p) => p.author === userName);
  const commentedPosts = mockDiscussionPosts.filter(
    (p) => p.author !== userName && p.hasUserCommented === true
  );

  const handlePostSubmit = () => {
    if (newPostTitle.trim() && newPostContent.trim()) {
      toast({
        title: "Post created successfully!",
        description: "Your post has been shared with the community.",
      });
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostTags([]);
    }
  };

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
        <section aria-labelledby="your-posts">
          <h3 className="text-lg font-semibold mb-4">Your Posts</h3>
          {yourPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">You haven't posted yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {yourPosts.slice(0, 4).map((post) => (
                <DiscussionPost key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="commented-posts">
          <h3 className="text-lg font-semibold mb-4">Posts You Commented On (Last 2 Weeks)</h3>
          {commentedPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">You haven't commented on any posts recently.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commentedPosts.slice(0, 4).map((post) => (
                <DiscussionPost key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DiscussionTab;
