import { defineCommand } from 'citty';
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { ConfigTemplateOptions, generateConfigTemplate } from '../configTemplate';
import { logger } from '../logger';

async function configPrompt() {
  const repo = await logger.prompt('What is the url of your tokens git repo?', {
    type: 'text',
    placeholder: 'gh:username/repo/path/to/tokens#branch',
    default: 'gh:username/repo/path/to/tokens#branch',
  });

  const tokensPath = await logger.prompt('Where are your tokens located?', {
    type: 'text',
    placeholder: 'tokens.json',
    default: 'tokens.json',
  });

  const out = await logger.prompt('Where would you like to output your tokens?', {
    type: 'text',
    placeholder: 'src/design-sync',
    default: 'src/design-sync',
  });

  const plugin = await logger.prompt('Which plugin would you like to use?', {
    type: 'select',
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

  return { repo, tokensPath, out, plugin, prettify };
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
      repo: 'gh:username/repo/path/to/tokens#branch',
      out: 'src/design-sync',
      tokensPath: 'tokens.json',
      plugin: 'vanilla-extract',
      prettify: false,
    };

    if (!args.default) {
      config = await configPrompt();
    }
    const isCJS = typeof require !== 'undefined';
    const isTypescript = existsSync(`${args.cwd}/tsconfig.json`);
    const template = generateConfigTemplate(config, isCJS);
    const configPath = isTypescript ? 'design-sync.config.ts' : 'design-sync.config.js';
    await writeFile(join(args.cwd, configPath), template);
    logger.success(`Config file created at ${configPath}`);
  },
});
