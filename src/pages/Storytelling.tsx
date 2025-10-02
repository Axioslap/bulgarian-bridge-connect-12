import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/common/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Storytelling = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading videos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (videoId: string) => {
    navigate(`/member?tab=videos&video=${videoId}`);
  };

  return (
    <>
      <SEO
        title="Storytelling - Videos | American Business & Technology Club"
        description="Discover inspiring stories and insights from our community members who are making an impact across the globe. Watch videos about innovation, entrepreneurship, and success."
        keywords="storytelling, videos, community stories, member testimonials, innovation stories, entrepreneurship, success stories, ABTC Bulgaria"
      />
      <div className="flex flex-col min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/lovable-uploads/65c1a96b-0098-4b43-9e35-3e825d4e89b8.png')"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/80 to-slate-900/85"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Storytelling - Videos</h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-red-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover inspiring stories and insights from our community members who are making an impact across the globe.
            </p>
          </div>
        </section>

        {/* Videos Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading videos...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No videos available yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
                    onClick={() => handleVideoClick(video.id)}
                  >
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={video.thumbnail_url || '/placeholder.svg'} 
                        alt={video.title} 
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg">
                        <Play className="h-12 w-12 text-white drop-shadow-lg" />
                      </div>
                      {video.duration && (
                        <Badge className="absolute bottom-2 right-2 bg-black/80 text-white font-medium text-xs">
                          {video.duration}
                        </Badge>
                      )}
                      {video.is_featured && (
                        <Badge className="absolute top-2 left-2 bg-red-600 text-white font-medium text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors text-sm">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-gray-600 text-xs line-clamp-2 mb-2">{video.description}</p>
                      )}
                      {video.category && (
                        <Badge variant="outline" className="text-xs">
                          {video.category}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default Storytelling;
