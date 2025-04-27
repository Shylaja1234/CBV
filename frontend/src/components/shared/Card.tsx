
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  background?: "solid" | "glass" | "subtle";
  hoverEffect?: boolean;
  delay?: number;
}

const Card = ({ 
  className = "", 
  children, 
  background = "solid",
  hoverEffect = true,
  delay = 0
}: CardProps) => {
  const getBackground = () => {
    switch (background) {
      case "glass":
        return "glass-card";
      case "subtle":
        return "bg-muted/50 dark:bg-muted/30 backdrop-blur-sm border border-border/50";
      case "solid":
      default:
        return "bg-card border border-border";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: delay * 0.1
      }}
      viewport={{ once: true }}
      className={cn(
        "rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm",
        getBackground(),
        hoverEffect && "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Card;
