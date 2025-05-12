import { useEffect } from "react";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Services from "@/components/home/Services";
import Contact from "@/components/home/Contact";
import { setPageTitle } from "@/utils/title";

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageTitle("Home");
  }, []);
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-grow">
          <Hero />
          <section id="about">
            <About />
          </section>
          <section id="services">
            <Services />
          </section>
          <section id="contact">
            <Contact />
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
