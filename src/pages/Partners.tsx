
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Partners = () => {
  const partners = [
    {
      id: 1,
      name: "TechCorp",
      logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
      description: "Leading technology solutions provider",
      category: "Technology",
      location: "Sofia, Bulgaria",
      partnership: "Strategic Technology Partner"
    },
    {
      id: 2,
      name: "Innovation Labs",
      logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
      description: "Cutting-edge research and development",
      category: "Research & Development",
      location: "Plovdiv, Bulgaria",
      partnership: "Research Collaboration"
    },
    {
      id: 3,
      name: "Global Ventures",
      logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
      description: "International business expansion",
      category: "Business Development",
      location: "Varna, Bulgaria",
      partnership: "Business Expansion Partner"
    },
    {
      id: 4,
      name: "StartupHub",
      logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
      description: "Entrepreneurship and innovation support",
      category: "Entrepreneurship",
      location: "Burgas, Bulgaria",
      partnership: "Startup Incubation Partner"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section with Background */}
      <section className="relative overflow-hidden py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/90 via-blue-700/90 to-red-600/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Partners</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Building strong partnerships to advance American-Bulgarian business relationships
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner) => (
              <Card key={partner.id} className="group hover:shadow-xl transition-all duration-300 bg-white border-slate-200">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} Logo`}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">{partner.name}</CardTitle>
                  <CardDescription className="text-blue-700 font-medium">{partner.partnership}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600 mb-4">{partner.description}</p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-slate-500">
                      <span className="font-medium">Category:</span> {partner.category}
                    </p>
                    <p className="text-sm text-slate-500">
                      <span className="font-medium">Location:</span> {partner.location}
                    </p>
                  </div>
                  <Link to={`/partners/${partner.id}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-600">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partners;
