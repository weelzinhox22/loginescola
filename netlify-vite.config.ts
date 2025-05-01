import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// For Netlify deployment - client-only configuration
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client", "src"),
      "@shared": path.resolve(process.cwd(), "shared"),
    },
  },
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(process.cwd(), "dist"),
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      // Enable JSX in .js files
      loader: {
        '.js': 'jsx',
      },
    },
  },
}); 