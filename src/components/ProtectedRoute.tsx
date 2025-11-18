import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, isLoading } = useAuth();
  const location = useLocation();

  // 👀 Log de debug para verificar se o token foi carregado corretamente
  console.log("[ProtectedRoute] isLoading:", isLoading, "token:", token);

  // Enquanto o AuthProvider ainda está carregando o localStorage
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-foreground">Carregando...</div>
      </div>
    );
  }

  // Recuperando o token diretamente do localStorage, caso não esteja no contexto
  const storedToken = token || localStorage.getItem("token");

  console.log("[ProtectedRoute] Recuperado token do localStorage:", storedToken);

  // Se não tiver token nem no estado nem no localStorage, redireciona para login
  if (!storedToken) {
    console.log("[ProtectedRoute] Redirecionando para o login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se o token estiver presente, renderiza a página protegida
  return <>{children}</>;
}
