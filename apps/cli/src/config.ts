import { loadConfig } from 'c12';
import { DesignSyncConfig } from './types';

const defaults = {
  repo: '',
  out: 'dist',
  tokensPath: 'tokens.json',
};
export async function resolveConfig() {
  const configResult = await loadConfig<DesignSyncConfig>({
    name: 'design-sync',
    defaults,
  });
  return configResult.config as DesignSyncConfig;
}
