import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UniversitySelector from "@/components/UniversitySelector";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Users, Star, ArrowLeft, TrendingUp, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const [currentStep, setCurrentStep] = useState<'membership' | 'registration'>('membership');
  const [selectedMembership, setSelectedMembership] = useState<'free' | 'supporter' | 'annual' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    jobTitle: "",
    company: "",
    country: "",
    city: "",
    areasOfInterest: [] as string[],
    reasonForJoining: "",
    willingToMentor: "",
    linkedinProfile: "",
    referralMember: "",
    agreeToTerms: false,
    agreeToNewsletter: false,
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const areasOfInterestOptions = [
    "Startups",
    "Tech",
    "Business",
    "Education", 
    "Investment",
    "Culture",
    "Returning to Bulgaria",
    "Innovation",
    "Entrepreneurship",
    "Digital Transformation"
  ];

  const reasonForJoiningOptions = [
    "Networking",
    "Business Opportunities", 
    "Knowledge Sharing",
    "Social Events",
    "Mentorship",
    "Other"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string) => (checked: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAreasOfInterestChange = (area: string) => {
    setFormData(prev => ({
      ...prev,
      areasOfInterest: prev.areasOfInterest.includes(area)
        ? prev.areasOfInterest.filter(item => item !== area)
        : [...prev.areasOfInterest, area]
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setPreviewUrl("");
  };

  const uploadProfilePhoto = async (userId: string) => {
    if (!profilePhoto) return null;

    const fileExt = profilePhoto.name.split('.').pop();
    const fileName = `${userId}/profile.${fileExt}`;

    const { error, data } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, profilePhoto, {
        upsert: true
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handlePasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email.",
        variant: "destructive"
      });
    }
  };

  const handleMembershipSelect = (type: 'free' | 'supporter' | 'annual') => {
    setSelectedMembership(type);
    setCurrentStep('registration');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Error", 
        description: "Please agree to the terms and conditions",
        variant: "destructive"
      });
      return;
    }

    if (formData.areasOfInterest.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one area of interest",
        variant: "destructive"
      });
      return;
    }

    if (!formData.reasonForJoining) {
      toast({
        title: "Error",
        description: "Please select your reason for joining",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Sign up with Supabase Auth - the trigger will handle profile creation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            university: formData.university,
            job_title: formData.jobTitle,
            company: formData.company,
            country: formData.country,
            city: formData.city,
            areas_of_interest: formData.areasOfInterest,
            reason_for_joining: formData.reasonForJoining,
            willing_to_mentor: formData.willingToMentor,
            linkedin_profile: formData.linkedinProfile,
            referral_member: formData.referralMember,
            membership_type: selectedMembership || 'free',
            agree_to_terms: formData.agreeToTerms,
            agree_to_newsletter: formData.agreeToNewsletter
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      toast({
        title: "Registration Successful!",
        description: "Please check your email to verify your account before logging in."
      });

      // Redirect to login page 
      navigate('/login');

    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Check if user already exists
      if (error.message?.includes('User already registered') || 
          error.message?.includes('user_repeated_signup') ||
          error.code === '23505' || // Unique constraint violation
          error.message?.includes('already been registered')) {
        
        toast({
          title: "Email Already Registered",
          description: "This email is already registered. Please use another email or select 'Forgot Password?' to reset your account.",
          variant: "destructive",
          action: (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handlePasswordReset(formData.email)}
                className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
              >
                Reset Password
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80"
              >
                Go to Login
              </button>
            </div>
          )
        });
      } else {
        toast({
          title: "Registration Failed",
          description: error.message || "An error occurred during registration. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMembershipSelection = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Membership</h1>
        <p className="mt-2 text-gray-600">
          Select the membership type that best fits your needs
        </p>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
        {/* Free Membership */}
        <Card className="relative border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => handleMembershipSelect('free')}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Free Member</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Message other community members</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Access to free events</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Access to free videos and resources</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-2xl font-bold text-center">Free</p>
            </div>
            <Button className="w-full" onClick={() => handleMembershipSelect('free')}>
              Choose Free Membership
            </Button>
          </CardContent>
        </Card>

        {/* Community Supporter */}
        <Card className="relative border-2 border-gray-300 opacity-75 cursor-not-allowed">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-400 text-gray-700 px-4 py-1 rounded-full text-sm font-medium">
              Coming Soon
            </div>
          </div>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-gray-400" />
            </div>
            <CardTitle className="text-xl text-gray-600">Community Supporter</CardTitle>
            <CardDescription className="text-gray-500">Full access to everything</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-500">Message other community members</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-500">Access to ALL events (free & premium)</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-500">Access to ALL videos (free & premium)</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-500">Priority support and networking</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-2xl font-bold text-center text-gray-500">$45<span className="text-sm font-normal">/month</span></p>
              <p className="text-xs text-center text-gray-400 mt-1">Part goes to charity</p>
            </div>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        {/* Annual Premium */}
        <Card className="relative border-2 border-gray-300 opacity-75 cursor-not-allowed">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-400 text-gray-700 px-4 py-1 rounded-full text-sm font-medium">
              Coming Soon
            </div>
          </div>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-gray-400" />
            </div>
            <CardTitle className="text-xl text-gray-600">Annual Premium</CardTitle>
            <CardDescription className="text-gray-500">Pay for full year, get tax benefits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-500">Everything in Community Supporter</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-500">2 months FREE (save $90)</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-500">Tax deductible membership</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-500">Annual membership certificate</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-2xl font-bold text-center text-gray-500">$450<span className="text-sm font-normal">/year</span></p>
              <p className="text-xs text-center text-gray-400 mt-1">
                <span className="line-through">$540</span> • Save $90 + Tax Benefits
              </p>
            </div>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRegistrationForm = () => (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setCurrentStep('membership')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Membership Selection
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Registration</h1>
          <p className="mt-2 text-gray-600">
            You selected: <span className="font-semibold text-primary">
              {selectedMembership === 'free' ? 'Free Member' : selectedMembership === 'supporter' ? 'Community Supporter' : 'Annual Premium'}
            </span>
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registration Details</CardTitle>
          <CardDescription>
            To protect our members and maintain our exceptional community standards, we carefully review each application to guarantee an outstanding experience for everyone joining our exclusive network.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    type="text" 
                    required 
                    value={formData.firstName} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    type="text" 
                    required 
                    value={formData.lastName} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    value={formData.password} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    required 
                    value={formData.confirmPassword} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profile Photo</h3>
              <div className="flex items-center space-x-4">
                {previewUrl ? (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Profile preview" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                      onClick={removePhoto}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <Label htmlFor="photo" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>Upload Photo</span>
                    </Button>
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional - JPG, PNG up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Education & Professional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Education & Professional</h3>
              
              <div>
                <Label htmlFor="university">University *</Label>
                <div className="mt-2">
                  <UniversitySelector
                    value={formData.university}
                    onChange={(value) => setFormData(prev => ({ ...prev, university: value }))}
                    placeholder="Select your university..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">Current Role</Label>
                  <Input 
                    id="jobTitle" 
                    name="jobTitle" 
                    type="text" 
                    placeholder="e.g., Software Engineer" 
                    value={formData.jobTitle} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input 
                    id="company" 
                    name="company" 
                    type="text" 
                    placeholder="e.g., Tech Company Inc." 
                    value={formData.company} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input 
                    id="country" 
                    name="country" 
                    type="text" 
                    required
                    placeholder="e.g., Bulgaria" 
                    value={formData.country} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    type="text" 
                    required
                    placeholder="e.g., Sofia" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
            </div>

            {/* Areas of Interest */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Areas of Interest *</h3>
              <p className="text-sm text-gray-600">Select all that apply</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {areasOfInterestOptions.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={`interest-${area}`}
                      checked={formData.areasOfInterest.includes(area)}
                      onCheckedChange={() => handleAreasOfInterestChange(area)}
                    />
                    <Label htmlFor={`interest-${area}`} className="text-sm">
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Reason for Joining */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reason for Joining *</h3>
              <Select value={formData.reasonForJoining} onValueChange={handleSelectChange("reasonForJoining")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary reason" />
                </SelectTrigger>
                <SelectContent>
                  {reasonForJoiningOptions.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              
              <div>
                <Label htmlFor="willingToMentor">Willing to Mentor / Be Mentored</Label>
                <Select value={formData.willingToMentor} onValueChange={handleSelectChange("willingToMentor")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="maybe">Maybe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
                <Input 
                  id="linkedinProfile" 
                  name="linkedinProfile" 
                  type="url" 
                  placeholder="https://linkedin.com/in/yourprofile" 
                  value={formData.linkedinProfile} 
                  onChange={handleInputChange} 
                />
              </div>

              <div>
                <Label htmlFor="referralMember">Referral (Were you referred by a current member?)</Label>
                <Input 
                  id="referralMember" 
                  name="referralMember" 
                  type="text" 
                  placeholder="Name of the member who referred you" 
                  value={formData.referralMember} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="terms" 
                  checked={formData.agreeToTerms} 
                  onCheckedChange={handleCheckboxChange("agreeToTerms")} 
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the Terms and Conditions *
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    By checking this box, you agree to our terms of service and privacy policy.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="newsletter" 
                  checked={formData.agreeToNewsletter} 
                  onCheckedChange={handleCheckboxChange("agreeToNewsletter")} 
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="newsletter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Subscribe to newsletter and updates
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receive updates about events, news, and community activities.
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Submit Application"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-1 bg-gray-50 py-12">
        {currentStep === 'membership' ? renderMembershipSelection() : renderRegistrationForm()}
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;