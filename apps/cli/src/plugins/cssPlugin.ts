import { kebabCase, set } from '@design-sync/utils';
import {
  ProcessedDesignToken,
  getModeRawValue,
  isTokenAlias,
  processCssVarRef,
  serializeObjectToCSS,
  tokenAliasToCssVarName,
  tokenValueToCss,
  typographyToCssStyle,
} from '@design-sync/w3c-dtfm';
import { join } from 'node:path';
import { TokensManager, TokensManagerPlugin, TokensManagerPluginFile } from '../manager';

interface CSSPluginConfig {
  selectors?: string | string[] | Record<string, string | string[]>;
  typographyAsFontProperty?: boolean;
  extractAsStyle?: string[];
  outDir?: string;
}

function getClassName(path: string) {
  const parts = path.split('.');
  if (path.includes('@')) {
    // get the last two parts
    return kebabCase(
      parts
        .slice(parts.length - 3)
        .join('-')
        .replace('-@', '-'),
    );
  }

  return kebabCase(parts.pop()!);
}

class CSSPlugin {
  private tokens: Record<string, Record<string, string>> = {};
  private styles: string[] = [];

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

  private createCssVar(token: ProcessedDesignToken) {
    const { defaultMode, requiredModes } = this.walker.getModes();
    const { raw, type, fullPath, valueByMode } = token;

    const varName = tokenAliasToCssVarName(fullPath);
    // add the token to the tokens contract
    const defaultValue = processCssVarRef(tokenValueToCss(raw, type));
    // set the default value in the default mode
    set(this.tokens[defaultMode], varName, defaultValue);
    for (const mode of requiredModes) {
      const rawValue = getModeRawValue(valueByMode, mode);
      if (rawValue) {
        set(this.tokens[mode], varName, processCssVarRef(tokenValueToCss(rawValue, type)));
      }
    }
  }

  private createCssClass(token: ProcessedDesignToken) {
    const { raw, fullPath } = token;
    const style = typographyToCssStyle(raw);
    if (isTokenAlias(style)) {
      return '';
    }
    const className = getClassName(fullPath);
    for (const [key, value] of Object.entries(style)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (style as any)[key] = processCssVarRef(value);
    }
    const classCode = serializeObjectToCSS(style, `.${className}`);

    this.styles.push(classCode);
  }

  private getStylesFiles() {
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
    this.walker.walk((token) => {
      if (generateClassFor.includes(token.type)) {
        this.createCssClass(token);
      } else {
        this.createCssVar(token);
      }
    });
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
