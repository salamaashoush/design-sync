import { defineConfig } from '@design-sync/cli';
import { tailwindPlugin } from '@design-sync/tailwind-plugin';

export default defineConfig({
  uri: 'github:kadena-community/design-system/tokens#main',
  out: 'src/tokens',
  defaultMode: 'light',
  requiredModes: ['light', 'dark'],
  prettify: false,
  plugins: [
    tailwindPlugin({
      version: 4,
      cssFileName: 'theme.css',
      colorFormat: 'oklch',
    }),
  ],
});
