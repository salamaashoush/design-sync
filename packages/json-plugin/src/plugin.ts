import { TokensManagerPlugin } from '@design-sync/manager';
import { set } from '@design-sync/utils';
import { join } from 'node:path';

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
        const { normalizedValue, path } = token;
        set(tokens[defaultMode], path, normalizedValue);
        for (const mode of requiredModes) {
          const normalizedModeValue = token.getNormalizeValueByMode(mode);
          if (normalizedModeValue) {
            set(tokens[mode], path, normalizedModeValue);
          } else {
            set(tokens[mode], path, normalizedValue);
          }
        }
      });

      return Object.entries(tokens).map(([mode, tokens]) => ({
        path: join(config.outDir || '', `${mode}.json`),
        content: JSON.stringify(tokens, null, 2),
      }));
    },
  };
}
