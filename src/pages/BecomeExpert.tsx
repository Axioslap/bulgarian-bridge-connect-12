import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkillSelector from "@/components/SkillSelector";
import { ArrowLeft, Star, Users, Award } from "lucide-react";

const BecomeExpert = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // User account fields
    email: "",
    password: "",
    confirmPassword: "",
    // Expert profile fields
    name: "",
    title: "",
    company: "",
    location: "",
    bio: "",
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
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please make sure your passwords match.",
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
      // First, create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: formData.name.split(' ')[0] || '',
            last_name: formData.name.split(' ').slice(1).join(' ') || '',
            university: '', // Will be filled later if needed
            job_title: formData.title,
            company: formData.company,
            country: '',
            city: formData.location,
            areas_of_interest: expertise,
            reason_for_joining: 'Expert registration',
            willing_to_mentor: 'yes',
            linkedin_profile: formData.linkedin_profile,
            membership_type: 'expert'
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          toast({
            title: "Account Already Exists",
            description: "An account with this email already exists. Please log in instead.",
            variant: "destructive"
          });
        } else {
          throw authError;
        }
        return;
      }

      if (authData.user) {
        // Create the expert profile
        const { error: expertError } = await supabase
          .from('experts')
          .insert({
            user_id: authData.user.id,
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

        if (expertError) {
          console.error('Error creating expert profile:', expertError);
          // Don't fail the whole process if expert profile creation fails
        }

        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account. Your expert profile will be reviewed and activated soon.",
        });
        
        navigate('/');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
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
                Join our platform as an expert and share your knowledge with professionals worldwide.
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
              <CardTitle>Create Your Expert Account</CardTitle>
              <CardDescription>
                Fill out the form below to create your account and expert profile. Your profile will be reviewed before being published.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Information */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-medium mb-4">Account Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
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
                    
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Create a secure password"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>

                {/* Expert Profile Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Expert Profile Information</h3>
                  
                  <div className="space-y-4">
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
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• You'll receive an email to verify your account</li>
                    <li>• Your expert profile will be reviewed by our team</li>
                    <li>• Once approved, you'll be listed in our experts directory</li>
                    <li>• You'll gain access to the member platform</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Account..." : "Create Expert Account"}
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

export default BecomeExpert;