import { useTheme } from "@/context/ThemeContext";
import { Link } from "react-router-dom";

type LogoProps = {
  className?: string;
};

const Logo = ({ className = "" }: LogoProps) => {
  const { theme } = useTheme();
  
  return (
    <Link 
      to="/" 
      className={`block transition-opacity duration-300 hover:opacity-80 ${className}`}
    >
      <div className="flex items-center">
        <img 
          src="/logo-connectingbee.png" 
          alt="ConnectingBee Logo" 
          className="h-12 w-auto object-contain mr-2"
        />
        <span className="font-semibold text-xl">ConnectingBee</span>
      </div>
    </Link>
  );
};

export default Logo;
