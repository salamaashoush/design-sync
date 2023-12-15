import { TokensManager, TokensManagerPlugin, TokensManagerPluginFile } from '@design-sync/manager';
import { kebabCase, set } from '@design-sync/utils';
import {
  DesignTokenValueByMode,
  WalkerDesignToken,
  getModeRawValue,
  isTokenAlias,
  pathToCssVarName,
  processCssVarRef,
  serializeObjectToCSS,
  tokenPathToStyleName,
  tokenValueToCss,
  typographyToCssStyle,
} from '@design-sync/w3c-dtfm';
import { join } from 'node:path';

interface CSSPluginConfig {
  selectors?: string | string[] | Record<string, string | string[]>;
  typographyAsFontProperty?: boolean;
  extractAsStyle?: string[];
  outDir?: string;
}

class CSSPlugin {
  private tokens: Record<string, Record<string, string>> = {};
  private styles: string[] = [];
  private mediaQueries = new Map<string, string[]>();

  constructor(
    private config: CSSPluginConfig,
    private manager: TokensManager,
  ) {
    const { defaultMode, requiredModes } = this.walker.getModes();
    this.tokens[defaultMode] = {};
    for (const mode of requiredModes) {
      this.tokens[mode] = {};
    }
  }
  get walker() {
    return this.manager.getWalker();
  }

  private createCssVar(token: WalkerDesignToken) {
    const { defaultMode, requiredModes } = this.walker.getModes();
    const { rawValue, type, path, valueByMode } = token;

    const varName = pathToCssVarName(path);
    // add the token to the tokens contract
    const defaultValue = processCssVarRef(tokenValueToCss(rawValue, type));
    // set the default value in the default mode
    set(this.tokens[defaultMode], varName, defaultValue);
    for (const mode of requiredModes) {
      const rawModeValue = getModeRawValue(valueByMode, mode);
      if (rawModeValue) {
        set(this.tokens[mode], varName, processCssVarRef(tokenValueToCss(rawModeValue, type)));
      }
    }
  }
  private processCssStyleObject(style: Record<string, string | number>) {
    for (const [key, value] of Object.entries(style)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (style as any)[key] = processCssVarRef(value);
    }
    return style;
  }
  private createCssClass(token: WalkerDesignToken) {
    const { defaultMode } = this.walker.getModes();
    const { rawValue, path, isResponsive, valueByMode } = token;
    const selector = `.${tokenPathToStyleName(path, kebabCase)}`;
    let baseStyle = {};
    if (isResponsive) {
      baseStyle = typographyToCssStyle(getModeRawValue(valueByMode.base as DesignTokenValueByMode, defaultMode));
      if (!isTokenAlias(baseStyle)) {
        baseStyle = this.processCssStyleObject(baseStyle);
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
        this.mediaQueries.set(breakpoint, [
          ...(this.mediaQueries.get(breakpoint) ?? []),
          serializeObjectToCSS(Object.fromEntries(filteredEntries), selector),
        ]);
      }
    } else {
      const style = typographyToCssStyle(rawValue);
      if (isTokenAlias(style)) {
        return '';
      }
      baseStyle = this.processCssStyleObject(style);
    }

    const classCode = serializeObjectToCSS(baseStyle, selector);
    this.styles.push(classCode);
  }

  private getStylesFiles() {
    for (const [breakpoint, styles] of this.mediaQueries.entries()) {
      this.styles.push(`${breakpoint} {\n${styles.join('\n')}\n}`);
    }
    return this.styles.length === 0
      ? []
      : [
          {
            path: join(this.config.outDir ?? '', 'styles.css'),
            content: this.styles.join('\n'),
          },
        ];
  }
  private getModeSelectors(mode: string) {
    const defaultSelectors = [':root'];
    const { selectors } = this.config;
    if (!selectors) {
      return defaultSelectors;
    }

    if (Array.isArray(selectors)) {
      return selectors;
    }

    if (typeof selectors === 'string') {
      return [selectors];
    }
    const modeSelectors = selectors[mode] ?? defaultSelectors;
    return Array.isArray(modeSelectors) ? modeSelectors : [modeSelectors];
  }
  private getThemeFile(mode: string, tokens: object) {
    const selectors = this.getModeSelectors(mode);
    return {
      path: join(this.config.outDir ?? '', `${mode}.css`),
      content: selectors.map((selector) => serializeObjectToCSS(tokens, selector)).join('\n'),
    };
  }

  private getFiles() {
    const { requiredModes, defaultMode } = this.walker.getModes();
    // 1. emit styles file
    const files: TokensManagerPluginFile[] = this.getStylesFiles();

    // 2. emit the tokens theme files
    for (const mode of requiredModes) {
      files.push(this.getThemeFile(mode, this.tokens[mode]));
    }

    // 3. emit the default theme file if it's not already written
    if (!requiredModes.includes(defaultMode)) {
      files.push(this.getThemeFile(defaultMode, this.tokens[defaultMode]));
    }
    return files;
  }

  async run() {
    const generateClassFor = (this.config.extractAsStyle ?? ['typography']).filter((type) =>
      this.config.typographyAsFontProperty ? type !== 'typography' : true,
    );
    for (const token of this.walker.getTokens()) {
      if (generateClassFor.includes(token.type)) {
        this.createCssClass(token);
      } else {
        this.createCssVar(token);
      }
    }
    return this.getFiles();
  }
}

export function cssPlugin(config: CSSPluginConfig = {}): TokensManagerPlugin {
  return {
    name: 'css-plugin',
    async build(manager) {
      const plugin = new CSSPlugin(
        {
          selectors: ':root',
          typographyAsFontProperty: false,
          extractAsStyle: ['typography'],
          outDir: '',
          ...config,
        },
        manager,
      );
      return plugin.run();
    },
  };
}
