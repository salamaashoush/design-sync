import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [solidPlugin(), vanillaExtractPlugin(), viteSingleFile()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    target: 'es2020',
    rollupOptions: {
      input: 'index.html',
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
