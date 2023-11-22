import { loadConfig } from 'c12';
import { DesignSyncConfig } from './types';

export const defaultConfig = {
  uri: '',
  out: 'src/tokens',
  auth: '',
  cwd: process.cwd(),
  plugins: [],
  schemaExtensions: [],
  prettify: false,
};
export async function resolveConfig(overrides: Partial<DesignSyncConfig> = {}) {
  const configResult = await loadConfig<DesignSyncConfig>({
    name: 'design-sync',
    defaults: defaultConfig,
    overrides: overrides as DesignSyncConfig,
  });
  return configResult.config as DesignSyncConfig;
}

export function defineConfig(config: Partial<DesignSyncConfig>) {
  return config;
}
