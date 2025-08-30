
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Heart, Clock, Users, Globe, GraduationCap, HandHeart, UserCheck, BookOpen } from "lucide-react";

const CommunityImpactTab = () => {
  // Mock user donation balance and volunteer hours
  const userBalance = 150.75;
  const volunteerHours = 24; // Total hours volunteered as mentor
  
  // Mock charitable initiatives
  const charities = [
    {
      id: 1,
      name: "Bulgarian Students in USA Scholarship Fund",
      description: "Supporting Bulgarian students pursuing higher education in American universities",
      category: "Education",
      goal: 10000,
      raised: 7500,
      icon: GraduationCap,
      needsVolunteers: true,
      timeCommitment: "2-4 hours/week"
    },
    {
      id: 2,
      name: "Tech Mentorship Program",
      description: "Connecting experienced professionals with young Bulgarian entrepreneurs",
      category: "Mentorship",
      goal: 5000,
      raised: 3200,
      icon: Users,
      needsVolunteers: true,
      timeCommitment: "1-2 hours/week"
    },
    {
      id: 3,
      name: "Bulgarian Cultural Center Support",
      description: "Maintaining and expanding Bulgarian cultural centers across the US",
      category: "Culture",
      goal: 15000,
      raised: 12000,
      icon: Globe,
      needsVolunteers: false,
      timeCommitment: null
    },
    {
      id: 4,
      name: "Emergency Relief Fund",
      description: "Providing immediate assistance to Bulgarian families in crisis",
      category: "Emergency Aid",
      goal: 8000,
      raised: 4500,
      icon: HandHeart,
      needsVolunteers: true,
      timeCommitment: "As needed"
    }
  ];

  // Mock expertise donation opportunities
  const expertiseOpportunities = [
    {
      id: 1,
      title: "Business Strategy Consulting",
      description: "Help Bulgarian startups develop their business strategies",
      skillsNeeded: ["Business Strategy", "Marketing", "Finance"],
      timeCommitment: "2-3 hours/month",
      icon: BookOpen
    },
    {
      id: 2,
      title: "Tech Mentorship",
      description: "Mentor young Bulgarian developers and engineers",
      skillsNeeded: ["Software Development", "Engineering", "Product Management"],
      timeCommitment: "1-2 hours/week",
      icon: Users
    },
    {
      id: 3,
      title: "Career Guidance",
      description: "Provide career advice to Bulgarian professionals in the US",
      skillsNeeded: ["HR", "Career Counseling", "Leadership"],
      timeCommitment: "1 hour/week",
      icon: UserCheck
    }
  ];

  const handleDonate = (charityId: number, amount?: number) => {
    console.log(`Donating ${amount || 'time'} to charity ${charityId}`);
    // Here you would implement the donation logic
  };

  const handleExpertiseDonation = (opportunityId: number) => {
    console.log(`Volunteering expertise for opportunity ${opportunityId}`);
    // Here you would implement the expertise donation logic
  };

  const handleAddFunds = () => {
    console.log("Adding funds to donation balance");
    // Here you would implement the add funds logic
  };

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* User Impact Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Donation Balance Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm sm:text-base">
              <DollarSign className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              Your Donation Balance
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Funds available for charitable donations
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600">${userBalance.toFixed(2)}</div>
                <p className="text-xs sm:text-sm text-gray-500">Available to donate</p>
              </div>
              <Button onClick={handleAddFunds} size="sm" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                Add Funds
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Hours Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm sm:text-base">
              <Clock className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Your Volunteer Time
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Time donated as a mentor
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{volunteerHours} hours</div>
              <p className="text-xs sm:text-sm text-gray-500">Total time volunteered</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expertise Donation Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm sm:text-base">
            <UserCheck className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
            Donate Your Expertise
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Share your knowledge and skills with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expertiseOpportunities.map((opportunity) => {
              const IconComponent = opportunity.icon;
              
              return (
                <div key={opportunity.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-lg truncate">{opportunity.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">{opportunity.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {opportunity.skillsNeeded.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">Time: {opportunity.timeCommitment}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleExpertiseDonation(opportunity.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm"
                      >
                        <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Volunteer Expertise
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charitable Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm sm:text-base">
            <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            Charitable Initiatives
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Support causes that matter to our community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {charities.map((charity) => {
              const IconComponent = charity.icon;
              const progressPercentage = (charity.raised / charity.goal) * 100;
              
              return (
                <div key={charity.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-lg pr-2">{charity.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">{charity.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {charity.category}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span>Progress</span>
                        <span className="text-xs">${charity.raised.toLocaleString()} / ${charity.goal.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {progressPercentage.toFixed(1)}% of goal reached
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleDonate(charity.id, 25)}
                          className="bg-green-600 hover:bg-green-700 text-xs flex-1 sm:flex-none"
                        >
                          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          $25
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDonate(charity.id, 50)}
                          className="text-xs flex-1 sm:flex-none"
                        >
                          $50
                        </Button>
                      </div>
                      
                      {charity.needsVolunteers && (
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => handleDonate(charity.id)}
                            className="text-xs w-full sm:w-auto"
                          >
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            Volunteer
                          </Button>
                          <span className="text-xs text-gray-500 text-center sm:text-left">{charity.timeCommitment}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityImpactTab;
