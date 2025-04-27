
import { memo } from "react";
import { motion } from "framer-motion";
import Card from "@/components/shared/Card";

const testimonials = [
  {
    quote: "ConnectingBee transformed our IT infrastructure completely. Their security solutions have protected us from several potential threats.",
    author: "Rajiv Mehta",
    position: "CTO, TechSolutions India",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW5kaWFuJTIwbWFufGVufDB8fDB8fHww",
    delay: 0
  },
  {
    quote: "Their team's expertise in cloud migration saved us countless hours and resources. The ongoing support has been exceptional.",
    author: "Priya Sharma",
    position: "IT Director, GrowthFinance",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW5kaWFuJTIwd29tYW58ZW58MHx8MHx8fDA%3D",
    delay: 1
  },
  {
    quote: "We've been working with ConnectingBee for over 3 years now. Their 24/7 support and proactive approach to IT management is unmatched.",
    author: "Vikram Singh",
    position: "CEO, InnovateNow",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGluZGlhbiUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D",
    delay: 2
  }
];

// Extracted TestimonialCard component for better performance
const TestimonialCard = memo(({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <Card
      background="glass"
      delay={testimonial.delay}
      className="flex flex-col h-full"
    >
      <div className="mb-6">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent">
          <path d="M9.33333 21.3333C8.27547 21.3333 7.33333 20.9119 6.5 20.069C5.66667 19.2262 5.25 18.2833 5.25 17.2405C5.25 16.7286 5.34722 16.2262 5.54167 15.7333C5.73611 15.2405 6.01389 14.7976 6.375 14.4048C6.18056 14.019 6.03472 13.6143 5.9375 13.1905C5.84028 12.7667 5.79167 12.3429 5.79167 11.919C5.79167 11.019 5.98611 10.1572 6.375 9.33333C6.76389 8.50952 7.30556 7.79762 8 7.19762C8.61111 7.71429 9.11806 8.2881 9.52083 8.91905C9.92361 9.55 10.125 10.2 10.125 10.8595C10.125 11.3714 10.0278 11.8786 9.83333 12.381C9.63889 12.8833 9.36111 13.3262 9 13.7095C9.19444 14.0857 9.34028 14.4857 9.4375 14.9095C9.53472 15.3333 9.58333 15.7571 9.58333 16.181C9.58333 17.081 9.38889 17.9381 9 18.7524C8.61111 19.5667 8.06944 20.2786 7.375 20.8881C7.84028 21.1857 8.36111 21.3333 8.9375 21.3333H9.33333ZM20.8333 21.3333C19.7755 21.3333 18.8333 20.9119 18 20.069C17.1667 19.2262 16.75 18.2833 16.75 17.2405C16.75 16.7286 16.8472 16.2262 17.0417 15.7333C17.2361 15.2405 17.5139 14.7976 17.875 14.4048C17.6806 14.019 17.5347 13.6143 17.4375 13.1905C17.3403 12.7667 17.2917 12.3429 17.2917 11.919C17.2917 11.019 17.4861 10.1572 17.875 9.33333C18.2639 8.50952 18.8056 7.79762 19.5 7.19762C20.1111 7.71429 20.6181 8.2881 21.0208 8.91905C21.4236 9.55 21.625 10.2 21.625 10.8595C21.625 11.3714 21.5278 11.8786 21.3333 12.381C21.1389 12.8833 20.8611 13.3262 20.5 13.7095C20.6944 14.0857 20.8403 14.4857 20.9375 14.9095C21.0347 15.3333 21.0833 15.7571 21.0833 16.181C21.0833 17.081 20.8889 17.9381 20.5 18.7524C20.1111 19.5667 19.5694 20.2786 18.875 20.8881C19.3403 21.1857 19.8611 21.3333 20.4375 21.3333H20.8333Z" fill="currentColor"/>
        </svg>
      </div>
      
      <p className="text-muted-foreground mb-6 flex-grow italic text-pretty">
        "{testimonial.quote}"
      </p>
      
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-full overflow-hidden mr-4 border border-border">
          <img 
            src={testimonial.image}
            alt={testimonial.author}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <h4 className="font-medium">{testimonial.author}</h4>
          <p className="text-sm text-muted-foreground">{testimonial.position}</p>
        </div>
      </div>
    </Card>
  );
});

// Extracted StatItem component for better performance
const StatItem = memo(({ value, label, delay }: { value: string, label: string, delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="flex flex-col items-center"
    >
      <span className="text-4xl font-bold mb-2">{value}</span>
      <span className="text-muted-foreground text-sm">{label}</span>
    </motion.div>
  );
});

const Testimonials = () => {
  return (
    <section className="py-20 relative">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-block rounded-full bg-accent/10 backdrop-blur-sm px-4 py-1.5 mb-4">
              <span className="text-xs font-medium text-accent-foreground">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground text-pretty">
              We take pride in delivering exceptional IT infrastructure and security services that earn the trust and satisfaction of our valued clients.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
          <StatItem value="500+" label="Happy Clients" delay={0.1} />
          <StatItem value="99.9%" label="Uptime" delay={0.2} />
          <StatItem value="24/7" label="Support" delay={0.3} />
          <StatItem value="10+" label="Years Experience" delay={0.4} />
        </div>
      </div>
    </section>
  );
};

export default memo(Testimonials);
