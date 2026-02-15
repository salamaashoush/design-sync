import { defineConfig } from '@design-sync/cli';
import { pandaPlugin } from '@design-sync/panda-plugin';

export default defineConfig({
  uri: 'github:kadena-community/design-system/tokens#main',
  out: 'src/tokens',
  defaultMode: 'light',
  requiredModes: ['light', 'dark'],
  prettify: false,
  plugins: [
    pandaPlugin({
      format: 'preset',
      useSemanticTokens: true,
      generateTypes: true,
      conditions: {
        colorMode: {
          light: '[data-theme="light"] &',
          dark: '[data-theme="dark"] &',
        },
      },
    }),
  ],
});
