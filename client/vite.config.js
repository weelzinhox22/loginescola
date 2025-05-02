import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, '../shared')
    }
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    // Disable minification in CI environment to speed up build
    minify: process.env.CI ? false : 'esbuild',
    // Reduce chunks for better performance
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
}); 