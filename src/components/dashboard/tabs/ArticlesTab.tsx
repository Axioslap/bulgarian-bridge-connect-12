
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Clock, Calendar } from "lucide-react";

const ArticlesTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const categories = ["All", "Tech", "Education", "Business", "Community"];
  
  const articles = [
    {
      id: 1,
      title: "The Future of Bulgarian Tech Industry",
      excerpt: "Exploring emerging trends and opportunities in Bulgaria's rapidly growing technology sector...",
      category: "Tech",
      author: "Maria Dimitrova",
      readTime: "5 min read",
      date: "2024-01-15",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Navigating US Education System",
      excerpt: "A comprehensive guide for Bulgarian students looking to study in American universities...",
      category: "Education",
      author: "Dr. Elena Stoyanova",
      readTime: "8 min read",
      date: "2024-01-12",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Cross-Border Business Strategies",
      excerpt: "How to build successful partnerships between Bulgarian and American companies...",
      category: "Business",
      author: "Alexander Petrov",
      readTime: "6 min read",
      date: "2024-01-10",
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Building Community Connections",
      excerpt: "The importance of networking and community building for professional growth...",
      category: "Community",
      author: "Kristina Marinova",
      readTime: "4 min read",
      date: "2024-01-08",
      image: "/placeholder.svg"
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles</CardTitle>
        <CardDescription>
          Read insights, analysis, and stories from our community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles..."
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

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>By {article.author}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.date}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No articles found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticlesTab;
