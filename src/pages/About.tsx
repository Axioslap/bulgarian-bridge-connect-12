
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const About = () => {
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
      description: "Ron brings strong experience in diplomacy and international cooperation. He serves on the board of the Association of International Chambers of Commerce (AICC) and represents the Association of American Clubs (AAC). Ron will guide our strategic direction and help connect the Club to global best practices in networking, community building, and cross-cultural business."
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
      description: "Kaloyan is an entrepreneur and co-founder of BashHub Coworking Spaces, which has supported over 300 startups in Bulgaria. He's also a mentor in Teenovator Bulgaria, helping high schoolers start their own ventures. Kaloyan brings expertise in innovation, entrepreneurship, and community-building."
    },
    {
      id: "tanya-hadzhieva",
      name: "Tanya Hadzhieva",
      position: "Advisory Board Member",
      country: "United Kingdom",
      organization: "G100: Mission Million, UK Country Chair",
      quote: "Advocating for innovation and gender equality globally.",
      image: "/placeholder.svg",
      description: "Tanya is a communications expert and advocate for innovation and gender equality. She is the UK Country Chair for G100: Mission Million, and has worked with global organizations like the UN, G7, and G20. She offers valuable insight into strategic partnerships and international development."
    },
    {
      id: "tzvetana-duffy",
      name: "Tzvetana Duffy",
      position: "Advisory Board Member",
      country: "United States",
      organization: "Planet, Engineering Leader",
      quote: "Leading digital transformation and global engineering teams.",
      image: "/placeholder.svg",
      description: "Tzvetana is an experienced IT executive currently leading engineering at Planet in San Francisco. Previously, she spent nearly 20 years at Autodesk. She specializes in digital transformation, business analytics, and global leadership. She is also a strategic advisor at the University of San Francisco and a member of the San Francisco CIO Community."
    },
    {
      id: "yana-balashova",
      name: "Dr. Yana Balashova",
      position: "Advisory Board Member",
      country: "Bulgaria",
      organization: "I AM YOU PEACE GLOBAL, Founder",
      quote: "Promoting peace, sustainability, and youth engagement.",
      image: "/placeholder.svg",
      description: "Yana is the founder of I AM YOU PEACE GLOBAL, a Bulgarian NGO promoting peace, sustainability, and youth engagement. Based in Varna, she also teaches at the University of Economics – Varna. She brings strong experience in international youth programs and will lead regional outreach along the Black Sea coast."
    }
  ];

  const handleMemberClick = (memberId: string) => {
    navigate(`/board-member/${memberId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section with Background */}
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

      {/* Advisory Board Members */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Advisory Board Members</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-16"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advisoryBoardMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
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
  );
};

export default About;
