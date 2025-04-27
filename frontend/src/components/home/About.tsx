import { motion } from "framer-motion";
import Card from "@/components/shared/Card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Building, Award, Network } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section id="about" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-1/3 left-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl"></div>
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
              <span className="text-xs font-medium text-accent-foreground">About Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Trusted IT Infrastructure Partner
            </h2>
            <p className="text-muted-foreground text-pretty">
              ConnectingBee is a leading provider of IT infrastructure solutions and cybersecurity services across India. We build secure, scalable, and efficient technology ecosystems for businesses.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl overflow-hidden relative aspect-[4/3]">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=2000&auto=format&fit=crop&q=80" 
                alt="ConnectingBee Team" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">Our Story</h3>
            <p className="text-muted-foreground mb-6">
              With over 30 years of industry expertise, ConnectingBee Ventures was founded with a mission to simplify IT solutions for businesses. We recognize that navigating the ever-changing technology landscape can be challenging, and we are committed to providing the right solutions that align with business goals.
            </p>
            <p className="text-muted-foreground mb-6">
              Our approach is built on strong partnerships with leading OEMs and an in-house team of cybersecurity experts. From IT infrastructure to advanced security frameworks, we ensure businesses get cost-effective and future-ready solutions.
            </p>
            <p className="text-muted-foreground mb-6">
              At ConnectingBee, we believe that the right technology accelerates growth. By offering tailored IT services and strategic insights, we help organizations enhance security, efficiency, and long-term success in an evolving digital world.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="mr-2 p-2 bg-accent/10 rounded-full">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <span className="font-medium">50+ IT Experts</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 p-2 bg-accent/10 rounded-full">
                  <Briefcase className="h-5 w-5 text-accent" />
                </div>
                <span className="font-medium">10+ Years Experience</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 p-2 bg-accent/10 rounded-full">
                  <Building className="h-5 w-5 text-accent" />
                </div>
                <span className="font-medium">Pan-India Presence</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold">Our Core Values</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card background="subtle" delay={0}>
              <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for excellence in every solution we deliver, setting high standards and continuously improving our services.
              </p>
            </Card>
            
            <Card background="subtle" delay={1}>
              <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent">
                <Network className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We embrace emerging technologies and innovative approaches to solve complex IT challenges for our clients.
              </p>
            </Card>
            
            <Card background="subtle" delay={2}>
              <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Partnership</h3>
              <p className="text-muted-foreground">
                We build lasting relationships with our clients, understanding their needs and growing alongside them.
              </p>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Transform Your IT Infrastructure?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Partner with ConnectingBee for comprehensive IT solutions tailored to your business needs.
              </p>
              <Link to="/contact">
                <Button size="lg" className="rounded-full">Contact Our Team</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
