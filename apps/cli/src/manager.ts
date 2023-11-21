import { TokensWalker } from '@design-sync/w3c-dtfm';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { logger } from './logger';
import { DesignSyncConfig } from './types';
import { formatAndWriteFile } from './utils';

export interface TokensManagerPluginFile {
  path: string;
  content: string;
}
export interface TokensManagerPlugin {
  name: string;
  build: (walker: TokensManager) => Promise<TokensManagerPluginFile[]>;
}

export class TokensManager {
  private plugins: TokensManagerPlugin[] = [];
  private walker = new TokensWalker();

  constructor(private config: DesignSyncConfig) {}

  getWalker() {
    return this.walker;
  }

  getLogger() {
    return logger;
  }

  getConfig() {
    return this.config;
  }

  async run(tokens: Record<string, unknown>) {
    this.walker.setTokens(tokens);
    // clean the dist folder
    const outPath = join(process.cwd(), this.config.out);
    if (existsSync(outPath)) {
      await rm(outPath, { recursive: true });
    }
    try {
      // run the plugins
      for (const plugin of this.plugins) {
        const files = await plugin.build(this);
        await Promise.all(
          files.map(async (file) => {
            await formatAndWriteFile(join(this.config.out, file.path), file.content, this.config.prettify);
            logger.success(`${plugin.name}: File ${file.path} written`);
          }),
        );
      }
    } catch (e) {
      logger.error('Failed to build tokens', e);
    }
  }

  use(plugin: TokensManagerPlugin) {
    this.plugins.push(plugin);
  }
}
