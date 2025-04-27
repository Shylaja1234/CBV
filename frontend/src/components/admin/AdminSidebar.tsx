import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  FolderTree,
  Image,
  MessageSquare,
  PanelLeftOpen,
  Globe,
  LogOut,
  X,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="mr-2 h-5 w-5" /> },
    { path: "/admin/users", label: "Users", icon: <Users className="mr-2 h-5 w-5" /> },
    { path: "/admin/staff", label: "Staff", icon: <UserCog className="mr-2 h-5 w-5" /> },
  ];

  const contentItems = [
    { path: "/admin/content", label: "Pages", icon: <PanelLeftOpen className="mr-2 h-5 w-5" /> },
    { path: "/admin/media", label: "Media Library", icon: <Image className="mr-2 h-5 w-5" /> },
  ];

  const blogItems = [
    { path: "/admin/blog/posts", label: "Blog Posts", icon: <FileText className="mr-2 h-5 w-5" /> },
    { path: "/admin/blog/categories", label: "Categories", icon: <FolderTree className="mr-2 h-5 w-5" /> },
  ];

  const communicationItems = [
    { path: "/admin/messages", label: "Messages", icon: <MessageSquare className="mr-2 h-5 w-5" /> },
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
        fixed top-0 left-0 z-50 h-full w-64 bg-card border-r transition-transform duration-300 transform overflow-y-auto no-scrollbar
        md:relative md:translate-x-0 md:z-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-4 border-b flex justify-between items-center">
          <Link to="/admin/dashboard" className="font-bold text-xl flex items-center">
            <LayoutDashboard className="mr-2 h-6 w-6" />
            Admin Panel
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            {user && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs mt-1 text-muted-foreground">Role: Admin</p>
              </div>
            )}
          </div>
          
          <nav className="space-y-1">
            {/* Main Menu */}
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && onClose()}
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
            
            {/* Content Management */}
            <div className="pt-4 mt-4 border-t">
              <p className="text-xs uppercase font-medium text-muted-foreground mb-2 px-3">Content</p>
              {contentItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && onClose()}
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
            </div>

            {/* Blog Management */}
            <div className="pt-4 mt-4 border-t">
              <p className="text-xs uppercase font-medium text-muted-foreground mb-2 px-3">Blog</p>
              {blogItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && onClose()}
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
            </div>

            {/* Communication */}
            <div className="pt-4 mt-4 border-t">
              <p className="text-xs uppercase font-medium text-muted-foreground mb-2 px-3">Communication</p>
              {communicationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && onClose()}
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
            </div>
            
            {/* Footer Actions */}
            <div className="pt-6 mt-6 border-t">
              <Link 
                to="/" 
                target="_blank"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10"
              >
                <Globe className="mr-2 h-5 w-5" />
                View Website
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

export default AdminSidebar;
