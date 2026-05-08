import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['localhost:3000', 'localhost:4173', 'pyrus-master.expertly.uz']
  }
});
