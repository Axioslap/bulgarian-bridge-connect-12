import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkillSelector from "@/components/SkillSelector";
import { ArrowLeft, Star, Users, Award } from "lucide-react";

const ExpertRegistration = () => {
  const { user } = useMemberAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    location: "",
    bio: "",
    email: "",
    linkedin_profile: "",
    profile_image_url: ""
  });
  
  const [expertise, setExpertise] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register as an expert.",
        variant: "destructive"
      });
      return;
    }

    if (expertise.length === 0) {
      toast({
        title: "Expertise Required",
        description: "Please add at least one area of expertise.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('experts')
        .insert({
          user_id: user.id,
          name: formData.name,
          title: formData.title,
          company: formData.company,
          location: formData.location,
          expertise: expertise,
          bio: formData.bio,
          email: formData.email,
          linkedin_profile: formData.linkedin_profile || null,
          profile_image_url: formData.profile_image_url || null
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already Registered",
            description: "You have already registered as an expert. Please check your dashboard.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Registration Successful!",
          description: "Your expert profile has been submitted for review. You'll be notified once approved.",
        });
        navigate('/member');
      }
    } catch (error) {
      console.error('Error registering expert:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Become an Expert</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Share your expertise with our community and help fellow professionals grow their careers.
              </p>
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Build Your Reputation</h3>
                  <p className="text-sm text-gray-600">Establish yourself as a thought leader in your field</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Network & Connect</h3>
                  <p className="text-sm text-gray-600">Connect with professionals seeking your expertise</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Award className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Make an Impact</h3>
                  <p className="text-sm text-gray-600">Help others succeed and grow in their careers</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Expert Registration Form</CardTitle>
              <CardDescription>
                Fill out the form below to register as an expert. Your profile will be reviewed before being published.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Professional Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Sofia, Bulgaria"
                  />
                </div>

                <div>
                  <Label>Areas of Expertise *</Label>
                  <SkillSelector
                    skills={expertise}
                    onSkillsChange={setExpertise}
                    placeholder="Add your areas of expertise..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Add skills and areas where you can provide expert guidance
                  </p>
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell us about your background, experience, and what makes you an expert in your field..."
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedin_profile">LinkedIn Profile</Label>
                    <Input
                      id="linkedin_profile"
                      name="linkedin_profile"
                      value={formData.linkedin_profile}
                      onChange={handleInputChange}
                      placeholder="your-linkedin-username"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="profile_image_url">Profile Image URL</Label>
                    <Input
                      id="profile_image_url"
                      name="profile_image_url"
                      type="url"
                      value={formData.profile_image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/your-photo.jpg"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Review Process</h4>
                  <p className="text-sm text-blue-700">
                    All expert profiles are manually reviewed to ensure quality and authenticity. 
                    You will receive an email notification once your profile is approved and published.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Expert Registration"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExpertRegistration;