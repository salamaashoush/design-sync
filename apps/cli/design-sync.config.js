import { defineConfig, vanillaExtractPlugin } from '.';

export default defineConfig({
  repo: 'gh:salamaashoush/design-sync-examples#main',
  out: 'generated',
  tokensPath: 'tokens.json',
  plugins: [vanillaExtractPlugin()],
});
