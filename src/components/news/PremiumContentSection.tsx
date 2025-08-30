
import { Button } from "@/components/ui/button";
import { Lock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import ArticleCard from "./ArticleCard";

interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  source: string;
  memberOnly: boolean;
}

interface PremiumContentSectionProps {
  articles: Article[];
  isLoggedIn: boolean;
  onReadMore: (article: Article) => void;
}

const PremiumContentSection = ({ articles, isLoggedIn, onReadMore }: PremiumContentSectionProps) => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50/50 to-red-50/50 border-t-4 border-gradient-to-r from-blue-600 to-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-blue-600" />
            <h2 className="text-4xl font-bold text-gray-900">Premium Member Content</h2>
            <Star className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
            Unlock exclusive insights, in-depth analysis, and premium content from industry leaders
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-red-600 rounded-full mx-auto"></div>
        </div>

        {!isLoggedIn && (
          <div className="mb-12">
            <div className="bg-gradient-to-br from-blue-100 to-red-100 border-2 border-blue-200 rounded-2xl p-8 text-center shadow-lg">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Lock className="w-16 h-16 text-blue-600" />
                  <div className="absolute -top-2 -right-2">
                    <Star className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Articles Await</h3>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Get access to exclusive business insights, detailed market analysis, and insider perspectives 
                on the U.S.-Bulgaria business corridor. Our premium content is crafted by industry experts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
                    <Star className="w-5 h-5 mr-2" />
                    Become a Member
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="border-blue-400 text-blue-700 hover:bg-blue-50">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} onReadMore={onReadMore} />
          ))}
        </div>

        {!isLoggedIn && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 via-white to-red-600 p-8 rounded-2xl shadow-2xl">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Unlock Premium Content?</h3>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Join our community of business leaders and get unlimited access to all premium articles
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all duration-200">
                  <Star className="w-5 h-5 mr-2" />
                  Become a Member to See Full Articles
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PremiumContentSection;
