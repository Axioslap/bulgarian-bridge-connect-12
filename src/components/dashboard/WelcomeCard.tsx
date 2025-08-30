
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SkillTag from "@/components/SkillTag";

interface WelcomeCardProps {
  userProfile: {
    name: string;
    usEducation: string;
    skills: string[];
    role: string;
  };
}

const WelcomeCard = ({ userProfile }: WelcomeCardProps) => {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
      <CardHeader>
        <CardTitle className="text-xl">
          {getGreeting()}, {userProfile.name}! 👋
        </CardTitle>
        <CardDescription>
          Welcome to your ABTC Bulgaria community dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-sm mb-1 text-gray-700">Member Status</h3>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
              {userProfile.role}
            </Badge>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-1 text-gray-700">Education</h3>
            <p className="text-sm text-gray-600">{userProfile.usEducation}</p>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-sm mb-2 text-gray-700">Your Expertise</h3>
          <div className="flex flex-wrap gap-1">
            {userProfile.skills.slice(0, 3).map((skill, index) => (
              <SkillTag key={index} skill={skill} variant="outline" />
            ))}
            {userProfile.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{userProfile.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
