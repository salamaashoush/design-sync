import { set } from '@design-sync/utils';
import { getModeNormalizeValue } from '@design-sync/w3c-dtfm';
import { join } from 'node:path';
import { TokensManagerPlugin } from '../manager';

interface JSONPluginConfig {
  outDir?: string;
}
export function jsonPlugin(config: JSONPluginConfig = { outDir: '' }): TokensManagerPlugin {
  return {
    name: 'json-plugin',
    async build(manager) {
      const walker = manager.getWalker();
      const { defaultMode, requiredModes } = walker.getModes();
      const tokens: Record<string, Record<string, unknown>> = {
        [defaultMode]: {},
      };
      for (const mode of requiredModes) {
        tokens[mode] = {};
      }
      walker.walk((token) => {
        const { normalized, fullPath, valueByMode } = token;
        set(tokens[defaultMode], fullPath, normalized);
        for (const mode of requiredModes) {
          const normalizedValue = getModeNormalizeValue(valueByMode, mode);
          if (normalizedValue) {
            set(tokens[mode], fullPath, normalizedValue);
          } else {
            set(tokens[mode], fullPath, normalized);
          }
        }
      }, true);

      return Object.entries(tokens).map(([mode, tokens]) => ({
        path: join(config.outDir || '', `${mode}.json`),
        content: JSON.stringify(tokens, null, 2),
      }));
    },
  };
}
