import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Network, Cloud, Shield, Server, Database, Cog } from "lucide-react";
import { setPageTitle } from "@/utils/title";

const services = [
  {
    icon: Network,
    title: "Network Solutions",
    description: "Enterprise-grade network infrastructure setup and maintenance.",
    details: [
      "Network design and implementation",
      "Network security and monitoring",
      "Wireless network solutions",
      "Network performance optimization",
      "24/7 network support"
    ]
  },
  {
    icon: Cloud,
    title: "Cloud Services",
    description: "Secure cloud migration, hosting, and management solutions.",
    details: [
      "Cloud migration strategy",
      "Multi-cloud management",
      "Cloud security implementation",
      "Cloud cost optimization",
      "Hybrid cloud solutions"
    ]
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Advanced threat protection, VAPT, and security consulting.",
    details: [
      "Vulnerability assessment",
      "Penetration testing",
      "Security audit and compliance",
      "Incident response planning",
      "Security awareness training"
    ]
  },
  {
    icon: Server,
    title: "IT Infrastructure",
    description: "Complete IT hardware and software infrastructure solutions.",
    details: [
      "Infrastructure assessment",
      "Hardware procurement",
      "Software licensing",
      "Infrastructure monitoring",
      "Preventive maintenance"
    ]
  },
  {
    icon: Database,
    title: "Data Management",
    description: "Data storage, backup solutions and disaster recovery planning.",
    details: [
      "Data backup strategies",
      "Disaster recovery planning",
      "Data compliance management",
      "Storage optimization",
      "Data security implementation"
    ]
  },
  {
    icon: Cog,
    title: "System Integration",
    description: "Seamless integration of various IT systems and applications.",
    details: [
      "API integration",
      "Legacy system modernization",
      "Cross-platform integration",
      "Workflow automation",
      "Custom integration solutions"
    ]
  }
];

const LearnMore = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageTitle("Learn More");
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <section className="py-16">
            <div className="container px-4 mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-3xl mx-auto mb-16"
              >
                <div className="inline-block rounded-full bg-accent/10 backdrop-blur-sm px-4 py-1.5 mb-4">
                  <span className="text-xs font-medium text-accent-foreground">Our Services</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Comprehensive IT Solutions
                </h1>
                <p className="text-lg text-muted-foreground">
                  Discover how our range of IT services can transform your business operations and enhance your security posture.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-card p-6 rounded-2xl"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <ul className="space-y-2 mb-6">
                      {service.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <ArrowRight className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/contact">Get Started</Link>
                    </Button>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-16 text-center"
              >
                <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold mb-4">
                    Ready to Transform Your Business?
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Contact us today to discuss how our IT solutions can help your organization thrive in the digital age.
                  </p>
                  <Button size="lg" className="rounded-full" asChild>
                    <Link to="/contact">Contact Our Team</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default LearnMore; 