
import { ReactNode, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";

export interface AdminRouteProps {
  children?: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated but not an admin, show error toast
    if (isAuthenticated && !isLoading && !isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, isAdmin, navigate]);

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

  // If not admin, redirect to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and admin, render the protected component
  return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;
