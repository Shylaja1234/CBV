import StaffProductsManagement from "@/pages/Staff/ProductsManagement";

// Admin and Staff share the same product management interface and functionality.
// The routes and API endpoints are already configured to allow access for both roles.

const AdminProductManagement = () => {
  return <StaffProductsManagement />;
};

export default AdminProductManagement; 