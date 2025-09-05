import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DiscussionPost from "@/components/DiscussionPost";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AllPosts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterTag, setFilterTag] = useState("all");
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
          profiles:user_id(first_name, last_name)
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

  // Extract unique tags
  const allTags = Array.from(
    new Set(discussions.flatMap(post => post.tags || []))
  );

  // Filter and sort posts
  const filteredPosts = discussions
    .filter(post => {
      const author = post.profiles ? `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim() : 'Unknown User';
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = filterTag === "all" || post.tags?.includes(filterTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "popular":
          return (b.likes_count || 0) - (a.likes_count || 0);
        case "discussed":
          return (b.comments_count || 0) - (a.comments_count || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">All Community Posts</h1>
              <p className="text-muted-foreground">
                Explore discussions, insights, and opportunities shared by our community
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts, authors, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Liked</SelectItem>
                    <SelectItem value="discussed">Most Discussed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Posts Grid */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'Post' : 'Posts'} Found
                  </h2>
                </div>

                {filteredPosts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">
                        {searchQuery || filterTag !== "all" ? 'No posts found matching your criteria.' : 'No posts yet. Be the first to start a discussion!'}
                      </p>
                      {(searchQuery || filterTag !== "all") && (
                        <Button variant="outline" onClick={() => {
                          setSearchQuery("");
                          setFilterTag("all");
                          setSortBy("recent");
                        }}>
                          Clear Filters
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPosts.map((post) => (
                      <DiscussionPost 
                        key={post.id} 
                        post={{
                          id: post.id,
                          title: post.title,
                          content: post.content,
                          author: post.profiles ? `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim() : 'Unknown User',
                          timeAgo: new Date(post.created_at).toLocaleDateString(),
                          likes: post.likes_count || 0,
                          comments: post.comments_count || 0,
                          tags: post.tags || []
                        }}
                        onLike={() => fetchDiscussions()}
                        onComment={() => fetchDiscussions()}
                        showComments={true}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AllPosts;