
const NewsHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-hover">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
        }}
      ></div>
      <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center text-primary-foreground">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Business & Tech News
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-90">
            Stay informed with the latest developments in business and technology affecting 
            the U.S.-Bulgaria corridor and our global community.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsHero;
