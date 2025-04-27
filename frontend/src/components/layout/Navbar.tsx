import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ShoppingCart, Heart, User, Cog, LayoutDashboard, ShoppingBag, Globe, LogOut } from "lucide-react";
import Logo from "@/components/shared/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import MobileSidebar from "./MobileSidebar";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Products", href: "/products" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { favorites } = useFavorites();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  const isAuthPage = isLoginPage || isSignupPage;

  // Check if user is on admin pages
  const isAdminPage = location.pathname.startsWith("/admin");
  
  // Check if user is on staff pages
  const isStaffPage = location.pathname.startsWith("/staff");
  
  // Determine if we should show panel navbar (for admin or staff)
  const shouldShowPanelNavbar = isAdminPage || isStaffPage;

  // For staff/admin who are browsing the regular site
  const isStaffOrAdmin = user?.role === "ADMIN" || user?.role === "STAFF";
  const isViewingMainSite = !shouldShowPanelNavbar && isStaffOrAdmin;
  
  // Auto-close sidebar when navigating
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // If user is admin/staff and on the main website,
  // redirect to the appropriate panel
  useEffect(() => {
    if (isAuthenticated && isStaffOrAdmin && !shouldShowPanelNavbar && !isViewingMainSite) {
      if (user?.role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else if (user?.role === "STAFF") {
        window.location.href = "/staff/dashboard";
      }
    }
  }, [isAuthenticated, isStaffOrAdmin, shouldShowPanelNavbar, isViewingMainSite, user?.role]);

  // Handle admin panel header
  if (isAdminPage) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/admin/dashboard" className="font-bold text-xl flex items-center">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Admin Panel
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                <a href="/" target="_blank">
                  <Globe className="mr-1 h-4 w-4" />
                  <span className="hidden md:inline">View Website</span>
                </a>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Handle staff panel header
  if (isStaffPage) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/staff/dashboard" className="font-bold text-xl flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Staff Panel
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                <a href="/" target="_blank">
                  <Globe className="mr-1 h-4 w-4" />
                  <span className="hidden md:inline">View Website</span>
                </a>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // For regular site visitors and staff/admin viewing the main site
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
            <nav className="hidden md:flex ml-10 space-x-4 lg:space-x-8">
              {!isAuthPage && (
                <>
                  {navLinks.map((link) => (
                    <NavLink key={link.name} to={link.href} className={({ isActive }) =>
                      isActive
                        ? "text-primary font-semibold"
                        : "text-foreground/80 hover:text-foreground"
                    }>
                      {link.name}
                    </NavLink>
                  ))}
                </>
              )}
            </nav>
          </div>
          
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {!isAuthPage && (
              <>
                {isAuthenticated ? (
                  <>
                    {/* Return to panel button for staff/admin who are viewing the main site */}
                    {isViewingMainSite && (
                      <Button asChild variant="outline" size="sm" className="mr-2">
                        <Link to={user?.role === "ADMIN" ? "/admin/dashboard" : "/staff/dashboard"}>
                          <LayoutDashboard className="mr-1 h-4 w-4" />
                          <span className="hidden lg:inline">Return to Panel</span>
                        </Link>
                      </Button>
                    )}
                    
                    {/* Only show cart and favorites for regular users */}
                    {!isStaffOrAdmin && (
                      <>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to="/favorites" className="relative">
                            <Heart className="h-5 w-5" />
                            {favorites.length > 0 && (
                              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {favorites.length}
                              </span>
                            )}
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to="/cart" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {itemCount > 0 && (
                              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {itemCount}
                              </span>
                            )}
                          </Link>
                        </Button>
                      </>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <User className="mr-2 h-4 w-4" />
                          <span className="hidden lg:inline">{user?.name}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!isStaffOrAdmin && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link to="/profile" className="flex items-center w-full">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem onClick={logout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <Button asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                )}
              </>
            )}
            <ThemeToggle />
          </div>
          
          {!isAuthPage && (
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
    </header>
  );
};

export default Navbar;
