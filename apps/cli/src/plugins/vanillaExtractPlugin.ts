/* eslint-disable @typescript-eslint/no-use-before-define */
import { camelCase, set } from '@design-sync/utils';
import {
  ProcessedDesignToken,
  TokensWalker,
  getModeRawValue,
  isTokenAlias,
  processPrimitiveValue,
  serializeObject,
  tokenValueToCss,
  typographyToCssStyle,
} from '@design-sync/w3c-dtfm';
import { join } from 'path';
import { TokensManagerPlugin } from '../manager';
import { DesignSyncConfig } from '../types';
import { writeFile } from '../utils';

function getStyleName(path: string) {
  // get the last part of the path and camelCase it
  return camelCase(path.split('.').pop()!);
}

function createTypographyStyle(tokenValue: unknown, path: string, varsName = 'vars') {
  const style = typographyToCssStyle(tokenValue);
  if (isTokenAlias(style)) {
    return '';
  }
  const styleName = getStyleName(path);
  for (const [key, value] of Object.entries(style)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (style as any)[key] = processPrimitiveValue(value, varsName);
  }
  return `export const ${styleName} = style(${serializeObject(style)})\n`;
}

interface VanillaExtractPluginConfig {
  themeContractVarName?: string;
  themeContractName?: string;
}

class VanillaExtractPlugin {
  private tokens: Record<string, Record<string, unknown>> = {};
  private styles: string[] = [];
  private tokensContract: Record<string, unknown> = {};
  private outPath: string = process.cwd();

  constructor(
    private config: VanillaExtractPluginConfig & DesignSyncConfig,
    private walker: TokensWalker,
  ) {
    this.outPath = join(process.cwd(), this.config.out);
    const { defaultMode, requiredModes } = this.walker.getModes();
    this.tokens[defaultMode] = {};
    for (const mode of requiredModes) {
      this.tokens[mode] = {};
    }
  }

  private get themeVarsName() {
    return this.config.themeContractVarName || 'vars';
  }

  private get themeContractName() {
    return this.config.themeContractName || 'contract';
  }

  private runTokenExtensions(token: ProcessedDesignToken) {
    const actions = this.walker.runTokenExtensions(token);
    const { requiredModes } = this.walker.getModes();
    for (const action of actions) {
      for (const mode of requiredModes) {
        switch (action.type) {
          case 'add':
          case 'update':
            set(this.tokens[mode], action.path, action.payload[mode]);
            set(this.tokensContract, action.path, '');
            break;
          case 'remove':
            set(this.tokens[mode], action.path, undefined);
            set(this.tokensContract, action.path, undefined);
            break;
        }
      }
    }
  }

  async run() {
    const { requiredModes, defaultMode } = this.walker.getModes();
    this.walker.walk((token) => {
      const { raw, type, fullPath, valueByMode } = token;
      switch (type) {
        case 'typography': {
          this.styles.push(createTypographyStyle(raw, fullPath));
          break;
        }
        default: {
          // add the token to the tokens contract
          set(this.tokensContract, fullPath, '');
          const defaultValue = processPrimitiveValue(tokenValueToCss(raw, type), this.themeVarsName);
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
      this.runTokenExtensions(token);
    });
    await this.write();
  }

  private async write() {
    const { requiredModes, defaultMode } = this.walker.getModes();
    // 1. write the tokens theme contract
    await this.writeTokensContract();

    // 2. write the tokens theme files
    for (const mode of requiredModes) {
      await this.writeTokensTheme(mode, this.tokens[mode]);
    }
    // 3. write the default theme file if it's not already written
    if (!requiredModes.includes(defaultMode)) {
      await this.writeTokensTheme(defaultMode, this.tokens[defaultMode]);
    }

    // 4. write the typography styles
    await this.writeTypographyStyles(this.styles);
  }

  private writeTokensContract() {
    const content = [
      `import { createThemeContract } from '@vanilla-extract/css';\n`,
      `export const ${this.themeVarsName} = createThemeContract(${serializeObject(this.tokensContract)});`,
    ].join('\n');
    return writeFile(join(this.outPath, `${this.themeContractName}.css.ts`), content);
  }

  private writeTokensTheme(mode: string, tokens: object) {
    const content = [
      `import { createTheme } from '@vanilla-extract/css';\n`,
      `import { ${this.themeVarsName} } from './${this.themeContractName}.css';\n`,
      `export const ${mode}Theme = createTheme(${this.themeVarsName}, ${serializeObject(tokens)});`,
    ].join('\n');
    return writeFile(join(this.outPath, `${mode}.css.ts`), content);
  }

  private writeTypographyStyles(typography: string[]) {
    const content = [
      `import { style } from '@vanilla-extract/css';\n`,
      `import { ${this.themeVarsName} } from './${this.themeContractName}.css';\n`,
      typography.join('\n'),
    ].join('\n');
    return writeFile(join(this.outPath, 'typography.css.ts'), content);
  }
}

export function vanillaExtractPlugin(config: VanillaExtractPluginConfig = {}): TokensManagerPlugin {
  return {
    name: 'vanilla-extract',
    async build(walker, designSyncConfig) {
      const plugin = new VanillaExtractPlugin(
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
