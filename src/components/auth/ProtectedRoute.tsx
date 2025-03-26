
import { ReactNode, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export interface ProtectedRouteProps {
  children?: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, session, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Effect to redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated && session && location.pathname === "/login") {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, session, location, navigate]);

  // Set a timer to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      // If still loading after 3 seconds, assume there's an issue and proceed
      if (isLoading) {
        console.log("Auth check timeout - proceeding with available state");
        setHasCheckedAuth(true);
      }
    }, 3000);

    // If loading completes normally, clear the timer
    if (!isLoading) {
      clearTimeout(timer);
      setHasCheckedAuth(true);
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Show loading state while auth state is being determined
  if (isLoading && !hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sound-medium border-t-sound-light rounded-full animate-spin"></div>
      </div>
    );
  }

  // Log authentication state for debugging
  console.log("Auth state:", { isAuthenticated, isLoading, hasSession: !!session, hasUser: !!user });

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected component or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
