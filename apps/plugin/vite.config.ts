import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import solidPlugin from 'vite-plugin-solid';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    solidPlugin(),
    UnoCSS({
      // your config or in uno.config.ts
    }),
    vanillaExtractPlugin({}),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.',
        },
      ],
    }),
    mkcert(),
  ],
  server: {
    port: 3000,
    https: true,
  },
  build: {
    target: 'esnext',
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      input: {
        index: './index.html',
        ui: './ui.html',
      },
      output: {
        assetFileNames: 'assets/[name].[ext]',
        entryFileNames: '[name].js',
      },
    },
  },
});
