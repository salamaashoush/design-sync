import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import prettier from 'prettier';

export async function formatTextWithPrettier(text: string, parser = 'typescript') {
  const config = await prettier.resolveConfig(join(__dirname, '../../../.prettierrc.js'));
  return prettier.format(text, { ...config, parser });
}

export interface CliConfig {
  repo: string;
  tokensPath: string;
  out: string;
  auth?: string;
}

const defaultConfig: CliConfig = {
  repo: '',
  tokensPath: 'tokens.json',
  out: 'dist',
  auth: process.env.GIGET_AUTH,
};

export async function loadConfig(argv: Partial<CliConfig>, configPath = './tokenize.cli.json'): Promise<CliConfig> {
  configPath = join(process.cwd(), configPath);
  const configExists = existsSync(configPath);
  let config = defaultConfig;
  if (configExists) {
    const configFileContent = await readFile(configPath, 'utf-8');
    try {
      config = JSON.parse(configFileContent) as CliConfig;
    } catch (e) {}
  }
  return {
    repo: argv.repo || config.repo,
    tokensPath: argv.tokensPath || config.tokensPath,
    out: argv.out || config.out,
    auth: argv.auth || config.auth,
  };
}
