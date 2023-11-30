import { DesignSyncConfig, TokensManager, TokensManagerPlugin, TokensManagerPluginFile } from '@design-sync/manager';
import { camelCase, deepMerge, set } from '@design-sync/utils';
import {
  DesignTokenValueByMode,
  ProcessedDesignToken,
  getModeRawValue,
  isTokenAlias,
  processPrimitiveValue,
  serializeObject,
  tokenValueToCss,
  typographyToCssStyle,
} from '@design-sync/w3c-dtfm';

interface VanillaExtractPluginConfig {
  contractName?: string;
  outDir?: string;
  themeSelector?: string | Record<string, string>;
  createGlobalThemes?: boolean;
  createGlobalContract?: boolean;
}

function getStyleName(path: string) {
  const parts = path.split('.');
  return camelCase(
    parts
      .slice(parts.length - 3)
      .join('-')
      .replace('-@', '-'),
  );
}

class VanillaExtractPlugin {
  private tokens: Record<string, Record<string, unknown>> = {};
  private styles: string[] = [];
  private tokensContract: Record<string, unknown> = {};
  private config: VanillaExtractPluginConfig & DesignSyncConfig;
  private docs = new Map<string, string>();

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

  private get contractName() {
    return this.config.contractName || 'vars';
  }

  private get contractImport() {
    return `import { ${this.contractName} } from './contract.css';\n`;
  }

  private wrapWithThemeVar = (path: string, isSinglePath: boolean) =>
    isSinglePath ? `${this.contractName}.${path}` : '${' + this.contractName + '.' + path + '}';

  private processCssStyleObject(style: Record<string, string | number>) {
    for (const [key, value] of Object.entries(style)) {
      style[key] = processPrimitiveValue(value, this.wrapWithThemeVar);
    }
    return style;
  }
  private addTypographyStyle(token: ProcessedDesignToken) {
    const { defaultMode } = this.walker.getModes();
    const { rawValue, path, isResponsive, valueByMode } = token;
    let finalStyle = {};
    if (isResponsive) {
      const baseStyle = typographyToCssStyle(getModeRawValue(valueByMode.base as DesignTokenValueByMode, defaultMode));
      if (!isTokenAlias(baseStyle)) {
        finalStyle = this.processCssStyleObject(baseStyle);
      }
      for (const [breakpoint, value] of Object.entries(valueByMode)) {
        if (breakpoint === 'base') {
          continue;
        }
        const rawModeValue = getModeRawValue(value as DesignTokenValueByMode, defaultMode);
        const style = typographyToCssStyle(rawModeValue);
        if (isTokenAlias(style)) {
          continue;
        }

        this.processCssStyleObject(style);
        // filter all keys that are with the same value as the base
        const filteredEntries = Object.entries(style).filter(([key, value]) => (baseStyle as any)[key] !== value);
        if (filteredEntries.length === 0) {
          continue;
        }
        finalStyle = deepMerge(finalStyle, {
          '@media': {
            [breakpoint.replace('@media ', '')]: Object.fromEntries(filteredEntries),
          },
        });
      }
    } else {
      const style = typographyToCssStyle(rawValue);
      if (isTokenAlias(style)) {
        return '';
      }
      finalStyle = this.processCssStyleObject(style);
    }
    // use the last part of the path as the style name
    const styleName = getStyleName(path);
    this.styles.push(`export const ${styleName} = style(${serializeObject(finalStyle)})\n`);
  }

  private addTokenDocs(token: ProcessedDesignToken) {
    const requiredModes = this.walker.getModes().requiredModes;
    const { rawValue, type, path, valueByMode } = token;
    const docs = [
      `/**`,
      token.description ? ` * @description ${token.description}` : '',
      token.isGenerated ? ` * @generated` : '',
      ` * @default ${processPrimitiveValue(tokenValueToCss(rawValue, type))}`,
    ].filter(Boolean);

    for (const mode of requiredModes) {
      const rawModeValue = getModeRawValue(valueByMode, mode);
      if (rawModeValue) {
        docs.push(` * @${mode} ${processPrimitiveValue(tokenValueToCss(rawModeValue, type))}`);
      } else {
        docs.push(` * @${mode} ${processPrimitiveValue(tokenValueToCss(rawValue, type))}`);
      }
    }
    docs.push(` */\n`);
    this.docs.set(path, docs.join('\n'));
  }

  private addToken(token: ProcessedDesignToken) {
    const { requiredModes, defaultMode } = this.walker.getModes();
    const { rawValue, type, path, valueByMode } = token;
    // add the token to the tokens contract
    set(this.tokensContract, path, '');
    // add the token docs
    this.addTokenDocs(token);
    const defaultValue = processPrimitiveValue(tokenValueToCss(rawValue, type), this.wrapWithThemeVar);
    // set the default value in the default mode
    set(this.tokens[defaultMode], path, defaultValue);
    for (const mode of requiredModes) {
      const rawModeValue = getModeRawValue(valueByMode, mode);
      if (rawModeValue) {
        set(this.tokens[mode], path, processPrimitiveValue(tokenValueToCss(rawModeValue, type), this.wrapWithThemeVar));
      } else {
        set(this.tokens[mode], path, defaultValue);
      }
    }
  }
  async run() {
    for (const token of this.walker.getTokens()) {
      if (token.type === 'typography') {
        this.addTypographyStyle(token);
      } else {
        this.addToken(token);
      }
    }
    return this.getFiles();
  }

  private getFiles() {
    const { requiredModes, defaultMode } = this.walker.getModes();
    // 1. emit the tokens contract file and the typography file
    const files: TokensManagerPluginFile[] = [this.createThemeContractFile(), this.createStylesFile(this.styles)];

    // 2. emit the tokens theme files
    for (const mode of requiredModes) {
      files.push(this.createThemeFile(mode, this.tokens[mode], mode === defaultMode));
    }

    // 3. emit the default theme file if it's not already written
    if (!requiredModes.includes(defaultMode)) {
      files.push(this.createThemeFile(defaultMode, this.tokens[defaultMode], true));
    }
    return files;
  }

  private createThemeContractFile() {
    const themeContractFactory = this.config.createGlobalContract ? 'createGlobalThemeContract' : 'createThemeContract';
    const content = [
      `import { ${themeContractFactory} } from '@vanilla-extract/css';\n`,
      `export const ${this.contractName} = ${themeContractFactory}(${serializeObject(this.tokensContract, {
        docsComment: (path) => this.docs.get(path) || '',
      })});`,
    ].join('\n');
    return {
      path: 'contract.css.ts',
      content,
    };
  }

  private createThemeFile(mode: string, tokens: object, isDefault = false) {
    const { themeSelector = ':root', createGlobalThemes } = this.config;
    const isGlobal = createGlobalThemes || isDefault;
    const themeFactory = isGlobal ? 'createGlobalTheme' : 'createTheme';
    const selector = isGlobal ? `"${themeSelector}"` : undefined;

    const themeValues = serializeObject(tokens);
    const factoryArgs = [selector, this.contractName, `${mode}ThemeValues`].filter(Boolean).join(', ');
    const factoryCall = `${themeFactory}(${factoryArgs});`;

    const content = [
      `import { ${themeFactory} } from '@vanilla-extract/css';\n`,
      this.contractImport,
      `export const ${mode}ThemeValues = ${themeValues};\n`,
      isGlobal ? factoryCall : `export const ${mode}Theme = ${factoryCall}`,
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
          contractName: 'vars',
          themeSelector: ':root',
          createGlobalThemes: false,
          createGlobalContract: false,
          outDir: '',
          ...config,
        },
        manager,
      );
      return plugin.run();
    },
  };
}
