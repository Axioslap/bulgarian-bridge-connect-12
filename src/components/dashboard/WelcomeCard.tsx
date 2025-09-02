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
const WelcomeCard = ({
  userProfile
}: WelcomeCardProps) => {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };
  return <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
      
      
    </Card>;
};
export default WelcomeCard;