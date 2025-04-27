import Card from "@/components/shared/Card";
import { motion } from "framer-motion";
import { Shield, Server, Cloud, Database, Lock, Settings, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Network Solutions",
    description: "Enterprise-grade network infrastructure setup and maintenance.",
    icon: Network,
    delay: 0
  },
  {
    title: "Cloud Services",
    description: "Secure cloud migration, hosting, and management solutions.",
    icon: Cloud,
    delay: 1
  },
  {
    title: "Cybersecurity",
    description: "Advanced threat protection, VAPT, and security consulting.",
    icon: Shield,
    delay: 2
  },
  {
    title: "IT Infrastructure",
    description: "Complete IT hardware and software infrastructure solutions.",
    icon: Server,
    delay: 3
  },
  {
    title: "Data Management",
    description: "Data storage, backup solutions and disaster recovery planning.",
    icon: Database,
    delay: 4
  },
  {
    title: "System Integration",
    description: "Seamless integration of various IT systems and applications.",
    icon: Settings,
    delay: 5
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-3xl"></div>
      </div>

      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-block rounded-full bg-accent/10 backdrop-blur-sm px-4 py-1.5 mb-4">
              <span className="text-xs font-medium text-accent-foreground">IT Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive IT Services & Cybersecurity
            </h2>
            <p className="text-muted-foreground text-pretty">
              Our range of IT infrastructure services and cybersecurity solutions are designed to protect, optimize and scale your business operations.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              background="subtle"
              delay={service.delay}
              className="flex flex-col h-full"
            >
              <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-primary">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground mb-4 flex-grow">{service.description}</p>
              <Button variant="ghost" size="sm" className="w-fit mt-auto" asChild>
                <Link to="/learn-more">Learn more</Link>
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-primary">
                <Lock className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Enterprise-Grade Security For Your Business
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our cybersecurity experts provide cutting-edge protection against modern threats with 24/7 monitoring and incident response.
              </p>
              <Button size="lg" className="rounded-full">Get Security Assessment</Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;
