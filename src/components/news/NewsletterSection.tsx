
import { Button } from "@/components/ui/button";

const NewsletterSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50/50 to-red-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Get the latest business and tech news delivered to your inbox weekly.
        </p>
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 shadow-lg text-white">
          Subscribe to Newsletter
        </Button>
      </div>
    </section>
  );
};

export default NewsletterSection;
