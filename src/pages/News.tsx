
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, Mail, Phone } from "lucide-react";
import NewsHero from "@/components/news/NewsHero";
import ArticleCard from "@/components/news/ArticleCard";
import PremiumContentSection from "@/components/news/PremiumContentSection";
import NewsletterSection from "@/components/news/NewsletterSection";
import ArticleView from "@/components/news/ArticleView";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const News = () => {
  // Mock user authentication state - in real app this would come from auth context
  const isLoggedIn = false; // This would be dynamic based on actual auth state
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get('article');
  
  // Sample news articles with full content
  const newsArticles = [
    {
      id: 1,
      title: "Bulgaria's Tech Sector Sees Record Investment in 2024",
      description: "Foreign direct investment in Bulgaria's technology sector reached an all-time high, with American companies leading the charge in establishing regional headquarters.",
      fullContent: "Foreign direct investment in Bulgaria's technology sector reached an all-time high this year, with American companies leading the charge in establishing regional headquarters. The Bulgarian Investment Promotion Agency reported a 45% increase in tech-related FDI compared to 2023, with total investments exceeding €2.8 billion. Major American tech companies including Microsoft, Amazon Web Services, and several Fortune 500 firms have announced significant expansions of their Bulgarian operations. This surge is attributed to Bulgaria's competitive talent pool, favorable business environment, and strategic location within the EU. The country's tech workforce has grown by 30% over the past two years, with universities adapting curricula to meet industry demands. Government initiatives including tax incentives for R&D activities and streamlined regulatory processes have made Bulgaria an attractive destination for international tech investments.",
      category: "Tech",
      date: "May 25, 2025",
      source: "Sofia Tech Report",
      url: "#",
      featured: true,
      memberOnly: false,
    },
    {
      id: 4,
      title: "Digital Transformation Drives Bulgarian Economic Growth",
      description: "Government initiatives in digitalization are attracting international businesses to establish operations in Bulgaria, creating new opportunities for tech professionals.",
      fullContent: "Government initiatives in digitalization are attracting international businesses to establish operations in Bulgaria, creating unprecedented opportunities for tech professionals across the country. The Bulgarian Digital Transformation Strategy 2025 has successfully attracted over 150 international companies to set up operations in major cities including Sofia, Plovdiv, and Varna. These initiatives have resulted in the creation of more than 25,000 new tech jobs, with average salaries increasing by 35% year-over-year. The government's investment in digital infrastructure, including 5G network deployment and fiber optic expansion, has positioned Bulgaria as a leading destination for tech companies seeking European market access.",
      category: "Tech",
      date: "May 18, 2025",
      source: "Digital Bulgaria",
      url: "#",
      featured: true,
      memberOnly: false,
    },
    {
      id: 2,
      title: "US-Bulgaria Trade Partnership Expands to Include AI Research",
      description: "New bilateral agreement opens opportunities for joint artificial intelligence research projects between American and Bulgarian institutions.",
      fullContent: "A groundbreaking bilateral agreement between the United States and Bulgaria has opened unprecedented opportunities for joint artificial intelligence research projects. The partnership, signed during the recent trade summit in Sofia, establishes a framework for collaboration between American tech giants and Bulgarian research institutions. Under this agreement, leading US universities including MIT, Stanford, and Carnegie Mellon will partner with Bulgarian institutions such as Sofia University and the Technical University of Sofia. The initiative includes a $50 million joint funding pool for AI research projects focusing on healthcare, cybersecurity, and sustainable technology solutions. Bulgarian startups working on AI technologies will gain access to Silicon Valley mentorship programs and potential investment opportunities.",
      category: "Business",
      date: "May 23, 2025",
      source: "Business Bulgaria",
      url: "#",
      featured: false,
      memberOnly: true,
    },
    {
      id: 3,
      title: "Bulgarian Startups Gain Access to Silicon Valley Accelerators",
      description: "Three Bulgarian tech startups have been accepted into prestigious US accelerator programs, marking a significant milestone for the local startup ecosystem.",
      fullContent: "Three Bulgarian tech startups have achieved a remarkable milestone by securing spots in prestigious Silicon Valley accelerator programs, marking a significant breakthrough for the country's startup ecosystem. The companies - AI-powered healthcare platform MedTech Sofia, fintech startup PayBalk, and sustainable energy solution provider GreenTech BG - were selected from over 2,000 international applicants. This achievement demonstrates the growing recognition of Bulgarian innovation capabilities on the global stage. The startups will receive mentorship from industry veterans, access to potential investors, and the opportunity to scale their operations internationally.",
      category: "Startups",
      date: "May 20, 2025",
      source: "Startup Europe",
      url: "#",
      featured: false,
      memberOnly: true,
    },
    {
      id: 5,
      title: "American Chamber of Commerce Bulgaria Reports Strong Q1 Results",
      description: "Member companies show impressive growth in the first quarter, with technology and financial services leading the expansion.",
      fullContent: "The American Chamber of Commerce in Bulgaria has reported exceptionally strong first-quarter results, with member companies demonstrating impressive growth across multiple sectors. Technology and financial services companies led the expansion, showing revenue increases of 28% and 22% respectively compared to Q1 2024. The chamber's quarterly report highlights significant investments in Bulgarian operations by major American corporations, including the establishment of new development centers and the expansion of existing facilities. Employment within AmCham member companies has grown by 15%, adding over 8,000 new positions across various skill levels.",
      category: "Business",
      date: "May 15, 2025",
      source: "AmCham Bulgaria",
      url: "#",
      featured: false,
      memberOnly: true,
    },
    {
      id: 6,
      title: "Bulgarian Universities Partner with US Tech Giants for Research",
      description: "Major American technology companies announce new research partnerships with Bulgarian universities, focusing on cybersecurity and blockchain technology.",
      fullContent: "Major American technology companies have announced significant new research partnerships with Bulgarian universities, focusing on cutting-edge cybersecurity and blockchain technology initiatives. The collaborations involve leading institutions such as Sofia University, Technical University of Sofia, and the University of Plovdiv, working alongside tech giants including IBM, Google, and Cisco. These partnerships will establish dedicated research labs equipped with state-of-the-art technology and will provide opportunities for Bulgarian students and researchers to work on real-world projects. The initiative is expected to produce breakthrough innovations in areas such as quantum-resistant cryptography, decentralized finance solutions, and advanced threat detection systems.",
      category: "Education",
      date: "May 12, 2025",
      source: "Tech Education Today",
      url: "#",
      featured: false,
      memberOnly: true,
    },
  ];

  const selectedArticle = articleId ? newsArticles.find(article => article.id === parseInt(articleId)) : null;
  const publicArticles = newsArticles.filter(article => !article.memberOnly);
  const memberOnlyArticles = newsArticles.filter(article => article.memberOnly);

  const handleReadMore = (article: any) => {
    if (article.memberOnly && !isLoggedIn) {
      window.location.href = 'mailto:asen.ivanov@a2balliance.com';
    } else {
      window.location.href = `/news?article=${article.id}`;
    }
  };

  // If viewing a specific article
  if (selectedArticle) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <ArticleView article={selectedArticle} isLoggedIn={isLoggedIn} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <NewsHero />

      {/* Public Articles Section */}
      <section className="py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Public News</h2>
            <p className="text-gray-600 mb-6">Stay updated with the latest developments - no registration required</p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {publicArticles.map((article) => (
              <ArticleCard key={article.id} article={article} onReadMore={handleReadMore} />
            ))}
          </div>
        </div>
      </section>

      <PremiumContentSection 
        articles={memberOnlyArticles} 
        isLoggedIn={isLoggedIn} 
        onReadMore={handleReadMore} 
      />

      <NewsletterSection />

      {/* Membership Modal */}
      <Dialog open={showMembershipModal} onOpenChange={setShowMembershipModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Member-Exclusive Content
            </DialogTitle>
            <DialogDescription>
              Our membership is invitation-only. Get in touch with us to learn about membership opportunities.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <a href="mailto:asen.ivanov@a2balliance.com" onClick={() => setShowMembershipModal(false)}>
              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                <Mail className="mr-2 h-4 w-4" />
                Contact Us by Email
              </Button>
            </a>
            <a href="https://wa.me/359877032223" target="_blank" rel="noopener noreferrer" onClick={() => setShowMembershipModal(false)}>
              <Button variant="outline" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                WhatsApp / Viber
              </Button>
            </a>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default News;
