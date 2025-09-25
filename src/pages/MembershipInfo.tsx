import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MembershipInfo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-red-50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.03),transparent)]"></div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 drop-shadow-sm">
              Interested in Joining Our Community?
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Our membership is invitation-only. We're building an exclusive network of professionals bridging the U.S. and Bulgaria.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto">
                Get in touch with us to learn about membership opportunities and how you can be part of our growing community.
              </p>
            </div>

            {/* Contact Options */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Email */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border border-blue-200">
                <Mail className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Contact Us by Email</h3>
                <a 
                  href="mailto:asen.ivanov@a2balliance.com"
                  className="inline-block"
                >
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                </a>
              </div>

              {/* WhatsApp / Viber */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center border border-green-200">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-semibold text-slate-900 mb-3">WhatsApp / Viber</h3>
                <a 
                  href="https://wa.me/359877032223" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat Now
                  </Button>
                </a>
              </div>

              {/* Phone */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center border border-red-200">
                <Phone className="w-12 h-12 mx-auto mb-4 text-red-600" />
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Or call us directly</h3>
                <a 
                  href="tel:+359877032223"
                  className="inline-block"
                >
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <Phone className="mr-2 h-4 w-4" />
                    +359 877 032223
                  </Button>
                </a>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <Link to="/">
                <Button variant="outline" size="lg" className="border-slate-300 hover:border-blue-600 hover:text-blue-700">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MembershipInfo;