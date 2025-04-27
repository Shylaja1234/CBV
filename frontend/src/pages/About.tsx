import { useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OurStory from "@/components/home/OurStory";
import { setPageTitle } from "@/utils/title";

const AboutPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageTitle("About");
  }, []);
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <OurStory />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default AboutPage;
