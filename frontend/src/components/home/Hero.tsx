
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AnimatedText from "@/components/shared/AnimatedText";
import { ArrowRight, ShieldCheck, Server, Cloud } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl"></div>
      </div>

      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Hero Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <div className="inline-block rounded-full bg-muted/50 backdrop-blur-sm px-4 py-1.5 mb-6">
              <span className="text-xs font-medium text-muted-foreground">
                Trusted by 500+ businesses across India
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              <AnimatedText 
                text="IT Infrastructure & Cybersecurity Excellence" 
                tag="span"
                className="text-foreground block"
              />
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              ConnectingBee delivers premium IT infrastructure solutions and cybersecurity services to protect and empower your business in the digital era.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full" asChild>
                <Link to="/services">
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link to="/products">
                  View Products
                </Link>
              </Button>
            </div>
            
            {/* Stats/Features */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              <div className="flex flex-col items-center text-center">
                <div className="bg-muted/50 backdrop-blur-sm rounded-full p-2 mb-2">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-sm font-medium">Security</h3>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-muted/50 backdrop-blur-sm rounded-full p-2 mb-2">
                  <Server className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-sm font-medium">Infrastructure</h3>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-muted/50 backdrop-blur-sm rounded-full p-2 mb-2">
                  <Cloud className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-sm font-medium">Cloud</h3>
              </div>
            </div>
          </motion.div>
          
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted/20 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-muted/50 to-transparent" />
                <img 
                  src="https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="IT Infrastructure" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute -bottom-6 -left-6 glass-card rounded-xl p-4 shadow-lg max-w-[200px]"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-accent-foreground"></div>
                  <span className="text-xs font-medium">Security Score</span>
                </div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-xs text-muted-foreground mt-1">Uptime guarantee</div>
              </motion.div>
              
              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="absolute -top-6 -right-6 glass-card rounded-xl p-4 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="h-6 w-6 flex items-center justify-center rounded-full bg-accent text-white">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.4 3.60005L4.8 10.2L0.6 6.00005L1.302 5.29805L4.8 8.79605L10.698 2.89805L11.4 3.60005Z" fill="currentColor"/>
                    </svg>
                  </span>
                  <span className="text-sm font-medium">ISO 27001 Certified</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
