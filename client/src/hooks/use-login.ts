import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface LoginCredentials {
  email: string;
  password: string;
  role: string;
  remember?: boolean;
}

interface UseLoginReturn {
  login: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      /* 
       * INTEGRAÇÃO COM BACKEND
       * 
       * 1. Enviar credenciais para API de autenticação:
       *    POST /api/auth/login com email, senha e perfil
       */
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      const data = await response.json();

      /* 
       * 2. Receber token JWT e armazenar em localStorage:
       *    localStorage.setItem('auth_token', data.token);
       *
       * 3. Armazenar informações do usuário:
       *    localStorage.setItem('user_role', data.user.role);
       *    localStorage.setItem('user_name', data.user.name);
       */

      toast({
        title: "Login bem-sucedido!",
        description: `Bem-vindo ao Sistema de Gestão Escolar!`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao realizar login";
      setError(errorMessage);
      
      toast({
        title: "Erro ao fazer login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
