import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-foreground">Carregando...</div>
      </div>
    );
  }

  const storedToken = token || Cookies.get("token");

  if (!storedToken) {
    console.log("[ProtectedRoute] Redirecionando para o login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
