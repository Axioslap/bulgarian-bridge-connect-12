import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mail, Linkedin, MapPin, Search, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Expert {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  expertise: string[];
  bio: string;
  email: string;
  linkedin_profile?: string;
  profile_image_url?: string;
  rating: number;
  consultations_count: number;
}

const ExpertsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('is_approved', true)
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setExperts(data || []);
    } catch (error) {
      console.error('Error fetching experts:', error);
      toast({
        title: "Error",
        description: "Failed to load experts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredExperts = experts.filter(expert =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    expert.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Find an Expert</h1>
        <Button 
          variant="outline"
          onClick={() => navigate('/expert-registration')}
        >
          Become an Expert
          <ExternalLink className="w-4 h-4 ml-2" />
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

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredExperts.map((expert) => (
          <Card key={expert.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-200">
                    <img
                      src={expert.profile_image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"}
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
                      <div className="text-yellow-500 font-medium">★ {expert.rating.toFixed(1)}</div>
                      <div className="text-gray-500">{expert.consultations_count} sessions</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-3 h-3 mr-1" />
                    {expert.location}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {expert.bio}
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
                    {expert.linkedin_profile && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://linkedin.com/in/${expert.linkedin_profile}`, '_blank')}
                      >
                        <Linkedin className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

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