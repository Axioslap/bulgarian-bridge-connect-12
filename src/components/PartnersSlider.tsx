import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import LazyImage from "@/components/common/LazyImage";
import { useMemo } from "react";
const PartnersSlider = () => {
  // Memoize partners data to prevent unnecessary re-renders
  const partners = useMemo(() => [{
    id: 1,
    name: "TechCorp",
    logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
    description: "Leading technology solutions provider"
  }, {
    id: 2,
    name: "Innovation Labs",
    logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
    description: "Cutting-edge research and development"
  }, {
    id: 3,
    name: "Global Ventures",
    logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
    description: "International business expansion"
  }, {
    id: 4,
    name: "StartupHub",
    logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
    description: "Entrepreneurship and innovation support"
  }, {
    id: 5,
    name: "FinTech Solutions",
    logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
    description: "Financial technology innovations"
  }, {
    id: 6,
    name: "Digital Partners",
    logo: "/lovable-uploads/d1cb6ba8-a5b8-4971-a54d-ffa39ade484f.png",
    description: "Digital transformation experts"
  }], []);
  return (
    <section className="py-20 sm:py-32 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Premium dark effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.12),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent leading-tight">
            Our Partners
          </h2>
          <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Collaborating with leading organizations to drive innovation
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {partners.map((partner) => (
              <CarouselItem key={partner.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <LazyImage
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="w-16 h-16 object-contain mb-4 grayscale hover:grayscale-0 transition-all duration-300"
                    />
                    <h3 className="font-semibold text-slate-900 text-center mb-2">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-slate-600 text-center">
                      {partner.description}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-blue-600 text-white hover:bg-blue-700 border-blue-500" />
          <CarouselNext className="bg-blue-600 text-white hover:bg-blue-700 border-blue-500" />
        </Carousel>
      </div>
    </section>
  );
};
export default PartnersSlider;