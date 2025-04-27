import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Home,
  Tag,
  LogOut,
  X,
  LayoutGrid
} from "lucide-react";

interface StaffSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const StaffSidebar = ({ isOpen, onClose }: StaffSidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const menuItems = [
    { path: "/staff/dashboard", label: "Dashboard", icon: <LayoutGrid className="mr-2 h-5 w-5" /> },
    { path: "/staff/products", label: "Products", icon: <ShoppingBag className="mr-2 h-5 w-5" /> },
    { path: "/staff/pricing", label: "Pricing", icon: <Tag className="mr-2 h-5 w-5" /> },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-[65px] left-0 z-50 h-[calc(100vh-65px)] w-64 bg-card border-r transition-transform duration-300 transform
        md:top-0 md:h-screen md:relative md:translate-x-0 md:z-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-4 border-b hidden md:flex items-center">
          <Link to="/staff/dashboard" className="font-bold text-xl flex items-center">
            <LayoutGrid className="mr-2 h-6 w-6" />
            Staff Panel
          </Link>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            {user && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs mt-1 text-muted-foreground">Role: Staff</p>
              </div>
            )}
          </div>
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive(item.path) 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"}
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            
            <div className="pt-6 mt-6 border-t">
              <Link to="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">
                <Home className="mr-2 h-5 w-5" />
                Back to Site
              </Link>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start mt-2 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default StaffSidebar;
