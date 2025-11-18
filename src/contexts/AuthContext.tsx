import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/services/api";

interface User {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          // 🔥 GARANTE QUE TEM JSON VÁLIDO
          const parsedUser = JSON.parse(storedUser);

          if (parsedUser && parsedUser.id) {
            setToken(storedToken);
            setUser(parsedUser);
            api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
          } else {
            console.warn("Usuário salvo está inválido, limpando storage.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }

        } catch (err) {
          console.error("Erro ao parsear usuário salvo:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }

    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, senha: string) => {
    const response = await api.post("/autenticacao/token", { email, senha });
    const { token: newToken, usuario } = response.data;

    // 🔥 GARANTE QUE ESTÁ SALVANDO JSON DE VERDADE
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(usuario));

    setToken(newToken);
    setUser(usuario);

    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
