import { logger } from '@design-sync/manager';
import { camelCase } from '@design-sync/utils';
import { defineCommand } from 'citty';
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { addDevDependency } from 'nypm';
import { join } from 'path';
export interface ConfigTemplateOptions {
  out: string;
  uri: string;
  plugins: string[];
  prettify: boolean;
}

export function generateCJSConfigTemplate({ out, uri, plugins, prettify }: ConfigTemplateOptions) {
  const pluginImports = plugins.map(
    (plugin) => `const ${camelCase(plugin)}Plugin = require('@design-sync/${plugin}-plugin');`,
  );
  const pluginCalls = plugins.map((plugin) => `${camelCase(plugin)}Plugin()`);
  return `const { defineConfig } = require('@design-sync/manager');
${pluginImports.join('\n')}

module.exports = defineConfig({
  uri:  "${uri}",
  out:  "${out}",
  plugins: [${pluginCalls.join(', ')}],
  prettify: ${prettify},
});`;
}

export function generateESMConfigTemplate({ out, uri, plugins, prettify }: ConfigTemplateOptions) {
  const pluginImports = plugins.map(
    (plugin) => `import { ${camelCase(plugin)}Plugin } from '@design-sync/${plugin}-plugin';`,
  );
  const pluginCalls = plugins.map((plugin) => `${camelCase(plugin)}Plugin()`);
  return `import { defineConfig } from '@design-sync/manager';
${pluginImports.join('\n')}

export default defineConfig({
  uri:  "${uri}",
  out:  "${out}",
  plugins: [${pluginCalls.join(', ')}],
  prettify: ${prettify},
});`;
}

export function generateConfigTemplate(options: ConfigTemplateOptions, isCJS: boolean) {
  return isCJS ? generateCJSConfigTemplate(options) : generateESMConfigTemplate(options);
}

async function configPrompt() {
  const uri = await logger.prompt('What is the uri of your tokens git repo?', {
    type: 'text',
    placeholder: 'gh:username/repo/path/to/tokens#branch',
    default: 'gh:username/repo/path/to/tokens#branch',
  });

  const out = await logger.prompt('Where would you like to output your tokens?', {
    type: 'text',
    placeholder: 'src/design-sync',
    default: 'src/design-sync',
  });

  const plugins = await logger.prompt('Which plugin would you like to use?', {
    type: 'multiselect',
    options: [
      'vanilla-extract',
      // 'styled-components',
      // 'emotion',
      // 'tailwindcss',
      // 'stitches',
      // 'css-modules',
      'css',
      'json',
      // 'typescript',
    ],
    initial: 'vanilla-extract',
  });

  const prettify = await logger.prompt('Would you like to format files using prettier?', {
    type: 'confirm',
    initial: false,
  });

  return { uri, out, plugins, prettify };
}

export default defineCommand({
  meta: {
    name: 'init',
    description: 'Init design sync config',
  },
  args: {
    cwd: {
      type: 'string',
      description: 'path to cwd',
      default: process.cwd(),
    },
    default: {
      type: 'boolean',
      description: 'use default config',
      alias: 'y',
      default: false,
    },
  },
  async run({ args }) {
    let config: ConfigTemplateOptions = {
      uri: 'gh:username/repo/path/to/tokens#branch',
      out: 'src/design-sync',
      plugins: ['json'],
      prettify: false,
    };

    if (!args.default) {
      config = await configPrompt();
    }
    const isCJS = typeof require !== 'undefined';
    const isTypescript = existsSync(`${args.cwd}/tsconfig.json`);
    const template = generateConfigTemplate(config, isCJS);

    const deps = ['@design-sync/cli', ...config.plugins.map((plugin) => `@design-sync/${plugin}-plugin`)];
    logger.start(`Installing dependencies ${deps.join(', ')} ...`);
    for (const dep of deps) {
      await addDevDependency(dep, { cwd: args.cwd });
    }
    logger.success('Dependencies installed');

    const configPath = isTypescript ? 'design-sync.config.ts' : 'design-sync.config.js';
    await writeFile(join(args.cwd, configPath), template);
    logger.success(`Config file created at ${configPath}`);
  },
});
