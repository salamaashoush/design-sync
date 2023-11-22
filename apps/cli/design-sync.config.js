import { cssPlugin } from '@design-sync/css-plugin';
import { jsonPlugin } from '@design-sync/json-plugin';
import { defineConfig } from '@design-sync/manager';
import { vanillaExtractPlugin } from '@design-sync/vanilla-extract-plugin';

console.log('dedupe-tokens config');
export default defineConfig({
  uri: 'github:salamaashoush/kda-design-system/tokens#dedupe-tokens',
  out: 'generated',
  plugins: [
    cssPlugin({
      selectors: {
        dark: '@media (prefers-color-scheme: dark)',
        light: '@media (prefers-color-scheme: light)',
      },
    }),
    vanillaExtractPlugin({
      themeContractName: 'Theme',
      themeContractVarName: 'theme',
    }),
    jsonPlugin(),
  ],
});
