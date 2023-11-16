import { TokensWalker } from '@design-sync/w3c-dtfm';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { DesignSyncConfig } from './types';

export interface TokensManagerPlugin {
  name: string;
  config?(config: DesignSyncConfig): Promise<void> | void;
  build: (walker: TokensWalker, config: DesignSyncConfig) => Promise<void> | void;
}

export class TokensManager {
  private plugins: TokensManagerPlugin[] = [];
  private walker = new TokensWalker();

  constructor(private config: DesignSyncConfig) {}

  async run() {
    // clean the dist folder
    const outPath = join(process.cwd(), this.config.out);
    if (existsSync(outPath)) {
      await rm(outPath, { recursive: true });
    }
    // run the plugins
    await Promise.all(
      this.plugins.map(async (plugin) => {
        await plugin.config?.(this.config);
        return plugin.build(this.walker, this.config);
      }),
    );
  }

  use(plugin: TokensManagerPlugin) {
    this.plugins.push(plugin);
  }
}
