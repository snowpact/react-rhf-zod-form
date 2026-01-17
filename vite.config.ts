import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import postcss from 'postcss';
import cssnano from 'cssnano';

// Plugin to process and minify CSS file
const processStyles = () => ({
  name: 'process-styles',
  async closeBundle() {
    const distDir = resolve(__dirname, 'dist');
    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
    }

    const cssPath = resolve(__dirname, 'src/styles/index.css');
    const css = readFileSync(cssPath, 'utf-8');

    const result = await postcss([cssnano()]).process(css, { from: cssPath });

    writeFileSync(resolve(distDir, 'styles.css'), result.css);
  },
});

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src'],
      exclude: ['src/__tests__', 'src/styles'],
    }),
    processStyles(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RhfZodSnowForm',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-hook-form', 'zod', '@hookform/resolvers/zod'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-hook-form': 'ReactHookForm',
          zod: 'zod',
        },
      },
    },
  },
});
