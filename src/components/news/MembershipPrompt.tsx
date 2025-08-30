
import { Button } from "@/components/ui/button";
import { Lock, Star } from "lucide-react";
import { Link } from "react-router-dom";

const MembershipPrompt = () => {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-6 text-center">
      <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">Member-Exclusive Content</h3>
      <p className="text-gray-600 mb-6">
        Join ABTC Bulgaria to access our full collection of business and tech news, insights, and analysis.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/register">
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            Become a Member
          </Button>
        </Link>
        <Link to="/register">
          <Button variant="outline">
            Support Our Community
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MembershipPrompt;
