import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkillSelector from "@/components/SkillSelector";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Users, Star, ArrowLeft, TrendingUp } from "lucide-react";
const Register = () => {
  const [currentStep, setCurrentStep] = useState<'membership' | 'registration'>('membership');
  const [selectedMembership, setSelectedMembership] = useState<'free' | 'supporter' | 'annual' | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    usEducation: "",
    currentRole: "",
    company: "",
    bio: "",
    businessInterest: "",
    companyExpansionNeeds: "",
    agreeToTerms: false,
    agreeToNewsletter: false,
    profileVisibleToPartners: false
  });
  const [skills, setSkills] = useState<string[]>([]);
  const {
    toast
  } = useToast();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
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
  const handleMembershipSelect = (type: 'free' | 'supporter' | 'annual') => {
    setSelectedMembership(type);
    setCurrentStep('registration');
  };
  const handleSubmit = (e: React.FormEvent) => {
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

    // Here you would typically send the data to your backend
    console.log("Registration data:", {
      ...formData,
      skills,
      membershipType: selectedMembership
    });
    toast({
      title: "Registration Successful!",
      description: "Welcome to ABTC Bulgaria. You will receive a confirmation email shortly."
    });
  };
  const renderMembershipSelection = () => <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
    </div>;
  const renderRegistrationForm = () => <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setCurrentStep('membership')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Membership Selection
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Application Forum</h1>
          <p className="mt-2 text-gray-600">
            You selected: <span className="font-semibold text-primary">
              {selectedMembership === 'free' ? 'Free Member' : selectedMembership === 'supporter' ? 'Community Supporter' : 'Annual Premium'}
            </span>
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complete Your Registration</CardTitle>
          <CardDescription>
            To protect our members and maintain our exceptional community standards, we carefully review each application to guarantee an outstanding experience for everyone joining our exclusive network.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleInputChange} />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input id="password" name="password" type="password" required value={formData.password} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleInputChange} />
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <Label htmlFor="usEducation">U.S. Education Background</Label>
              <Input id="usEducation" name="usEducation" type="text" placeholder="e.g., MBA Harvard Business School, BS Computer Science MIT" value={formData.usEducation} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentRole">Current Role</Label>
                <Input id="currentRole" name="currentRole" type="text" placeholder="e.g., Software Engineer" value={formData.currentRole} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="company">Company/Organization</Label>
                <Input id="company" name="company" type="text" placeholder="e.g., Tech Company Inc." value={formData.company} onChange={handleInputChange} />
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <Label>Skills & Expertise</Label>
              <div className="mt-2">
                <SkillSelector skills={skills} onSkillsChange={setSkills} placeholder="Add your skills and areas of expertise..." />
              </div>
            </div>

            {/* Business Interests Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Business Interests & Goals</h3>
              
              <div>
                <Label htmlFor="businessInterest">Business Interest</Label>
                <RadioGroup value={formData.businessInterest} onValueChange={value => setFormData(prev => ({
                ...prev,
                businessInterest: value
              }))} className="mt-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expand-existing" id="expand-existing" />
                    <Label htmlFor="expand-existing">I have a company and want to expand</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="start-company" id="start-company" />
                    <Label htmlFor="start-company">I'm looking to start a company</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="join-company" id="join-company" />
                    <Label htmlFor="join-company">I'm looking to join an existing company</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other business interests</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="mt-4">
                <Label htmlFor="companyExpansionNeeds">
                  {formData.businessInterest === "expand-existing" && "What do you need to expand your company?"}
                  {formData.businessInterest === "start-company" && "What do you need to start your company?"}
                  {formData.businessInterest === "join-company" && "What type of company are you looking to join?"}
                  {(formData.businessInterest === "other" || !formData.businessInterest) && "Please describe your business interests and needs"}
                </Label>
                <Textarea id="companyExpansionNeeds" name="companyExpansionNeeds" rows={4} placeholder={formData.businessInterest === "expand-existing" ? "e.g., funding, partnerships, talent acquisition, market entry, technology solutions..." : formData.businessInterest === "start-company" ? "e.g., co-founders, funding, mentorship, business plan development, market research..." : formData.businessInterest === "join-company" ? "e.g., tech startup, consulting firm, fintech company, specific role preferences..." : "Tell us about your business goals, what you're looking for, or how you'd like to contribute..."} value={formData.companyExpansionNeeds} onChange={handleInputChange} />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Brief Bio</Label>
              <Textarea id="bio" name="bio" rows={4} placeholder="Tell us about yourself, your interests, and what you hope to gain from the ABTC Bulgaria community..." value={formData.bio} onChange={handleInputChange} />
            </div>


            {/* Terms and Conditions */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-start space-x-3">
                <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={handleCheckboxChange("agreeToTerms")} />
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
                <Checkbox id="newsletter" checked={formData.agreeToNewsletter} onCheckedChange={handleCheckboxChange("agreeToNewsletter")} />
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

            <Button type="submit" className="w-full">
              Submit Application
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
    </div>;
  return <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-1 bg-gray-50 py-12">
        {currentStep === 'membership' ? renderMembershipSelection() : renderRegistrationForm()}
      </div>
      
      <Footer />
    </div>;
};
export default Register;