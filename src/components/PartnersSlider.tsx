import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
const PartnersSlider = () => {
  const partners = [{
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
  }];
  return (
    <section className="py-16 bg-gradient-to-r from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Our Partners
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Trusted organizations that support our community's growth and success
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
                    <img
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
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
export default PartnersSlider;