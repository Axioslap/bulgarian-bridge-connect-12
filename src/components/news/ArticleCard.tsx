
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, TrendingUp, Briefcase, Lock, Star } from "lucide-react";

interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  source: string;
  memberOnly: boolean;
  featured?: boolean;
}

interface ArticleCardProps {
  article: Article;
  onReadMore: (article: Article) => void;
}

const ArticleCard = ({ article, onReadMore }: ArticleCardProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Tech":
        return <TrendingUp className="w-4 h-4" />;
      case "Business":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Tech":
        return "bg-primary/10 text-primary border-primary/20";
      case "Business":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "Startups":
        return "bg-green-50 text-green-700 border-green-200";
      case "Education":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className={`${getCategoryColor(article.category)} flex items-center gap-1`}>
              {getCategoryIcon(article.category)}
              {article.category}
            </Badge>
            {article.memberOnly && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                <Star className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {article.date}
          </span>
        </div>
        <CardTitle className={`${article.memberOnly ? 'text-lg' : 'text-xl'} group-hover:text-primary transition-colors leading-tight`}>
          {article.title}
        </CardTitle>
        <CardDescription className={`text-gray-600 ${article.memberOnly ? 'text-sm' : ''} leading-relaxed`}>
          {article.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">{article.source}</span>
          <Button 
            variant="outline" 
            size="sm" 
            className={`${article.memberOnly ? 'group-hover:bg-blue-600' : 'group-hover:bg-primary'} group-hover:text-white transition-colors`}
            onClick={() => onReadMore(article)}
          >
            Read More
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
