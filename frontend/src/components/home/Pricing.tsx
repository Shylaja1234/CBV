import { Button } from "@/components/ui/button";
import Card from "@/components/shared/Card";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Basic",
    price: "₹24,999",
    billing: "per month",
    description: "Essential IT infrastructure support for small businesses.",
    features: [
      "Network setup and maintenance",
      "Basic security assessment",
      "8/5 helpdesk support",
      "Monthly system updates",
      "Email security",
    ],
    highlight: false,
    delay: 0
  },
  {
    name: "Business",
    price: "₹49,999",
    billing: "per month",
    description: "Comprehensive IT services for medium-sized businesses.",
    features: [
      "Advanced network infrastructure",
      "Quarterly security audits",
      "16/5 technical support",
      "Cloud migration assistance",
      "Data backup & recovery",
      "Security incident response",
      "Employee security training"
    ],
    highlight: true,
    delay: 1
  },
  {
    name: "Enterprise",
    price: "₹89,999",
    billing: "per month",
    description: "Full-scale IT infrastructure and security for large organizations.",
    features: [
      "Custom network architecture",
      "Monthly security assessments",
      "24/7 premium support",
      "Dedicated account manager",
      "Advanced threat protection",
      "Disaster recovery planning",
      "Hardware procurement",
      "Compliance management"
    ],
    highlight: false,
    delay: 2
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl"></div>
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
              <span className="text-xs font-medium text-accent-foreground">Pricing Plans</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transparent Pricing for Your IT Needs
            </h2>
            <p className="text-muted-foreground text-pretty">
              Choose from our range of service packages designed to meet the specific IT infrastructure and security requirements of businesses of all sizes.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              background={plan.highlight ? "glass" : "solid"}
              className={`flex flex-col h-full ${plan.highlight ? 'ring-2 ring-accent' : ''}`}
              delay={plan.delay}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">{plan.billing}</span>
                </div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-6 flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-2 mt-1 flex-shrink-0">
                        <Check className="h-4 w-4 text-accent" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link to="/contact">
                  <Button 
                    className={`w-full font-semibold ${
                      plan.highlight 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                        : 'bg-accent hover:bg-accent/90 text-accent-foreground'
                    }`}
                    size="lg"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
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
            <div className="bg-muted/30 backdrop-blur-sm border border-border/50 p-8 rounded-2xl max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">
                Need a Custom Solution?
              </h3>
              <p className="text-muted-foreground mb-6">
                We offer tailored IT infrastructure and security packages designed specifically for your business requirements.
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Contact Our Sales Team
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
