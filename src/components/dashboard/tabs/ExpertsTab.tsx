import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mail, Linkedin, MapPin, Search } from "lucide-react";
import { useState } from "react";

const ExpertsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const experts = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Technology Innovation Consultant",
      company: "TechBridge Solutions",
      location: "Sofia, Bulgaria",
      expertise: ["Digital Transformation", "AI Strategy", "Startup Mentoring"],
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b000?w=400&h=400&fit=crop&crop=face",
      description: "Former Silicon Valley executive with 15+ years helping Bulgarian companies scale internationally.",
      email: "sarah.johnson@techbridge.bg",
      linkedin: "sarah-johnson-tech",
      rating: 4.9,
      consultations: 127
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Business Development Director",
      company: "US-Bulgaria Trade Council",
      location: "Boston, MA",
      expertise: ["Market Entry", "Partnership Strategy", "Cross-border Investments"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description: "Specializes in helping Bulgarian companies enter US markets and establish strategic partnerships.",
      email: "m.chen@ustrade.org",
      linkedin: "michael-chen-trade",
      rating: 4.8,
      consultations: 89
    },
    {
      id: 3,
      name: "Elena Petrov",
      title: "Financial Advisory Partner",
      company: "Atlantic Capital Partners",
      location: "New York, NY",
      expertise: ["Venture Capital", "Financial Planning", "IPO Preparation"],
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      description: "Expert in securing funding for tech startups and established companies looking to expand.",
      email: "elena.petrov@atlanticcap.com",
      linkedin: "elena-petrov-finance",
      rating: 4.9,
      consultations: 156
    }
  ];

  const filteredExperts = experts.filter(expert =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    expert.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Find an Expert</h1>
        <Button variant="outline">
          Become an Expert
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by name, expertise, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredExperts.map((expert) => (
          <Card key={expert.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-200">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{expert.name}</h3>
                      <p className="text-blue-600 font-medium text-sm">{expert.title}</p>
                      <p className="text-gray-500 text-sm">{expert.company}</p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-yellow-500 font-medium">★ {expert.rating}</div>
                      <div className="text-gray-500">{expert.consultations} sessions</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-3 h-3 mr-1" />
                    {expert.location}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {expert.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {expert.expertise.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                          {skill}
                        </Badge>
                      ))}
                      {expert.expertise.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                          +{expert.expertise.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => window.open(`mailto:${expert.email}`, '_blank')}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`https://linkedin.com/in/${expert.linkedin}`, '_blank')}
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExperts.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No experts found</h3>
          <p className="text-gray-500">Try adjusting your search terms or browse all experts.</p>
        </div>
      )}
    </div>
  );
};

export default ExpertsTab;