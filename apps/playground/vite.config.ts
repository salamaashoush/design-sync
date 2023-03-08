import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import devtools from 'solid-devtools/vite';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    devtools({
      autoname: true,
      locator: true,
    }),
    solidPlugin(),
    vanillaExtractPlugin({}),
    UnoCSS({
      // your config or in uno.config.ts
    }),
  ],
  server: {
    port: 4000,
  },
});
