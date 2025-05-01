import { z } from "zod";

// Client-only schemas for Netlify deployment
// This file replaces the original schema.ts that uses Drizzle ORM

// Login schema for validation
export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  role: z.enum(["professor", "coordenador", "diretor"], {
    required_error: "Selecione um perfil de acesso",
  }),
  remember: z.boolean().optional(),
});

// Client-only user types
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  name: string;
}

export type LoginCredentials = z.infer<typeof loginSchema>; 