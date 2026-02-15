import type { DesignToken, TokenAlias, TokenType } from "../types";
import { pathToCssVarName, tokenValueToCss } from "../css";
import { getDeprecationMessage, isDeprecatedToken, isTokenAlias } from "../guards";
import type {
  ModeValues,
  NormalizedValueMap,
  ProcessedToken,
  ProcessorModes,
  TokenValueMap,
} from "./types";

/**
 * Function type for normalizing a value
 */
type NormalizeValueFn = (value: unknown, type: TokenType) => unknown;

/**
 * Internal implementation of ProcessedToken with lazy evaluation
 */
export class ProcessedTokenImpl<T extends TokenType = TokenType> implements ProcessedToken<T> {
  readonly path: string;
  readonly name: string;
  readonly group: string;
  readonly raw: DesignToken;
  readonly type: T;

  readonly isGenerated: boolean;
  readonly generatedBy?: string;

  private _modeValues: ModeValues<T>;
  private _cachedValue?: NormalizedValueMap[T];
  private _modes: ProcessorModes;
  private _normalizeValue: NormalizeValueFn;

  constructor(
    path: string,
    raw: DesignToken,
    modeValues: Record<string, unknown>,
    modes: ProcessorModes,
    normalizeValue: NormalizeValueFn,
    options?: { isGenerated?: boolean; generatedBy?: string },
  ) {
    this.path = path;
    this.raw = raw;
    this.type = raw.$type as T;
    this._modeValues = modeValues as ModeValues<T>;
    this._modes = modes;
    this._normalizeValue = normalizeValue;
    this.isGenerated = options?.isGenerated ?? false;
    this.generatedBy = options?.generatedBy;

    // Extract name and group from path
    const parts = path.split(".");
    this.name = parts[parts.length - 1];
    this.group = parts.slice(0, -1).join(".");
  }

  get rawValue(): TokenValueMap[T] | TokenAlias {
    return this.raw.$value as TokenValueMap[T] | TokenAlias;
  }

  get value(): NormalizedValueMap[T] {
    if (this._cachedValue === undefined) {
      this._cachedValue = this.getValue(this._modes.defaultMode);
    }
    return this._cachedValue;
  }

  get modeValues(): ModeValues<T> {
    return this._modeValues;
  }

  get description(): string | undefined {
    return this.raw.$description;
  }

  get isDeprecated(): boolean {
    return isDeprecatedToken(this.raw);
  }

  get deprecationMessage(): string | undefined {
    return getDeprecationMessage(this.raw);
  }

  get extensions(): Record<string, unknown> | undefined {
    return this.raw.$extensions;
  }

  get defaultMode(): string {
    return this._modes.defaultMode;
  }

  get requiredModes(): readonly string[] {
    return this._modes.requiredModes;
  }

  get isMultiMode(): boolean {
    return Object.keys(this._modeValues).length > 1;
  }

  getValue(mode?: string): NormalizedValueMap[T] {
    const targetMode = mode ?? this._modes.defaultMode;
    const rawModeValue = this._modeValues[targetMode];

    if (rawModeValue !== undefined) {
      return rawModeValue as NormalizedValueMap[T];
    }

    // Fall back to default mode
    return this._modeValues[this._modes.defaultMode] as NormalizedValueMap[T];
  }

  getRawValue(mode?: string): TokenValueMap[T] | TokenAlias {
    // For raw value, we access the original token value for the specified mode
    // Mode-specific raw values are stored in the mode extension
    const targetMode = mode ?? this._modes.defaultMode;

    // Check if there's a mode extension
    if (this.raw.$extensions?.mode && typeof this.raw.$extensions.mode === "object") {
      const modeExtension = this.raw.$extensions.mode as Record<string, unknown>;
      if (targetMode in modeExtension) {
        return modeExtension[targetMode] as TokenValueMap[T] | TokenAlias;
      }
    }

    return this.raw.$value as TokenValueMap[T] | TokenAlias;
  }

  hasExtension(name: string): boolean {
    return this.raw.$extensions !== undefined && name in this.raw.$extensions;
  }

  getExtension<E = unknown>(name: string): E | undefined {
    if (!this.raw.$extensions) {
      return undefined;
    }
    return this.raw.$extensions[name] as E | undefined;
  }

  toCSSVar(prefix?: string): string {
    return `var(${pathToCssVarName(this.path, prefix)})`;
  }

  toCSS(mode?: string): string {
    const modeValue = this.getValue(mode);

    // If the value is a token alias, return the path
    if (isTokenAlias(modeValue)) {
      return modeValue;
    }

    const result = tokenValueToCss(modeValue as DesignToken["$value"], this.type);
    return String(result);
  }

  /**
   * Update mode values (used internally by processor)
   */
  _updateModeValues(modeValues: Record<string, unknown>): void {
    this._modeValues = modeValues as ModeValues<T>;
    this._cachedValue = undefined;
  }

  /**
   * Set a single mode value
   */
  _setModeValue(mode: string, value: unknown): void {
    this._modeValues[mode] = value as NormalizedValueMap[T];
    if (mode === this._modes.defaultMode) {
      this._cachedValue = undefined;
    }
  }
}

/**
 * Create a ProcessedToken instance
 */
export function createProcessedToken<T extends TokenType>(
  path: string,
  raw: DesignToken,
  modeValues: Record<string, unknown>,
  modes: ProcessorModes,
  normalizeValue: NormalizeValueFn,
  options?: { isGenerated?: boolean; generatedBy?: string },
): ProcessedToken<T> {
  return new ProcessedTokenImpl<T>(path, raw, modeValues, modes, normalizeValue, options);
}
