import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  isPublic?: boolean;
}

const RequireAuth = ({ children, allowedRoles, isPublic = false }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If the page is public, allow access
  if (isPublic) {
    return <>{children}</>;
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user needs to change password and isn't already on the change password page
  if (user.requirePasswordChange && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
