import { useState, useEffect, memo } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import StaffSidebar from "./StaffSidebar";
import { Button } from "@/components/ui/button";
import { Menu, Globe, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface StaffLayoutProps {
  children: React.ReactNode;
}

const StaffLayout = ({ children }: StaffLayoutProps) => {
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Auto-close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  // Only allow staff and admins
  if (!isAuthenticated || (user && user.role !== "STAFF" && user.role !== "ADMIN")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile header */}
      <div className="bg-background border-b p-4 flex justify-between items-center md:hidden">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          asChild
        >
          <a href="/" target="_blank" title="View Website">
            <Globe className="h-5 w-5" />
          </a>
        </Button>
      </div>
      
      {/* Sidebar */}
      <StaffSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 md:p-6 xl:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default memo(StaffLayout);
