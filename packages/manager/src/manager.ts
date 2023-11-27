import { toArray } from '@design-sync/utils';
import { TokensWalker } from '@design-sync/w3c-dtfm';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { defaultConfig, resolveConfig } from './config';
import { fetchTokens } from './fetcher';
import { logger } from './logger';
import { DesignSyncConfig } from './types';
import { formatAndWriteFile } from './writer';

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
  private config: DesignSyncConfig = defaultConfig;

  getWalker() {
    return this.walker;
  }

  getLogger() {
    return logger;
  }

  getConfig() {
    return this.config;
  }

  private async fetch(uri?: string, auth?: string) {
    const r = uri || this.config.uri;
    if (!r) {
      logger.error('No repo provided');
    }
    const a = auth || this.config.auth;
    const tokens = await fetchTokens(r, a);
    this.walker.setTokens(tokens);
  }

  private registerPluginsAndExtensions() {
    this.use(this.config.plugins);
    if (this.config.disableDefaultSchemaExtensions) {
      this.walker.disableDefaultExtensions();
    }
    if (this.config.schemaExtensions) {
      this.walker.use(this.config.schemaExtensions);
    }
  }

  async run(configOverride?: Partial<DesignSyncConfig>, tokens?: Record<string, unknown>) {
    logger.start('Processing tokens...');
    this.config = await resolveConfig(configOverride);
    this.walker.setOptions({
      defaultMode: this.config.defaultMode,
      requiredModes: this.config.requiredModes,
    });

    this.registerPluginsAndExtensions();
    if (!tokens) {
      await this.fetch();
    } else {
      this.walker.setTokens(tokens);
    }
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
      logger.success('Tokens processed successfully.');
    } catch (e) {
      logger.error('Failed to build tokens', e);
    }
  }

  use(plugin: TokensManagerPlugin | TokensManagerPlugin[]) {
    const plugins = toArray(plugin);
    for (const plugin of plugins) {
      if (this.plugins.some((p) => p.name === plugin.name)) {
        logger.warn(`Plugin ${plugin.name} already registered`);
        continue;
      }
      this.plugins.push(plugin);
    }
  }
}
