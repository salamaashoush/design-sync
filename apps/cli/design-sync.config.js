import { cssPlugin, defineConfig, jsonPlugin, vanillaExtractPlugin } from '.';

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
