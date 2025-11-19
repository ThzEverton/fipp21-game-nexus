import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/services/api";
import Cookies from "js-cookie";

interface User {
  id?: number;
  nome?: string;
  email?: string;
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

  // Carrega token dos cookies quando a app sobe (F5 / abrir aba nova)
  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUser = Cookies.get("user");

    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Erro ao parsear usuário salvo:", err);
        Cookies.remove("user");
      }
    }

    setIsLoading(false);
  }, []);

  const signIn = async (email: string, senha: string) => {
    try {
      const response = await api.post("/autenticacao/token", { email, senha });
      console.log("Resposta da API:", response.data);

      // ✅ sua API retorna apenas { token }
      const newToken: string = response.data.token;

      if (!newToken) {
        console.error("Token não retornado pela API");
        Cookies.remove("token");
        Cookies.remove("user");
        return;
      }

      // Se você quiser mostrar algo na tela, monta um "user fake" só com o e-mail
      const fakeUser: User = {
        email,
        nome: email.split("@")[0], // ex: "cleidejane"
      };

      setToken(newToken);
      setUser(fakeUser);

      // grava nos cookies (sem `secure` pra funcionar em http://localhost)
      Cookies.set("token", newToken, { expires: 7 });
      Cookies.set("user", JSON.stringify(fakeUser), { expires: 7 });

      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (err) {
      console.error("Erro ao tentar fazer login:", err);
      throw err;
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    Cookies.remove("token");
    Cookies.remove("user");
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
