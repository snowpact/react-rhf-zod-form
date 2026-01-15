import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname),
  base: '/react-rhf-zod-form/',
  build: {
    outDir: resolve(__dirname, '../demo-dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@snowpact/react-rhf-zod-form': resolve(__dirname, '../src'),
    },
  },
});
