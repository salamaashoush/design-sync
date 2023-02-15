import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import UnoCSS from "unocss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [
    solidPlugin(),
    UnoCSS({
      // your config or in uno.config.ts
    }),
    viteStaticCopy({
      targets: [
        {
          src: "src/plugin/manifest.json",
          dest: ".",
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
    target: "esnext",
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      input: {
        index: "./index.html",
        ui: "./ui.html",
      },
      output: {
        assetFileNames: "assets/[name].[ext]",
        entryFileNames: "[name].js",
      },
    },
  },
});
