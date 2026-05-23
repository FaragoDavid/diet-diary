import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
  },
  envDir: '../',
});
