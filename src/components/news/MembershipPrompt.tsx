
import { Button } from "@/components/ui/button";
import { Lock, Mail, Phone } from "lucide-react";

const MembershipPrompt = () => {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-6 text-center">
      <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">Member-Exclusive Content</h3>
      <p className="text-gray-600 mb-6">
        Our membership is invitation-only. Get in touch with us to learn about membership opportunities.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="mailto:asen.ivanov@a2balliance.com">
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            <Mail className="mr-2 h-4 w-4" />
            Contact Us by Email
          </Button>
        </a>
        <a href="https://wa.me/359877032223" target="_blank" rel="noopener noreferrer">
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" />
            WhatsApp / Viber
          </Button>
        </a>
      </div>
    </div>
  );
};

export default MembershipPrompt;
