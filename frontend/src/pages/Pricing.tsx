import { useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Pricing from "@/components/home/Pricing";
import { setPageTitle } from "@/utils/title";

const PricingPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageTitle("Pricing");
  }, []);
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <Pricing />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default PricingPage;
