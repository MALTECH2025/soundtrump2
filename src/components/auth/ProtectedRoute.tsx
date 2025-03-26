
import { ReactNode, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";

export interface ProtectedRouteProps {
  children?: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is trying to access admin page but is not an admin
    if (requireAdmin && isAuthenticated && !isLoading && !isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, isAdmin, requireAdmin, navigate]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sound-medium border-t-sound-light rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If trying to access admin page but not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and meets role requirements, render the protected component
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
