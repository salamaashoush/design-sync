import { loadConfig } from 'c12';
import { DesignSyncConfig } from './types';

const defaults = {
  uri: '',
  out: 'src/tokens',
  auth: '',
  cwd: process.cwd(),
  plugins: [],
  schemaExtensions: [],
  prettify: false,
};
export async function resolveConfig(args: Partial<DesignSyncConfig> = {}) {
  const configResult = await loadConfig<DesignSyncConfig>({
    name: 'design-sync',
    defaults,
    overrides: args as DesignSyncConfig,
  });
  return configResult.config as DesignSyncConfig;
}
