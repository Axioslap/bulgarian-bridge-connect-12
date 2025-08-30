
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = "/login" 
}: ProtectedRouteProps) => {
  const { toast } = useToast();
  
  // Check for authentication token or session
  // This will be properly implemented when Supabase is connected
  const authToken = localStorage.getItem('auth_token');
  const isAuthenticated = !!authToken;
  
  if (!isAuthenticated) {
    toast({
      title: "Access denied",
      description: "You need to login to access this area",
      variant: "destructive",
    });
    return <Navigate to={redirectTo} />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
