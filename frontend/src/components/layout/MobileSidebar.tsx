
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { ShoppingCart, Heart, Cog, ShoppingBag, LayoutDashboard, LogOut, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { UserRole } from "@/context/AuthContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Products", href: "/products" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userRole?: UserRole;
}

const MobileSidebar = ({ isOpen, onOpenChange, userRole }: MobileSidebarProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onOpenChange(false);
    navigate("/");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <SheetHeader className="pb-4">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        {/* Main Navigation */}
        <div className="flex flex-col space-y-3 pt-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `py-2 px-3 rounded-md ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted"
                }`
              }
              onClick={() => onOpenChange(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <Separator className="my-4" />

        {/* User Actions */}
        <div className="space-y-3">
          {isAuthenticated ? (
            <>
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/favorites" onClick={() => onOpenChange(false)}>
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                    {favorites.length > 0 && (
                      <span className="ml-auto bg-secondary w-5 h-5 rounded-full flex items-center justify-center text-xs">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/cart" onClick={() => onOpenChange(false)}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart
                    {itemCount > 0 && (
                      <span className="ml-auto bg-secondary w-5 h-5 rounded-full flex items-center justify-center text-xs">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </Button>
              </div>

              {/* Admin/Staff Links */}
              {userRole === "admin" && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-2 px-1">Admin Panel</p>
                  <Button
                    variant="default"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/admin/dashboard" onClick={() => onOpenChange(false)}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </Button>
                </div>
              )}

              {userRole === "staff" && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-2 px-1">Staff Panel</p>
                  <Button
                    variant="default"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/staff/dashboard" onClick={() => onOpenChange(false)}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Staff Dashboard
                    </Link>
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button asChild className="w-full">
              <Link to="/login" onClick={() => onOpenChange(false)}>
                Login
              </Link>
            </Button>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2023 Company</p>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
