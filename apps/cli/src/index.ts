import type { DesignSyncConfig } from './types';

export * from './fetch';
export * from './logger';
export * from './manager';
export * from './plugins';
export * from './types';
export * from './utils';

export function defineConfig(config: Partial<DesignSyncConfig>) {
  return config;
}
