
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Play, Filter } from "lucide-react";

const VideosTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const categories = ["All", "Tech", "Education", "Business", "Community"];
  
  const videos = [
    {
      id: 1,
      title: "Building Tech Bridges: Bulgaria-US Partnerships",
      description: "A discussion on fostering international tech collaboration",
      category: "Tech",
      duration: "15:30",
      thumbnail: "/placeholder.svg",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Educational Excellence: My Harvard Experience",
      description: "Personal story about studying at Harvard Business School",
      category: "Education",
      duration: "22:45",
      thumbnail: "/placeholder.svg",
      date: "2024-01-10"
    },
    {
      id: 3,
      title: "Starting a Business in Sofia",
      description: "Entrepreneurship journey in Bulgaria's capital",
      category: "Business",
      duration: "18:20",
      thumbnail: "/placeholder.svg",
      date: "2024-01-05"
    },
    {
      id: 4,
      title: "Community Impact: Giving Back",
      description: "How ABTC members are making a difference",
      category: "Community",
      duration: "12:15",
      thumbnail: "/placeholder.svg",
      date: "2024-01-01"
    }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storytelling - Videos</CardTitle>
        <CardDescription>
          Watch inspiring stories and insights from our community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="h-4 w-4 mt-3 text-gray-400" />
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

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-t-lg">
                  <Play className="h-12 w-12 text-white" />
                </div>
                <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                  {video.duration}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs">
                    {video.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">{video.description}</p>
                <p className="text-gray-500 text-xs">{video.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No videos found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideosTab;
