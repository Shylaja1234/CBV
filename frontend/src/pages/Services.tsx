import { useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Shield, Server, ArrowRight, Database, Cloud, Network, Laptop, FileText, Lock, UserCheck } from "lucide-react";
import Card from "@/components/shared/Card";
import { Link } from "react-router-dom";
import { setPageTitle } from "@/utils/title";

const itInfrastructureServices = [
  {
    icon: Database,
    title: "Datacenter / Cloud Products",
    description: "Servers, Switches, Firewalls and other products and services that can support the IT infrastructure at an organization."
  },
  {
    icon: Laptop,
    title: "User Devices",
    description: "Laptops, iPhone and mobility devices that enables a user to deliver effectively."
  },
  {
    icon: Server,
    title: "Solutions",
    description: "Every requirement has a solution identified by a OEM. Let's get to call. We can identify the product for you."
  },
  {
    icon: Network,
    title: "Infrastructure Operations",
    description: "We have value added well experienced partners who can work on migrations to App modernization."
  }
];

const cyberSecurityServices = [
  {
    icon: Shield,
    title: "Vulnerability Analysis and Pen Test",
    description: "Our inhouse team can effectively find hidden vulnerabilities and security threats at your applications, hardware and Portals."
  },
  {
    icon: Cloud,
    title: "OSINT Scan (Darknet & Internet)",
    description: "OSINT scan is a Tool and manual effort driven exercise to understand how much of the critical data of an organization is already leaked in darknet or internet. We assist bring down or mitigate the issues as well."
  },
  {
    icon: Lock,
    title: "Products to ensure security",
    description: "We have a collection of solutions such as Zero Trust Access, DLP, WAF. We will be able to understand your requirements over a conversation and later point to a apt solution for the specific requirements."
  },
  {
    icon: UserCheck,
    title: "Audits, vCISO and Advisory",
    description: "Are you looking for a cyber security leader or a partner to come onboard to help with your point tasks on audits of cyber security strategy. We can be of help to you."
  }
];

const ServicesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageTitle("Services");
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
                  <span className="text-xs font-medium text-accent-foreground">Our Expertise</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Comprehensive IT & Cybersecurity Services
                </h1>
                <p className="text-lg text-muted-foreground">
                  ConnectingBee delivers premium IT infrastructure solutions and cybersecurity services tailored to protect and empower your business in the digital era.
                </p>
              </motion.div>

              <Tabs defaultValue="infrastructure" className="max-w-5xl mx-auto">
                <TabsList className="grid w-full grid-cols-2 mb-12">
                  <TabsTrigger value="infrastructure" className="text-lg py-3">
                    <Server className="mr-2 h-5 w-5 text-foreground" />
                    IT Infrastructure
                  </TabsTrigger>
                  <TabsTrigger value="security" className="text-lg py-3">
                    <Shield className="mr-2 h-5 w-5 text-foreground" />
                    Cyber Security
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="infrastructure" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {itInfrastructureServices.map((service, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <Card background="subtle" className="h-full">
                          <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-primary">
                            <service.icon className="h-6 w-6" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                          <p className="text-muted-foreground mb-4">{service.description}</p>
                          <Button variant="ghost" size="sm" className="w-fit mt-auto" asChild>
                            <Link to="/contact">Learn more</Link>
                          </Button>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-12 text-center">
                    <Button size="lg" className="rounded-full" asChild>
                      <Link to="/products">
                        Browse Infrastructure Products
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cyberSecurityServices.map((service, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <Card background="subtle" className="h-full">
                          <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-primary">
                            <service.icon className="h-6 w-6" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                          <p className="text-muted-foreground mb-4">{service.description}</p>
                          <Button variant="ghost" size="sm" className="w-fit mt-auto" asChild>
                            <Link to="/contact">Learn more</Link>
                          </Button>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-12 text-center">
                    <Button size="lg" className="rounded-full" asChild>
                      <Link to="/products">
                        Explore Security Products
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="mt-24 glass-card p-8 rounded-2xl max-w-4xl mx-auto"
              >
                <div className="text-center mb-6">
                  <FileText className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Need a custom solution?</h3>
                  <p className="text-muted-foreground">
                    Our team of experts will work with you to understand your unique requirements and provide tailored solutions.
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button size="lg" className="rounded-full" asChild>
                    <Link to="/contact">
                      Contact Our Team
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
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

export default ServicesPage;
