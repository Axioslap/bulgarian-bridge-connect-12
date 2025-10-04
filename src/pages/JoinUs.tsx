import { useEffect, useMemo, memo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Users, Briefcase, Network, Globe, TrendingUp } from "lucide-react";
import nycSkyline from "@/assets/nyc-skyline.jpg";
const JoinUs = memo(() => {
  useEffect(() => {
    document.title = "Join Us - American Business & Technology Club";

    // Preload background image
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = nycSkyline;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  const activities = useMemo(() => [{
    icon: Users,
    title: "Networking & Community",
    description: "Connect with business leaders, entrepreneurs, and innovators across the US-Bulgaria corridor. Build meaningful relationships that drive success."
  }, {
    icon: Briefcase,
    title: "Business Development",
    description: "Access exclusive opportunities for partnerships, investments, and market expansion. Accelerate your business growth through strategic collaborations."
  }, {
    icon: Network,
    title: "Technology Innovation",
    description: "Stay at the forefront of technological advancement. Share insights, best practices, and cutting-edge solutions with fellow tech leaders."
  }, {
    icon: Globe,
    title: "Cross-Border Trade",
    description: "Navigate international markets with confidence. Access resources, expertise, and connections that facilitate seamless cross-border operations."
  }, {
    icon: TrendingUp,
    title: "Professional Growth",
    description: "Enhance your skills and knowledge through exclusive events, workshops, and expert-led sessions designed for ambitious professionals."
  }, {
    icon: Mail,
    title: "Invitation-Only Membership",
    description: "Our exclusive community ensures quality connections. Reach out to learn about membership opportunities and join our network of excellence."
  }], []);
  return <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section with Background */}
          <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: `url(${nycSkyline})`
        }} />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-secondary/90" />
            
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Join the American Business & Technology Club
              </h1>
              <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-95">
                Connecting business leaders and technology innovators across the US-Bulgaria corridor
              </p>
              <a href="mailto:asen.ivanov@a2balliance.com">
                
              </a>
            </div>
          </section>

          {/* What We Do Section */}
          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">What We're Involved In</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  The American Business & Technology Club is a premier network dedicated to fostering 
                  cross-border collaboration, innovation, and growth between the United States and Bulgaria.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activities.map((activity, index) => {
              const Icon = activity.icon;
              return <div key={index} className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                      <Icon className="w-12 h-12 text-primary mb-4" />
                      <h3 className="text-xl font-bold mb-3">{activity.title}</h3>
                      <p className="text-muted-foreground">{activity.description}</p>
                    </div>;
            })}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our membership is invitation-only to ensure the highest quality network. 
                Contact us to learn more about joining the American Business & Technology Club.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:asen.ivanov@a2balliance.com">
                  <Button size="lg" className="text-lg px-8 py-6 text-slate-50 bg-gray-950 hover:bg-gray-800">
                    <Mail className="mr-2 h-5 w-5" />
                    Email Us: asen.ivanov@a2balliance.com
                  </Button>
                </a>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>;
});
JoinUs.displayName = 'JoinUs';
export default JoinUs;