
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedTextProps = {
  text: string;
  className?: string;
  once?: boolean;
  delay?: number;
  duration?: number;
  tag?: keyof JSX.IntrinsicElements;
};

const AnimatedText = ({ 
  text, 
  className = "", 
  once = true, 
  delay = 0,
  duration = 0.05,
  tag: Tag = "div"
}: AnimatedTextProps) => {
  const words = text.split(" ");
  
  // Animation settings
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: duration, delayChildren: delay * i }
    }),
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  
  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  };

  return (
    <Tag className={cn("inline-block", className)}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once }}
        className="inline-block"
      >
        {words.map((word, index) => (
          <span key={index} className="inline-block whitespace-nowrap">
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={charIndex}
                variants={child}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
            <span className="inline-block">&nbsp;</span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
};

export default AnimatedText;
