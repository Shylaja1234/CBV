
import { Route } from "react-router-dom";
import RequireAuth from "@/components/shared/RequireAuth";

// Admin Pages
import Dashboard from "@/pages/Admin/Dashboard";
import ContentEditor from "@/pages/Admin/ContentEditor";

// Staff Pages
import StaffDashboard from "@/pages/Staff/Dashboard";
import ProductsManagement from "@/pages/Staff/ProductsManagement";
import PricingManagement from "@/pages/Staff/PricingManagement";

const AdminRoutes = () => {
  return (
    <>
      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <RequireAuth allowedRoles={["admin"]}>
            <Dashboard />
          </RequireAuth>
        } 
      />
      <Route 
        path="/admin/pages/:pageId" 
        element={
          <RequireAuth allowedRoles={["admin"]}>
            <ContentEditor />
          </RequireAuth>
        } 
      />
      
      {/* Staff Routes - Admins also have access */}
      <Route 
        path="/staff/dashboard" 
        element={
          <RequireAuth allowedRoles={["admin", "staff"]}>
            <StaffDashboard />
          </RequireAuth>
        } 
      />
      <Route 
        path="/staff/products" 
        element={
          <RequireAuth allowedRoles={["admin", "staff"]}>
            <ProductsManagement />
          </RequireAuth>
        } 
      />
      <Route 
        path="/staff/pricing" 
        element={
          <RequireAuth allowedRoles={["admin", "staff"]}>
            <PricingManagement />
          </RequireAuth>
        } 
      />
    </>
  );
};

export default AdminRoutes;
