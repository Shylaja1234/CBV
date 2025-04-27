import { motion } from "framer-motion";
import { History, Target, Users } from "lucide-react";

interface OurStoryProps {
  variant?: 'short' | 'full';
}

const OurStory = ({ variant = 'full' }: OurStoryProps) => {
  if (variant === 'short') {
    return (
      <section className="py-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-block rounded-full bg-accent/10 backdrop-blur-sm px-4 py-1.5 mb-4">
              <span className="text-xs font-medium text-accent-foreground">Our Story</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              A Decade of Digital Excellence
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Founded in 2013, ConnectingBee Ventures began with a vision to bridge the gap between cutting-edge IT infrastructure and Indian businesses. What started as a small team of passionate technology experts has grown into a comprehensive IT solutions provider trusted by over 500 companies nationwide.
            </p>
            <p className="text-muted-foreground text-lg">
              Our journey has been defined by continuous innovation, unwavering commitment to security, and a deep understanding of the evolving technology landscape. Today, we pride ourselves on delivering enterprise-grade IT infrastructure and cybersecurity solutions that enable businesses to thrive in the digital era.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block rounded-full bg-accent/10 backdrop-blur-sm px-4 py-1.5 mb-4">
            <span className="text-xs font-medium text-accent-foreground">Our Journey</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Three Decades of IT Excellence
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            With over 30 years of industry expertise, ConnectingBee Ventures was founded with a mission to simplify IT solutions for businesses. We recognize that navigating the ever-changing technology landscape can be challenging, and we are committed to providing the right solutions that align with business goals.
          </p>
          <p className="text-muted-foreground text-lg">
            Our approach is built on strong partnerships with leading OEMs and an in-house team of cybersecurity experts. From IT infrastructure to advanced security frameworks, we ensure businesses get cost-effective and future-ready solutions.
          </p>
          <p className="text-muted-foreground text-lg">
            At ConnectingBee, we believe that the right technology accelerates growth. By offering tailored IT services and strategic insights, we help organizations enhance security, efficiency, and long-term success in an evolving digital world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <History className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Our Foundation</h3>
            <p className="text-muted-foreground">
              ConnectingBee was founded with a clear mission: to ensure that organizations find the right IT solutions to address their unique challenges. We understand that an organization's growth depends on aligning processes and workflows with the right technological solutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Our Approach</h3>
            <p className="text-muted-foreground">
              We've established strategic partnerships with leading OEMs while building our in-house expertise. Our team includes highly talented ethical hackers who bring deep technical knowledge to every project. This dual approach ensures we deliver the most effective solutions at competitive prices.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Your Partner</h3>
            <p className="text-muted-foreground">
              As your knowledge partner, we understand that organizational growth requires navigating through various solutions. With our extensive experience, we help you identify and implement the quickest and most effective solutions to enhance both your internal and external security posture.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-lg text-muted-foreground">
            Join us in your continual journey towards achieving maximum security and efficiency. Let ConnectingBee be your trusted partner in navigating the ever-evolving IT landscape.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default OurStory; 