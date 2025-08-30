import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExpertsSection from "@/components/home/ExpertsSection";

const Experts = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ExpertsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Experts;