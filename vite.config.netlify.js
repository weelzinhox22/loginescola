import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Configuração específica para o Netlify
// Simplificada para evitar problemas com dependências nativas

export default defineConfig({
  plugins: [
    react(),
  ],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve("./client/src"),
      "@shared": path.resolve("./shared"),
      "@assets": path.resolve("./attached_assets"),
    },
  },
  root: "./client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    // Usar rollup.browser.js em vez de rollup.node.js
    rollupOptions: {
      // Simplificar as opções do Rollup
      treeshake: true,
      output: {
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    // Excluir todas as dependências que possam usar módulos nativos
    exclude: ['fsevents', 'esbuild']
  },
  esbuild: {
    // Simplificar a configuração do esbuild
    legalComments: 'none',
  },
  // Desativar SSR, usado apenas no lado do cliente
  ssr: false,
}); 