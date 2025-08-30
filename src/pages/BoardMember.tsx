
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BoardMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const allMembers = [
    {
      id: "maria-dimitrova",
      name: "Maria Dimitrova",
      position: "Chairman of the Board",
      country: "United States",
      organization: "Tech Innovation Labs, Senior Director",
      quote: "Bridging cultures through innovation and entrepreneurship.",
      image: "/placeholder.svg",
      fullBio: "Maria Dimitrova serves as Chairman of the Board for ABTC Bulgaria, bringing extensive experience in technology innovation and cross-cultural business development. As Senior Director at Tech Innovation Labs, she has been instrumental in developing strategic partnerships between American and Bulgarian tech companies. Maria holds an MBA from Stanford University and has over 15 years of experience in international business development. Her passion for bridging cultures through innovation has made her a respected leader in the Bulgarian-American business community."
    },
    {
      id: "alexander-petrov",
      name: "Alexander Petrov",
      position: "Vice Chairman",
      country: "Bulgaria",
      organization: "Sofia Tech Park, CEO",
      quote: "Building tomorrow's tech ecosystem in Bulgaria.",
      image: "/placeholder.svg",
      fullBio: "Alexander Petrov serves as Vice Chairman and brings deep expertise in technology ecosystem development. As CEO of Sofia Tech Park, he has overseen the growth of Bulgaria's largest technology hub, supporting hundreds of startups and established companies. Alexander has been recognized as one of Bulgaria's most influential tech leaders and has played a crucial role in positioning Sofia as a major technology center in Eastern Europe."
    },
    {
      id: "elena-stoyanova",
      name: "Dr. Elena Stoyanova",
      position: "Board Member",
      country: "United States",
      organization: "MIT Research Lab, Principal Scientist",
      quote: "Advancing science and technology for global impact.",
      image: "/placeholder.svg",
      fullBio: "Dr. Elena Stoyanova is a distinguished scientist and Board Member who brings world-class research expertise to ABTC Bulgaria. As Principal Scientist at MIT Research Lab, she leads cutting-edge research in artificial intelligence and machine learning. Dr. Stoyanova has published over 50 peer-reviewed papers and holds multiple patents in AI technology. Her work focuses on developing AI solutions that can have positive global impact, particularly in healthcare and education."
    },
    {
      id: "dimitar-georgiev",
      name: "Dimitar Georgiev",
      position: "Board Member",
      country: "Bulgaria",
      organization: "Bulgarian-American Chamber of Commerce, Director",
      quote: "Fostering business partnerships across continents.",
      image: "/placeholder.svg",
      fullBio: "Dimitar Georgiev serves as a Board Member and brings extensive experience in international trade and business development. As Director of the Bulgarian-American Chamber of Commerce, he has facilitated numerous successful business partnerships between Bulgarian and American companies. Dimitar has over 20 years of experience in international business and has been instrumental in promoting Bulgarian businesses in the U.S. market."
    },
    {
      id: "kristina-marinova",
      name: "Kristina Marinova",
      position: "Board Member",
      country: "United States",
      organization: "Google, Senior Product Manager",
      quote: "Empowering the next generation of Bulgarian tech leaders.",
      image: "/placeholder.svg",
      fullBio: "Kristina Marinova is a Board Member who brings valuable experience from one of the world's leading technology companies. As Senior Product Manager at Google, she has led the development of products used by millions of users worldwide. Kristina is passionate about mentoring young Bulgarian professionals and has established several scholarship programs for Bulgarian students pursuing technology careers in the United States."
    },
    {
      id: "plamen-todorov",
      name: "Plamen Todorov",
      position: "Board Member",
      country: "Bulgaria",
      organization: "Innovation Capital, Managing Partner",
      quote: "Investing in Bulgaria's future through strategic partnerships.",
      image: "/placeholder.svg",
      fullBio: "Plamen Todorov serves as a Board Member and brings deep investment and venture capital expertise. As Managing Partner at Innovation Capital, he has led investments in over 30 Bulgarian startups, helping them scale internationally. Plamen has been instrumental in developing Bulgaria's venture capital ecosystem and has helped numerous Bulgarian entrepreneurs access international markets and funding."
    },
    {
      id: "ron-banks",
      name: "Ron Banks",
      position: "Advisory Board Member",
      country: "United States",
      organization: "Association of International Chambers of Commerce (AICC)",
      quote: "Guiding strategic direction and connecting to global best practices.",
      image: "/placeholder.svg",
      fullBio: "Ron brings strong experience in diplomacy and international cooperation. He serves on the board of the Association of International Chambers of Commerce (AICC) and represents the Association of American Clubs (AAC). Ron will guide our strategic direction and help connect the Club to global best practices in networking, community building, and cross-cultural business. His extensive network and diplomatic experience make him invaluable in establishing international partnerships and ensuring the Club follows best practices in global business networking."
    },
    {
      id: "kiril-totev",
      name: "Kiril A. Totev",
      position: "Advisory Board Member",
      country: "United States",
      organization: "Finance Expert, Minneapolis",
      quote: "Advising on financial and legal matters with 30+ years experience.",
      image: "/placeholder.svg",
      fullBio: "Kiril is a finance expert with over 30 years of experience in accounting, investments, and business development. Based in Minneapolis, he will advise on all financial and legal matters and support our U.S.-based activities. His extensive experience includes working with multinational corporations, managing investment portfolios, and providing strategic financial guidance to growing businesses. Kiril's expertise will be crucial in ensuring the Club's financial sustainability and growth."
    },
    {
      id: "kaloyan-velinov",
      name: "Kaloyan Velinov",
      position: "Advisory Board Member",
      country: "Bulgaria",
      organization: "BashHub Coworking Spaces, Co-founder",
      quote: "Supporting startups and innovation through community-building.",
      image: "/placeholder.svg",
      fullBio: "Kaloyan is an entrepreneur and co-founder of BashHub Coworking Spaces, which has supported over 300 startups in Bulgaria. He's also a mentor in Teenovator Bulgaria, helping high schoolers start their own ventures. Kaloyan brings expertise in innovation, entrepreneurship, and community-building. His passion for fostering entrepreneurship and his hands-on experience in building startup communities make him an ideal advisor for developing the Club's entrepreneurship programs and startup support initiatives."
    },
    {
      id: "tanya-hadzhieva",
      name: "Tanya Hadzhieva",
      position: "Advisory Board Member",
      country: "United Kingdom",
      organization: "G100: Mission Million, UK Country Chair",
      quote: "Advocating for innovation and gender equality globally.",
      image: "/placeholder.svg",
      fullBio: "Tanya is a communications expert and advocate for innovation and gender equality. She is the UK Country Chair for G100: Mission Million, and has worked with global organizations like the UN, G7, and G20. She offers valuable insight into strategic partnerships and international development. Her experience in global communications and her work with international organizations provide the Club with unique perspectives on building strategic partnerships and promoting diversity and inclusion in business and technology."
    },
    {
      id: "tzvetana-duffy",
      name: "Tzvetana Duffy",
      position: "Advisory Board Member",
      country: "United States",
      organization: "Planet, Engineering Leader",
      quote: "Leading digital transformation and global engineering teams.",
      image: "/placeholder.svg",
      fullBio: "Tzvetana is an experienced IT executive currently leading engineering at Planet in San Francisco. Previously, she spent nearly 20 years at Autodesk. She specializes in digital transformation, business analytics, and global leadership. She is also a strategic advisor at the University of San Francisco and a member of the San Francisco CIO Community. Her extensive experience in leading global engineering teams and digital transformation initiatives makes her an invaluable advisor for the Club's technology strategy and professional development programs."
    },
    {
      id: "yana-balashova",
      name: "Dr. Yana Balashova",
      position: "Advisory Board Member",
      country: "Bulgaria",
      organization: "I AM YOU PEACE GLOBAL, Founder",
      quote: "Promoting peace, sustainability, and youth engagement.",
      image: "/placeholder.svg",
      fullBio: "Yana is the founder of I AM YOU PEACE GLOBAL, a Bulgarian NGO promoting peace, sustainability, and youth engagement. Based in Varna, she also teaches at the University of Economics – Varna. She brings strong experience in international youth programs and will lead regional outreach along the Black Sea coast. Her expertise in youth engagement and sustainability initiatives aligns perfectly with the Club's mission to engage young professionals and promote sustainable business practices."
    }
  ];

  const member = allMembers.find(m => m.id === id);

  if (!member) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Board Member Not Found</h1>
            <Button onClick={() => navigate("/about")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to About
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-1 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/about")}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to About
          </Button>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-red-600 px-8 py-12 text-white">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
                />
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-bold mb-2">{member.name}</h1>
                  <p className="text-xl mb-2 opacity-90">{member.position}</p>
                  <p className="text-lg opacity-80">{member.organization}</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600">{member.country}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Position</h3>
                  <p className="text-gray-600">{member.position}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Organization</h3>
                  <p className="text-gray-600">{member.organization}</p>
                </div>
              </div>
              
              {member.quote && (
                <blockquote className="text-lg text-gray-700 italic border-l-4 border-primary pl-6 mb-8">
                  "{member.quote}"
                </blockquote>
              )}
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Biography</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {member.fullBio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BoardMember;
