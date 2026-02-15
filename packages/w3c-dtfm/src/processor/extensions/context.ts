import type { TokenType } from "../../types";
import type {
  ExtensionContext,
  ExtensionLogger,
  ProcessedToken,
  ProcessorModes,
  ProcessorWarning,
  ProcessorError,
  TokenProcessorInterface,
} from "../types";

/**
 * Type for normalize value function
 */
type NormalizeValueFn = (value: unknown, type: TokenType) => unknown;

/**
 * Type for resolve alias function
 */
type ResolveAliasFn = (alias: string) => unknown;

/**
 * Type for get token function
 */
type GetTokenFn = (path: string) => ProcessedToken | undefined;

/**
 * Implementation of ExtensionLogger
 */
export class ExtensionLoggerImpl implements ExtensionLogger {
  private extensionName: string;
  private warnings: ProcessorWarning[];
  private errors: ProcessorError[];
  private debugEnabled: boolean;

  constructor(
    extensionName: string,
    warnings: ProcessorWarning[],
    errors: ProcessorError[],
    debugEnabled = false,
  ) {
    this.extensionName = extensionName;
    this.warnings = warnings;
    this.errors = errors;
    this.debugEnabled = debugEnabled;
  }

  debug(message: string): void {
    if (this.debugEnabled) {
      console.debug(`[${this.extensionName}] ${message}`);
    }
  }

  info(message: string): void {
    console.info(`[${this.extensionName}] ${message}`);
  }

  warn(message: string, path?: string): void {
    this.warnings.push({
      message: `[${this.extensionName}] ${message}`,
      path,
    });
  }

  error(message: string, path?: string): void {
    this.errors.push({
      message: `[${this.extensionName}] ${message}`,
      path,
    });
  }
}

/**
 * Implementation of ExtensionContext
 */
export class ExtensionContextImpl implements ExtensionContext {
  readonly processor: TokenProcessorInterface;
  readonly modes: ProcessorModes;
  readonly state: Map<string, unknown>;
  readonly logger: ExtensionLogger;

  private _resolveAlias: ResolveAliasFn;
  private _normalizeValue: NormalizeValueFn;
  private _getToken: GetTokenFn;

  constructor(
    processor: TokenProcessorInterface,
    modes: ProcessorModes,
    resolveAlias: ResolveAliasFn,
    normalizeValue: NormalizeValueFn,
    getToken: GetTokenFn,
    logger: ExtensionLogger,
    state?: Map<string, unknown>,
  ) {
    this.processor = processor;
    this.modes = modes;
    this.state = state ?? new Map();
    this.logger = logger;
    this._resolveAlias = resolveAlias;
    this._normalizeValue = normalizeValue;
    this._getToken = getToken;
  }

  resolveAlias(alias: string): unknown {
    return this._resolveAlias(alias);
  }

  normalizeValue(value: unknown, type: TokenType): unknown {
    return this._normalizeValue(value, type);
  }

  getToken(path: string): ProcessedToken | undefined {
    return this._getToken(path);
  }

  /**
   * Add a warning (shorthand for logger.warn)
   */
  warn(message: string, path?: string): void {
    this.logger.warn(message, path);
  }

  /**
   * Add an error (shorthand for logger.error)
   */
  error(message: string, path?: string): void {
    this.logger.error(message, path);
  }
}

/**
 * Create an extension context
 */
export function createExtensionContext(
  processor: TokenProcessorInterface,
  modes: ProcessorModes,
  extensionName: string,
  resolveAlias: ResolveAliasFn,
  normalizeValue: NormalizeValueFn,
  getToken: GetTokenFn,
  warnings: ProcessorWarning[],
  errors: ProcessorError[],
  sharedState?: Map<string, unknown>,
): ExtensionContext {
  const logger = new ExtensionLoggerImpl(extensionName, warnings, errors);
  return new ExtensionContextImpl(
    processor,
    modes,
    resolveAlias,
    normalizeValue,
    getToken,
    logger,
    sharedState,
  );
}
