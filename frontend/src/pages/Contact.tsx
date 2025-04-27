import { useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Contact from "@/components/home/Contact";
import LocationMap from "@/components/contact/LocationMap";
import { useLocation } from "react-router-dom";
import { setPageTitle } from "@/utils/title";

const ContactPage = () => {
  const location = useLocation();

  useEffect(() => {
    // First scroll to top
    window.scrollTo(0, 0);
    setPageTitle("Contact");
    
    // Then check if we need to scroll to the form section
    const timer = setTimeout(() => {
      const formSection = document.getElementById("contact-form");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Small delay to ensure content is loaded

    return () => clearTimeout(timer);
  }, [location]);
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <div className="container px-4 mx-auto mb-16">
            <LocationMap />
          </div>
          <Contact />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ContactPage;
