import { camelCase } from '@design-sync/utils';

export interface ConfigTemplateOptions {
  out: string;
  repo: string;
  tokensPath: string;
  plugin: string;
}

export function generateCJSConfigTemplate({ out, repo, tokensPath, plugin }: ConfigTemplateOptions) {
  return `const { defineConfig, ${camelCase(plugin)} } = require('@design-sync/sync');

module.exports = defineConfig({
  repo:  "${repo}",
  out:  "${out}",
  tokensPath:  "${tokensPath}",
  plugins: [${camelCase(plugin)}()],
});`;
}

export function generateESMConfigTemplate({ out, repo, tokensPath, plugin }: ConfigTemplateOptions) {
  return `import { defineConfig, ${camelCase(plugin)} } from '@design-sync/sync';

export default defineConfig({
  repo:  "${repo}",
  out:  "${out}",
  tokensPath:  "${tokensPath}",
  plugins: [${camelCase(plugin)}()],
});`;
}

export function generateConfigTemplate({ out, repo, tokensPath, plugin }: ConfigTemplateOptions, isCJS: boolean) {
  return isCJS
    ? generateCJSConfigTemplate({ out, repo, tokensPath, plugin })
    : generateESMConfigTemplate({ out, repo, tokensPath, plugin });
}
