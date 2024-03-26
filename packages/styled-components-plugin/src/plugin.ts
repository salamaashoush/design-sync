import { TokensManager, TokensManagerPlugin, TokensManagerPluginFile } from '@design-sync/manager';
import { camelCase, deepMerge, set } from '@design-sync/utils';
import {
  DesignTokenValueByMode,
  WalkerDesignToken,
  getModeRawValue,
  isTokenAlias,
  pathToCssVarName,
  processCssVarRef,
  processPrimitiveValue,
  serializeObject,
  serializeObjectToCSS,
  tokenValueToCss,
  typographyToCssStyle,
} from '@design-sync/w3c-dtfm';
import { join } from 'path';

interface StyledComponentsPluginConfig {
  outDir?: string;
  useCssVars?: boolean;
  useTs?: boolean;
}

class StyledComponentsPlugin {
  private tokens: Record<string, Record<string, unknown>> = {};
  private styles: string[] = [];
  private tokensContract: Record<string, unknown> = {};
  private docs = new Map<string, string>();

  constructor(
    private config: Required<StyledComponentsPluginConfig>,
    private manager: TokensManager,
  ) {
    const { defaultMode, requiredModes } = this.walker.getModes();
    this.tokens[defaultMode] = {};
    for (const mode of requiredModes) {
      this.tokens[mode] = {};
    }
  }

  private get walker() {
    return this.manager.getWalker();
  }

  private processCssStyleObject(style: Record<string, string | number>) {
    for (const [key, value] of Object.entries(style)) {
      style[key] = this.config.useCssVars ? processCssVarRef(value) : value;
    }
    return style;
  }

  private addStyle(token: WalkerDesignToken) {
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
    const styleName = token.getStyleName(camelCase);
    this.styles.push(`export const ${styleName} = style(${serializeObject(finalStyle)})\n`);
  }

  private addTokenDocs(token: WalkerDesignToken) {
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

  private addToken(token: WalkerDesignToken) {
    const { requiredModes, defaultMode } = this.walker.getModes();
    const { useCssVars } = this.config;
    const { rawValue, type, path, valueByMode } = token;
    const tokenPath = useCssVars ? pathToCssVarName(path) : path;
    // add the token docs
    this.addTokenDocs(token);
    const defaultValue = useCssVars
      ? processCssVarRef(tokenValueToCss(rawValue, type))
      : tokenValueToCss(rawValue, type);
    // set the default value in the default mode
    set(this.tokens[defaultMode], tokenPath, defaultValue);
    for (const mode of requiredModes) {
      const rawModeValue = getModeRawValue(valueByMode, mode);
      if (rawModeValue) {
        set(
          this.tokens[mode],
          tokenPath,
          useCssVars ? processCssVarRef(tokenValueToCss(rawModeValue, type)) : tokenValueToCss(rawModeValue, type),
        );
      } else {
        set(this.tokens[mode], tokenPath, defaultValue);
      }
    }
  }

  async run() {
    for (const token of this.walker.getTokens()) {
      if (token.type === 'typography') {
        this.addStyle(token);
      } else {
        this.addToken(token);
      }
    }
    return this.getFiles();
  }

  private getFiles() {
    const { requiredModes, defaultMode } = this.walker.getModes();
    const files: TokensManagerPluginFile[] = [this.createStylesFile(this.styles)];

    for (const mode of requiredModes) {
      files.push(this.createThemeFile(mode, this.tokens[mode]));
    }

    if (!requiredModes.includes(defaultMode)) {
      files.push(this.createThemeFile(defaultMode, this.tokens[defaultMode]));
    }
    return files;
  }

  private createThemeFile(mode: string, tokens: object) {
    const isGlobal = mode === this.walker.getModes().defaultMode && this.config.useCssVars;
    const content = isGlobal
      ? [
          `import { createGlobalStyle } from 'styled-components';`,
          `export const GlobalThemeStyle = createGlobalStyle\`\n${serializeObjectToCSS(tokens, ':root')}\n\``,
        ].join('\n')
      : [`export const ${mode}ThemeValues = ${serializeObject(tokens)};`].join('\n');

    return {
      path: join(this.config.outDir, `${mode}.${this.config.useTs ? 'ts' : 'js'}`),
      content: content,
    };
  }

  private createStylesFile(styles: string[]) {
    const content = [`import { css } from 'styled-components';\n`, styles.join('\n')].join('\n');
    return {
      path: join(this.config.outDir, `styles.${this.config.useTs ? 'ts' : 'js'}`),
      content,
    };
  }
}

export function styledComponentsPlugin(config: StyledComponentsPluginConfig = {}): TokensManagerPlugin {
  return {
    name: 'styled-components',
    async build(manager) {
      const plugin = new StyledComponentsPlugin(
        {
          outDir: '',
          useCssVars: false,
          useTs: false,
          ...config,
        },
        manager,
      );
      return plugin.run();
    },
  };
}
