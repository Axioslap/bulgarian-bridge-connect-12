
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, TrendingUp, Briefcase, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import MembershipPrompt from "./MembershipPrompt";

interface Article {
  id: number;
  title: string;
  description: string;
  fullContent: string;
  category: string;
  date: string;
  source: string;
  memberOnly: boolean;
}

interface ArticleViewProps {
  article: Article;
  isLoggedIn: boolean;
}

const ArticleView = ({ article, isLoggedIn }: ArticleViewProps) => {
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

  const truncatedContent = article.fullContent.split(' ').slice(0, 50).join(' ') + '...';
  const shouldShowMembership = article.memberOnly && !isLoggedIn;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/news" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Link>
          
          <div className="flex items-center gap-2 mb-4">
            <Badge className={`${getCategoryColor(article.category)} flex items-center gap-1`}>
              {getCategoryIcon(article.category)}
              {article.category}
            </Badge>
            {article.memberOnly && (
              <Badge variant="outline" className="text-xs">
                <Lock className="w-3 h-3 mr-1" />
                Members Only
              </Badge>
            )}
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {article.date}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{article.description}</p>
          <span className="text-sm font-medium text-gray-500">By {article.source}</span>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed text-lg">
            {shouldShowMembership ? truncatedContent : article.fullContent}
          </p>
          
          {shouldShowMembership && (
            <div className="mt-8">
              <MembershipPrompt />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArticleView;
