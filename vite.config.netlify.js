import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Configuração específica para o Netlify
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client/src"),
      "@shared": path.resolve(process.cwd(), "shared"),
    },
  },
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(process.cwd(), "dist"),
    emptyOutDir: true,
  },
  // Definir variáveis de ambiente
  define: {
    'process.env.VITE_DEPLOYMENT': JSON.stringify('netlify'),
    'process.env.VITE_APP_HOME_PATH': JSON.stringify('/client/src/pages/Home.tsx'),
  }
}); 