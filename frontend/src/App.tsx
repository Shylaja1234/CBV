import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import RequireAuth from "@/components/shared/RequireAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import StaffLayout from "@/components/staff/StaffLayout";

// Pages
import Index from "./pages/Index";
import AboutPage from "./pages/About";
import ServicesPage from "./pages/Services";
import ProductsPage from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import PricingPage from "./pages/Pricing";
import ContactPage from "./pages/Contact";
import LoginPage from "./pages/Login";
import FavoritesPage from "./pages/Favorites";
import UnauthorizedPage from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import SignupPage from "./pages/Signup";
import LearnMore from "./pages/LearnMore";
import ChangePassword from "./pages/Auth/ChangePassword";
import Profile from "./pages/Profile";
import FirstTimePasswordChange from "./pages/Auth/FirstTimePasswordChange";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import StaffManagement from "./pages/Admin/StaffManagement";
import Permissions from "./pages/Admin/Permissions";
import Messages from "./pages/Admin/Messages";
import UserManagement from "./pages/Admin/UserManagement";
import AdminProductManagement from "./pages/Admin/ProductManagement";

// Staff Pages
import StaffDashboard from "./pages/Staff/Dashboard";
import ProductsManagement from "./pages/Staff/ProductsManagement";
import PricingManagement from "./pages/Staff/PricingManagement";

const queryClient = new QueryClient();

const AdminLayoutWrapper = () => {
  return (
    <RequireAuth allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </RequireAuth>
  );
};

const StaffLayoutWrapper = () => {
  return (
    <RequireAuth allowedRoles={["STAFF"]}>
      <StaffLayout>
        <Outlet />
      </StaffLayout>
    </RequireAuth>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <BrowserRouter>
                <Toaster />
                <Sonner />
                <AnimatePresence mode="wait">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    
                    {/* Auth Routes */}
                    <Route path="/auth/first-time-password" element={
                      <RequireAuth>
                        <FirstTimePasswordChange />
                      </RequireAuth>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayoutWrapper />}>
                      <Route index element={<Dashboard />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="staff" element={<StaffManagement />} />
                      <Route path="messages" element={<Messages />} />
                      <Route path="products" element={<AdminProductManagement />} />
                    </Route>

                    {/* Staff Routes */}
                    <Route path="/staff" element={<StaffLayoutWrapper />}>
                      <Route index element={<StaffDashboard />} />
                      <Route path="dashboard" element={<StaffDashboard />} />
                      <Route path="products" element={<ProductsManagement />} />
                      <Route path="pricing" element={<PricingManagement />} />
                    </Route>

                    {/* Protected Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/learn-more" element={<LearnMore />} />
                    <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                    <Route path="/products" element={<RequireAuth><ProductsPage /></RequireAuth>} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/change-password" element={<RequireAuth><ChangePassword /></RequireAuth>} />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
              </BrowserRouter>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
