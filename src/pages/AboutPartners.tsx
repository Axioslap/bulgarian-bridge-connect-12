import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/common/SEO";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutPartners = () => {
  const navigate = useNavigate();

  const advisoryBoardMembers = [
    {
      id: "ron-banks",
      name: "Ron Banks",
      position: "Advisory Board Member",
      country: "United States",
      organization: "Association of International Chambers of Commerce (AICC)",
      quote: "Guiding strategic direction and connecting to global best practices.",
      image: "/placeholder.svg",
      description: "Ron brings strong experience in diplomacy and international cooperation. He serves on the board of the Association of International Chambers of Commerce (AICC) and represents the Association of American Clubs (AAC)."
    },
    {
      id: "kiril-totev",
      name: "Kiril A. Totev",
      position: "Advisory Board Member",
      country: "United States",
      organization: "Finance Expert, Minneapolis",
      quote: "Advising on financial and legal matters with 30+ years experience.",
      image: "/placeholder.svg",
      description: "Kiril is a finance expert with over 30 years of experience in accounting, investments, and business development. Based in Minneapolis, he will advise on all financial and legal matters and support our U.S.-based activities."
    },
    {
      id: "kaloyan-velinov",
      name: "Kaloyan Velinov",
      position: "Advisory Board Member",
      country: "Bulgaria",
      organization: "BashHub Coworking Spaces, Co-founder",
      quote: "Supporting startups and innovation through community-building.",
      image: "/placeholder.svg",
      description: "Kaloyan is an entrepreneur and co-founder of BashHub Coworking Spaces, which has supported over 300 startups in Bulgaria. He's also a mentor in Teenovator Bulgaria, helping high schoolers start their own ventures."
    },
    {
      id: "tanya-hadzhieva",
      name: "Tanya Hadzhieva",
      position: "Advisory Board Member",
      country: "United Kingdom",
      organization: "G100: Mission Million, UK Country Chair",
      quote: "Advocating for innovation and gender equality globally.",
      image: "/placeholder.svg",
      description: "Tanya is a communications expert and advocate for innovation and gender equality. She is the UK Country Chair for G100: Mission Million, and has worked with global organizations like the UN, G7, and G20."
    },
    {
      id: "tzvetana-duffy",
      name: "Tzvetana Duffy",
      position: "Advisory Board Member",
      country: "United States",
      organization: "Planet, Engineering Leader",
      quote: "Leading digital transformation and global engineering teams.",
      image: "/placeholder.svg",
      description: "Tzvetana is an experienced IT executive currently leading engineering at Planet in San Francisco. Previously, she spent nearly 20 years at Autodesk. She specializes in digital transformation, business analytics, and global leadership."
    },
    {
      id: "yana-balashova",
      name: "Dr. Yana Balashova",
      position: "Advisory Board Member",
      country: "Bulgaria",
      organization: "I AM YOU PEACE GLOBAL, Founder",
      quote: "Promoting peace, sustainability, and youth engagement.",
      image: "/placeholder.svg",
      description: "Yana is the founder of I AM YOU PEACE GLOBAL, a Bulgarian NGO promoting peace, sustainability, and youth engagement. Based in Varna, she also teaches at the University of Economics – Varna."
    }
  ];

  const partners = [
    {
      id: 1,
      name: "TechCorp",
      logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
      description: "Leading technology solutions provider",
      support: "Strategic Technology Partner - Supporting innovation and digital transformation initiatives"
    },
    {
      id: 2,
      name: "Innovation Labs",
      logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
      description: "Cutting-edge research and development",
      support: "Research Collaboration - Advancing technology research and development projects"
    },
    {
      id: 3,
      name: "Global Ventures",
      logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
      description: "International business expansion",
      support: "Business Expansion Partner - Facilitating cross-border business opportunities"
    },
    {
      id: 4,
      name: "StartupHub",
      logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
      description: "Entrepreneurship and innovation support",
      support: "Startup Incubation Partner - Nurturing entrepreneurship and startup ecosystem"
    }
  ];

  const handleMemberClick = (memberId: string) => {
    navigate(`/board-member/${memberId}`);
  };

  return (
    <>
      <SEO
        title="About & Partners | American Business & Technology Club"
        description="Meet our leadership team, advisory board members, and trusted partners. Learn about ABTC's mission to connect business and tech professionals with US-Bulgaria ties."
        keywords="about ABTC, leadership team, advisory board, partners, US Bulgaria business, technology club, professional network"
      />
      <div className="flex flex-col min-h-screen">
        <Header />
      
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 bg-gradient-to-br from-blue-800 via-blue-700 to-red-600">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
            }}
          ></div>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">About ABTC Bulgaria</h1>
              <p className="text-xl md:text-2xl mb-4 leading-relaxed">
                The American Business & Tech Club Bulgaria is an initiative designed to connect U.S.-educated Bulgarians, young professionals, and innovation partners.
              </p>
            </div>
          </div>
        </section>
      
        {/* Mission & Vision */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <div className="w-16 h-1 bg-primary mb-8"></div>
                <p className="text-gray-600 mb-6">
                  The American Business & Tech Club Bulgaria aims to foster a dynamic community that strengthens ties between the United States and Bulgaria through business innovation, knowledge sharing, and professional development.
                </p>
                <p className="text-gray-600">
                  We are dedicated to creating a pro-democracy, pro-education space that enables meaningful connections and opportunities for those who have studied in the U.S. and wish to contribute to Bulgaria's growing innovation ecosystem.
                </p>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                <div className="w-16 h-1 bg-primary mb-8"></div>
                <p className="text-gray-600 mb-6">
                  We envision a thriving network of professionals that bridges Bulgarian and American business cultures, fostering innovation, entrepreneurship, and lasting partnerships between the two countries.
                </p>
                <p className="text-gray-600">
                  Through our platform, we aim to establish Bulgaria as a regional hub for U.S.-inspired innovation and democratic values in business and technology.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Partners */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Partners</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              Building strong partnerships to advance American-Bulgarian business relationships
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {partners.map((partner) => (
                <Card key={partner.id} className="group hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
                      <img 
                        src={partner.logo} 
                        alt={`${partner.name} Logo`}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{partner.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-slate-600 mb-4 text-sm">{partner.description}</p>
                    <div className="border-t pt-4">
                      <p className="text-xs text-gray-500 font-medium mb-2">Why They Trust Us:</p>
                      <p className="text-sm text-blue-700">{partner.support}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Advisory Board Members */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Advisory Board</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-16"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advisoryBoardMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
                  onClick={() => handleMemberClick(member.id)}
                >
                  <div className="flex flex-col items-center mb-4">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary/10"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 text-center">{member.name}</h3>
                    <p className="text-primary font-medium mb-2 text-center">{member.position}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Location:</span> {member.country}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      <span className="font-medium">Organization:</span> {member.organization}
                    </p>
                  </div>
                  {member.quote && (
                    <blockquote className="text-sm text-gray-700 italic border-l-4 border-primary pl-4">
                      "{member.quote}"
                    </blockquote>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      
        <Footer />
      </div>
    </>
  );
};

export default AboutPartners;
