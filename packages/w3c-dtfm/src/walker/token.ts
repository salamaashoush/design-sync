import { camelCase } from '@design-sync/utils';
import { tokenPathToStyleName } from '../css';
import type { DerefToken, DesignToken, TokenType } from '../types';
import type { DesignTokenValueByMode, TokensWalkerAction } from './types';
import { getModeNormalizeValue, getModeRawValue } from './utils';
import type { TokensWalker } from './walker';

export class WalkerDesignToken {
  #valueByMode?: DesignTokenValueByMode;
  #normalizedValue?: DerefToken<DesignToken>['$value'];
  #rawValue?: DesignToken['$value'];

  public isResponsive = false;
  public isGenerated = false;
  public defaultMode: string;
  public requiredModes: string[];
  public parentPath: string;
  constructor(
    public path: string,
    public raw: DesignToken,
    private walker: TokensWalker,
  ) {
    const { defaultMode, requiredModes } = walker.getModes();
    this.defaultMode = defaultMode;
    this.requiredModes = requiredModes;
    this.parentPath = path.split('.').slice(0, -1).join('.');
  }

  get name() {
    return this.raw.$name || this.raw.$title;
  }

  get type(): TokenType {
    return this.raw.$type;
  }

  get extensions(): Record<string, unknown> | undefined {
    return this.raw.$extensions;
  }

  get description(): string | undefined {
    return this.raw.$description;
  }

  get rawValue(): DesignToken['$value'] {
    if (!this.#rawValue) {
      this.#rawValue = getModeRawValue(this.valueByMode, this.defaultMode);
    }
    return this.#rawValue;
  }

  get valueByMode(): DesignTokenValueByMode {
    if (!this.#valueByMode) {
      this.#valueByMode = this.walker.buildTokenValueByMode(this.raw, this.path);
    }
    return this.#valueByMode;
  }

  get normalizedValue(): DerefToken<DesignToken>['$value'] {
    if (!this.#normalizedValue) {
      this.#normalizedValue = getModeNormalizeValue(this.valueByMode, this.defaultMode);
    }
    return this.#normalizedValue;
  }

  getStyleName(transform = camelCase, count?: number): string {
    const name = this.name ?? tokenPathToStyleName(this.path, count, transform);
    return typeof transform === 'function' ? transform(name) : name;
  }

  getRawValueByMode(mode: string): DerefToken<DesignToken>['$value'] {
    return getModeRawValue(this.valueByMode, mode);
  }

  getNormalizeValueByMode(mode: string): DerefToken<DesignToken>['$value'] {
    return getModeNormalizeValue(this.valueByMode, mode);
  }

  derefValue(): DerefToken<DesignToken>['$value'] {
    return this.walker.derefTokenValue(this.raw.$value);
  }

  hasSchemaExtensions(): boolean {
    return this.walker.hasSchemaExtensions(this.path, this.raw);
  }

  applyTokenAction(action: TokensWalkerAction): void {
    if (action.type === 'remove') {
      return;
    }
    this.#valueByMode = action.payload as DesignTokenValueByMode;
    this.#normalizedValue = getModeNormalizeValue(this.#valueByMode, this.defaultMode);
    this.#rawValue = getModeRawValue(this.#valueByMode, this.defaultMode);
    this.isGenerated = true;
    this.isResponsive = action.isResponsive ?? false;
  }
}
