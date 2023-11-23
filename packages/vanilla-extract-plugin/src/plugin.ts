import { DesignSyncConfig, TokensManager, TokensManagerPlugin, TokensManagerPluginFile } from '@design-sync/manager';
import { camelCase, set } from '@design-sync/utils';
import {
  ProcessedDesignToken,
  getModeRawValue,
  isTokenAlias,
  processPrimitiveValue,
  serializeObject,
  tokenValueToCss,
  typographyToCssStyle,
} from '@design-sync/w3c-dtfm';

interface VanillaExtractPluginConfig {
  varsName?: string;
  outDir?: string;
  themeSelector?: string;
  createGlobalTheme?: boolean;
}

function getStyleName(path: string) {
  const parts = path.split('.');
  if (path.includes('@')) {
    // get the last three parts
    return camelCase(
      parts
        .slice(parts.length - 3)
        .join('-')
        .replace('-@', '-'),
    );
  }

  return camelCase(parts.pop()!);
}

class VanillaExtractPlugin {
  private tokens: Record<string, Record<string, unknown>> = {};
  private styles: string[] = [];
  private tokensContract: Record<string, unknown> = {};
  private config: VanillaExtractPluginConfig & DesignSyncConfig;
  constructor(
    config: VanillaExtractPluginConfig,
    private manager: TokensManager,
  ) {
    this.config = {
      ...config,
      ...manager.getConfig(),
    };
    const { defaultMode, requiredModes } = this.walker.getModes();
    this.tokens[defaultMode] = {};
    for (const mode of requiredModes) {
      this.tokens[mode] = {};
    }
  }

  private get walker() {
    return this.manager.getWalker();
  }

  private get varsName() {
    return this.config.varsName || 'vars';
  }

  private get contractImport() {
    return `import { ${this.varsName} } from './contract.css';\n`;
  }

  private get defaultThemeImport() {
    return `import { defaultVars } from './default.css';\n`;
  }

  private wrapWithThemeVar = (path: string, isSinglePath: boolean) =>
    isSinglePath ? `${this.varsName}.${path}` : `\$\{${this.varsName}.${path}\}`;

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

  private addTypographyStyle(token: ProcessedDesignToken) {
    const { raw, fullPath } = token;
    const style = typographyToCssStyle(raw);
    if (isTokenAlias(style)) {
      return '';
    }
    // use the last part of the path as the style name
    const styleName = getStyleName(fullPath);
    for (const [key, value] of Object.entries(style)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (style as any)[key] = processPrimitiveValue(value, this.wrapWithThemeVar);
    }
    this.styles.push(`export const ${styleName} = style(${serializeObject(style)})\n`);
  }

  private addToken(token: ProcessedDesignToken) {
    const { requiredModes, defaultMode } = this.walker.getModes();
    const { raw, type, fullPath, valueByMode } = token;
    // add the token to the tokens contract
    set(this.tokensContract, fullPath, '');
    const defaultValue = processPrimitiveValue(tokenValueToCss(raw, type), this.wrapWithThemeVar);
    // set the default value in the default mode
    set(this.tokens[defaultMode], fullPath, defaultValue);
    for (const mode of requiredModes) {
      const rawValue = getModeRawValue(valueByMode, mode);
      if (rawValue) {
        set(this.tokens[mode], fullPath, processPrimitiveValue(tokenValueToCss(rawValue, type), this.wrapWithThemeVar));
      } else {
        set(this.tokens[mode], fullPath, defaultValue);
      }
    }
  }
  async run() {
    this.walker.walk((token) => {
      if (token.type === 'typography') {
        this.addTypographyStyle(token);
      } else {
        this.addToken(token);
      }
      this.runTokenExtensions(token);
    }, false);
    return this.getFiles();
  }

  private getFiles() {
    const { requiredModes, defaultMode } = this.walker.getModes();
    // 1. emit the tokens contract file and the typography file
    const files: TokensManagerPluginFile[] = [this.getThemeContractFile(), this.createStylesFile(this.styles)];

    // 2. emit the tokens theme files
    for (const mode of requiredModes) {
      files.push(this.createThemeFile(mode, this.tokens[mode]));
    }

    // 3. emit the default theme file if it's not already written
    if (!requiredModes.includes(defaultMode)) {
      files.push(this.createThemeFile(defaultMode, this.tokens[defaultMode]));
    }
    return files;
  }

  private getThemeContractFile() {
    const content = [
      `import { createThemeContract } from '@vanilla-extract/css';\n`,
      `export const ${this.varsName} = createThemeContract(${serializeObject(this.tokensContract)});`,
    ].join('\n');
    return {
      path: 'contract.css.ts',
      content,
    };
  }

  private createThemeFile(mode: string, tokens: object) {
    if (this.config.createGlobalTheme) {
      return this.createGlobalThemeFile(mode, tokens);
    }

    const content = [
      `import { createTheme } from '@vanilla-extract/css';\n`,
      this.contractImport,
      `export const ${mode}Theme = createTheme(${this.varsName}, ${serializeObject(tokens)});`,
    ].join('\n');
    return {
      path: `${mode}.css.ts`,
      content,
    };
  }

  private createGlobalThemeFile(mode: string, tokens: object) {
    const { themeSelector = ':root' } = this.config;
    const content = [
      `import { createGlobalTheme } from "@vanilla-extract/css";\n`,
      this.contractImport,
      `export const ${mode}Theme = createGlobalTheme("${themeSelector}", ${this.varsName}, ${serializeObject(
        tokens,
      )});`,
    ].join('\n');
    return {
      path: `${mode}.css.ts`,
      content,
    };
  }

  private createStylesFile(typography: string[]) {
    const content = [
      `import { style } from '@vanilla-extract/css';\n`,
      this.contractImport,
      typography.join('\n'),
    ].join('\n');
    return {
      path: 'styles.css.ts',
      content,
    };
  }
}

export function vanillaExtractPlugin(config: VanillaExtractPluginConfig = {}): TokensManagerPlugin {
  return {
    name: 'vanilla-extract',
    async build(manager) {
      const plugin = new VanillaExtractPlugin(
        {
          varsName: 'vars',
          themeSelector: ':root',
          createGlobalTheme: true,
          outDir: '',
          ...config,
        },
        manager,
      );
      return plugin.run();
    },
  };
}
