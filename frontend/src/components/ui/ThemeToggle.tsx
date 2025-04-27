
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className="relative flex h-9 w-9 items-center justify-center rounded-full"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <div className="relative h-5 w-5">
        {theme === "light" ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Sun className="h-5 w-5 text-amber-500 dark:text-amber-300" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: 180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
        )}
      </div>
    </Button>
  );
};

export default ThemeToggle;
