// Mock API for client-side only deployment (Netlify)

export interface User {
  email: string;
  role: string;
  name: string;
}

const mockUsers: Record<string, { password: string; role: string; name: string }> = {
  "professor@escola.com": { password: "123456", role: "professor", name: "Professor Teste" },
  "coordenador@escola.com": { password: "123456", role: "coordenador", name: "Coordenador Teste" },
  "diretor@escola.com": { password: "123456", role: "diretor", name: "Diretor Teste" }
};

export const mockAuth = {
  login: async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (mockUsers[email] && mockUsers[email].password === password) {
      return {
        success: true,
        user: {
          email,
          role: mockUsers[email].role,
          name: mockUsers[email].name
        }
      };
    }
    
    return {
      success: false,
      error: "Email ou senha incorretos"
    };
  }
}; 