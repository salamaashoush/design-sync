import { camelCase } from '@design-sync/utils';

export interface ConfigTemplateOptions {
  out: string;
  repo: string;
  tokensPath: string;
  plugin: string;
  prettify: boolean;
}

export function generateCJSConfigTemplate({ out, repo, tokensPath, plugin, prettify }: ConfigTemplateOptions) {
  const pluginName = `${camelCase(plugin)}Plugin`;
  return `const { defineConfig, ${pluginName} } = require('@design-sync/sync');

module.exports = defineConfig({
  repo:  "${repo}",
  out:  "${out}",
  tokensPath:  "${tokensPath}",
  plugins: [${pluginName}()],
  prettify: ${prettify},
});`;
}

export function generateESMConfigTemplate({ out, repo, tokensPath, plugin }: ConfigTemplateOptions) {
  const pluginName = `${camelCase(plugin)}Plugin`;
  return `import { defineConfig, ${pluginName} } from '@design-sync/sync';

export default defineConfig({
  repo:  "${repo}",
  out:  "${out}",
  tokensPath:  "${tokensPath}",
  plugins: [${pluginName}()],
});`;
}

export function generateConfigTemplate(options: ConfigTemplateOptions, isCJS: boolean) {
  return isCJS ? generateCJSConfigTemplate(options) : generateESMConfigTemplate(options);
}
