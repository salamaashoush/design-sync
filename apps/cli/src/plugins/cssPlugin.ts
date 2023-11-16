import { TokensWalker, processPrimitiveValue, tokenValueToCss } from '@design-sync/w3c-dtfm';
import { TokensManagerPlugin } from '../manager';
import { DesignSyncConfig } from '../types';

interface CSSPluginConfig {}

class CSSPlugin {
  private vars: Record<string, string> = {};
  constructor(
    private config: CSSPluginConfig & DesignSyncConfig,
    private walker: TokensWalker,
  ) {}

  async run() {
    this.walker.walk((token) => {
      const { raw, type, fullPath, valueByMode } = token;

          // add the token to the tokens contract
          const defaultValue = processPrimitiveValue(tokenValueToCss(raw, type));
          // set the default value in the default mode
          set(this.tokens[defaultMode], fullPath, defaultValue);
          for (const mode of requiredModes) {
            const rawValue = getModeRawValue(valueByMode, mode);
            if (rawValue) {
              set(
                this.tokens[mode],
                fullPath,
                processPrimitiveValue(tokenValueToCss(rawValue, type), this.themeVarsName),
              );
            } else {
              set(this.tokens[mode], fullPath, defaultValue);
            }
          }
        }
      }
    });
  }
}

export function cssPlugin(config: CSSPluginConfig = {}): TokensManagerPlugin {
  return {
    name: 'vanilla-extract',
    async build(walker, designSyncConfig) {
      const plugin = new CSSPlugin(
        {
          ...config,
          ...designSyncConfig,
        },
        walker,
      );
      return plugin.run();
    },
  };
}
