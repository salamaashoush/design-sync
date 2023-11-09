import { TokenWalkerFn, TokensWalker } from '@design-sync/w3c-dtfm';
import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CliConfig, formatTextWithPrettier } from '../utils';

export interface TokensManagerPlugin {
  name: string;
  start?(manager: TokensManager): Promise<void> | void;
  walk: TokenWalkerFn;
  end?(manager: TokensManager): Promise<void> | void;
}

export class TokensManager {
  private plugins: TokensManagerPlugin[] = [];
  private walker = new TokensWalker();

  constructor(private config: CliConfig) {}

  setTokens(tokens: Record<string, any>) {
    this.walker.setTokens(tokens);
  }

  getTokens() {
    return this.walker.getTokens();
  }

  getModes() {
    return this.walker.getModes();
  }

  async writeFile(path: string, content: string) {
    // check if the folder exists
    const folderPath = path.split('/').slice(0, -1).join('/');
    if (!existsSync(folderPath)) {
      await mkdir(folderPath, { recursive: true });
    }
    const formattedContent = await formatTextWithPrettier(content);
    return writeFile(path, formattedContent);
  }

  async run() {
    // clean the dist folder
    const outPath = join(process.cwd(), this.config.out);
    if (existsSync(outPath)) {
      await rm(outPath, { recursive: true });
    }
    // run the plugins
    await Promise.all(
      this.plugins.map(async (plugin) => {
        await plugin.start?.(this);
        this.walker.walkTokens(plugin.walk);
        return plugin.end?.(this);
      }),
    );
  }

  use(plugin: TokensManagerPlugin) {
    this.plugins.push(plugin);
  }

  getConfig() {
    return this.config;
  }
}
