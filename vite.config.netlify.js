import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Configuração específica para o Netlify
// Simplificada para evitar problemas com dependências nativas

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve("./client/src"),
      "@shared": path.resolve("./shared"),
      "@assets": path.resolve("./attached_assets"),
    },
  },
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
      treeshake: true,
      output: {
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    exclude: ['fsevents', 'esbuild']
  },
  esbuild: {
    legalComments: 'none',
  },
  ssr: false,
}); 