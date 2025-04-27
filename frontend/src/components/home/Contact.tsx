import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { PhoneCall, Mail, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl"></div>
      </div>

      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-block rounded-full bg-accent/10 backdrop-blur-sm px-4 py-1.5 mb-4">
              <span className="text-xs font-medium text-accent-foreground">Get in Touch</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Elevate Your IT Infrastructure?
            </h2>
            <p className="text-muted-foreground mb-8 text-pretty">
              Contact our team of IT experts to discuss your specific requirements. We're here to help you build a secure, scalable, and efficient technology ecosystem.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mr-4 p-3 rounded-full bg-accent/10 text-accent flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Our Location</h3>
                  <p className="text-muted-foreground">
                    Plot No. 225B, Shop No. 13. Paramount House<br />
                    Panvel, Navi Mumbai, Maharashtra 410206<br />
                    India
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 p-3 rounded-full bg-accent/10 text-accent flex-shrink-0">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Call Us</h3>
                  <p className="text-muted-foreground">
                    <a href="tel:+918779380760" className="hover:text-foreground transition-colors">
                      +91 877 938 0760
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 p-3 rounded-full bg-accent/10 text-accent flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Email Us</h3>
                  <p className="text-muted-foreground">
                    <a href="mailto:contact@connectingbee.in" className="hover:text-foreground transition-colors">
                      contact@connectingbee.in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 shadow-lg"
            id="contact-form"
          >
            <h3 className="text-xl font-semibold mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="glass-input"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="glass-input"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="glass-input"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="glass-input"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
