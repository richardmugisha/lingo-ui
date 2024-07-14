import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Specify the output directory as 'build' for production
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
  },
});
