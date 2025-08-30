import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Building, Users, Calendar } from "lucide-react";

const PartnerDetail = () => {
  const { id } = useParams();
  
  // Mock data - in a real app this would come from an API
  const partnerData: Record<string, any> = {
    "1": {
      name: "TechCorp",
      logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
      description: "Leading technology solutions provider specializing in enterprise software and digital transformation",
      category: "Technology",
      location: "Sofia, Bulgaria",
      partnership: "Strategic Technology Partner",
      established: "2015",
      employees: "500+",
      website: "www.techcorp.bg",
      collaboration: {
        overview: "TechCorp has been a strategic partner since 2020, providing technology solutions and expertise to help our members navigate digital transformation initiatives.",
        initiatives: [
          "Tech mentorship programs for young professionals",
          "Innovation workshops and seminars",
          "Internship opportunities for U.S.-educated Bulgarians",
          "Joint research and development projects"
        ],
        achievements: [
          "Launched 5 successful tech startups through our partnership",
          "Provided mentorship to 200+ young professionals",
          "Created 50+ high-tech job opportunities",
          "Organized 25+ innovation workshops"
        ]
      },
      upcomingEvents: [
        {
          title: "AI & Machine Learning Workshop",
          date: "July 15, 2024",
          type: "Workshop"
        },
        {
          title: "Tech Career Fair",
          date: "August 22, 2024",
          type: "Networking"
        }
      ]
    }
  };

  const partner = id ? partnerData[id] : null;

  if (!partner) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-800">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Partner Not Found</h1>
            <Link to="/partners">
              <Button>Back to Partners</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-800">
      <Header />
      
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-800 via-blue-700 to-red-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/partners" className="inline-flex items-center text-white hover:text-blue-100 mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Partners
          </Link>
          
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <img 
                src={partner.logo} 
                alt={`${partner.name} Logo`}
                className="w-20 h-20 object-contain"
              />
            </div>
            <div className="text-center md:text-left text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{partner.name}</h1>
              <p className="text-xl mb-4 text-blue-100">{partner.partnership}</p>
              <p className="text-lg leading-relaxed max-w-2xl">{partner.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Info */}
      <section className="py-12 bg-slate-700 border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-blue-700" />
              <div>
                <p className="text-sm text-slate-500">Established</p>
                <p className="font-semibold text-slate-900">{partner.established}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-blue-700" />
              <div>
                <p className="text-sm text-slate-500">Employees</p>
                <p className="font-semibold text-slate-900">{partner.employees}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-700" />
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p className="font-semibold text-slate-900">{partner.location}</p>
              </div>
            </div>
            <div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {partner.category}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Details */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Overview */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">Our Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed mb-6">{partner.collaboration.overview}</p>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Initiatives</h3>
                <ul className="space-y-2">
                  {partner.collaboration.initiatives.map((initiative, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-slate-600">{initiative}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">Achievements</CardTitle>
                <CardDescription>What we've accomplished together</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partner.collaboration.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                      <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-semibold">
                        ✓
                      </span>
                      <span className="text-slate-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Upcoming Joint Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partner.upcomingEvents.map((event, index) => (
              <Card key={index} className="bg-slate-50 border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge variant="outline" className="text-blue-700 border-blue-700">
                      {event.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
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

export default PartnerDetail;
