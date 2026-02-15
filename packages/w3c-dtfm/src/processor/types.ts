import type {
  DesignToken,
  TokenType,
  Tokens,
  TokenAlias,
  W3CColorValue,
  W3CDimensionValue,
  W3CDurationValue,
  W3CCubicBezier,
  W3CFontFamily,
  W3CFontWeight,
  W3CStrokeStyle,
  W3CShadow,
  W3CBorder,
  W3CTransition,
  W3CGradient,
  W3CTypography,
  W3CIconValue,
  W3CAssetValue,
} from "../types";

/**
 * Mapping from token type to the raw value type (what users provide)
 */
export interface TokenValueMap {
  color: Tokens["color"];
  cubicBezier: Tokens["cubicBezier"];
  fontFamily: Tokens["fontFamily"];
  fontWeight: Tokens["fontWeight"];
  dimension: Tokens["dimension"];
  number: Tokens["number"];
  duration: Tokens["duration"];
  strokeStyle: Tokens["strokeStyle"];
  shadow: Tokens["shadow"] | Tokens["shadow"][];
  border: Tokens["border"];
  transition: Tokens["transition"];
  gradient: Tokens["gradient"];
  typography: Tokens["typography"];
  link: Tokens["link"];
  other: Tokens["other"];
  icon: Tokens["icon"];
  asset: Tokens["asset"];
}

/**
 * Mapping from token type to the normalized value type (after processing)
 */
export interface NormalizedValueMap {
  color: W3CColorValue | string;
  cubicBezier: W3CCubicBezier | number[];
  fontFamily: W3CFontFamily;
  fontWeight: W3CFontWeight;
  dimension: W3CDimensionValue | string;
  number: number;
  duration: W3CDurationValue | string;
  strokeStyle: W3CStrokeStyle;
  shadow: W3CShadow[];
  border: W3CBorder | string;
  transition: W3CTransition | string;
  gradient: W3CGradient | string;
  typography: W3CTypography | string;
  link: string;
  other: unknown;
  icon: W3CIconValue | string;
  asset: W3CAssetValue | string;
}

/**
 * Mode values for a token - maps mode name to normalized value
 */
export type ModeValues<T extends TokenType = TokenType> = Record<string, NormalizedValueMap[T]>;

/**
 * Token filter predicate
 */
export type TokenFilterPredicate<T extends ProcessedToken = ProcessedToken> = (token: T) => boolean;

/**
 * Token filter object with property filters
 */
export interface TokenFilterObject {
  type?: TokenType | TokenType[];
  path?: string | string[] | RegExp;
  group?: string | RegExp;
  deprecated?: boolean;
  hasExtension?: string;
  generated?: boolean;
  hasMode?: string;
}

/**
 * Token filter - can be type, path pattern, or predicate
 */
export type TokenFilter =
  | "*"
  | TokenType
  | TokenType[]
  | string
  | RegExp
  | TokenFilterObject
  | TokenFilterPredicate;

/**
 * Processor options - minimal, sensible defaults
 */
export interface ProcessorOptions {
  /** Default mode name (default: 'default') */
  defaultMode?: string;
  /** Required modes that tokens should have values for */
  requiredModes?: string[];
  /** Token filter to only process matching tokens */
  filter?: TokenFilter;
  /** Custom value overrides by token path */
  overrides?: Record<string, (mode: string, token: DesignToken, path: string) => unknown>;
  /** Extensions to run */
  extensions?: ProcessorExtension[];
  /** Disable builtin extensions (color-modifiers, color-generators) */
  disableBuiltinExtensions?: boolean;
}

/**
 * Processing result
 */
export interface ProcessorResult {
  success: boolean;
  tokenCount: number;
  warnings: ProcessorWarning[];
  errors: ProcessorError[];
}

/**
 * Warning during processing
 */
export interface ProcessorWarning {
  message: string;
  path?: string;
}

/**
 * Error during processing
 */
export interface ProcessorError {
  message: string;
  path?: string;
  cause?: Error;
}

/**
 * Processor metadata
 */
export interface ProcessorMeta {
  tokenCount: number;
  processedAt: Date;
  detectedFormat: "legacy" | "w3c" | "mixed" | "unknown";
  extensionsRun: string[];
  warnings: ProcessorWarning[];
  errors: ProcessorError[];
}

/**
 * Modes interface
 */
export interface ProcessorModes {
  readonly defaultMode: string;
  readonly requiredModes: readonly string[];
  readonly availableModes: readonly string[];
  hasMode(mode: string): boolean;
}

/**
 * Extension logger
 */
export interface ExtensionLogger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string, path?: string): void;
  error(message: string, path?: string): void;
}

/**
 * Extension context
 */
export interface ExtensionContext {
  readonly processor: TokenProcessorInterface;
  readonly modes: ProcessorModes;
  readonly state: Map<string, unknown>;
  readonly logger: ExtensionLogger;
  resolveAlias(alias: string): unknown;
  normalizeValue(value: unknown, type: TokenType): unknown;
  getToken(path: string): ProcessedToken | undefined;
}

/**
 * Token actions for extensions
 */
export interface AddTokenAction {
  type: "add";
  path: string;
  token: {
    $type: TokenType;
    $value: unknown;
    $description?: string;
    $extensions?: Record<string, unknown>;
  };
  modeValues?: Record<string, unknown>;
  generatedBy?: string;
}

export interface UpdateTokenAction {
  type: "update";
  path: string;
  modeValues: Record<string, unknown>;
}

export interface RemoveTokenAction {
  type: "remove";
  paths: string[];
}

export type TokenAction = AddTokenAction | UpdateTokenAction | RemoveTokenAction;

/**
 * Extension phase determines when the extension runs in the processing pipeline:
 * - "schema": Runs on raw token tree BEFORE alias resolution.
 *   Use for extensions that generate new tokens (e.g., color alpha variants).
 * - "token": Runs on processed tokens AFTER alias resolution.
 *   Use for extensions that transform existing token values.
 */
export type ExtensionPhase = "schema" | "token";

/**
 * Context for schema-phase extensions that operate on the raw token tree
 */
export interface SchemaExtensionContext {
  readonly modes: ProcessorModes;
  readonly logger: ExtensionLogger;
  /** Add a new token to the tree */
  addToken(path: string, token: DesignToken): void;
  /** Get a token from the tree by path */
  getToken(path: string): DesignToken | undefined;
  /** Get the mode value for a token */
  getModeValue(token: DesignToken, mode: string): unknown;
  /** Normalize a value for a given type */
  normalizeValue(value: unknown, type: TokenType): unknown;
}

/**
 * Processor extension
 */
export interface ProcessorExtension {
  name: string;
  filter?: TokenFilter;
  priority?: number;

  /**
   * Extension phase:
   * - "schema": Runs BEFORE alias resolution on raw token tree (for generators)
   * - "token": Runs AFTER alias resolution on processed tokens (for modifiers)
   * @default "token"
   */
  phase?: ExtensionPhase;

  /** Called once when the extension pipeline initializes */
  onInit?(context: ExtensionContext): Promise<void> | void;

  /**
   * Schema phase: Called for each token in the raw tree BEFORE alias resolution.
   * Use this to generate new tokens that other tokens can reference.
   */
  onSchemaToken?(path: string, token: DesignToken, context: SchemaExtensionContext): void;

  /**
   * Token phase: Called for each processed token AFTER alias resolution.
   * Use this to transform token values.
   */
  onToken?(
    token: ProcessedToken,
    context: ExtensionContext,
  ): Promise<TokenAction[]> | TokenAction[] | void;

  onPostProcess?(
    tokens: ProcessedToken[],
    context: ExtensionContext,
  ): Promise<TokenAction[]> | TokenAction[] | void;
  onComplete?(context: ExtensionContext): Promise<void> | void;
  onError?(error: Error, context: ExtensionContext): Promise<void> | void;
}

/**
 * Processed token with type narrowing support
 */
export interface ProcessedToken<T extends TokenType = TokenType> {
  readonly path: string;
  readonly type: T;
  readonly name: string;
  readonly group: string;

  readonly rawValue: TokenValueMap[T] | TokenAlias;
  readonly value: NormalizedValueMap[T];
  readonly modeValues: ModeValues<T>;

  readonly description?: string;
  readonly isDeprecated: boolean;
  readonly deprecationMessage?: string;
  readonly isGenerated: boolean;
  readonly generatedBy?: string;
  readonly extensions?: Record<string, unknown>;

  readonly defaultMode: string;
  readonly requiredModes: readonly string[];
  readonly isMultiMode: boolean;
  readonly raw: DesignToken;

  getValue(mode?: string): NormalizedValueMap[T];
  getRawValue(mode?: string): TokenValueMap[T] | TokenAlias;
  hasExtension(name: string): boolean;
  getExtension<E = unknown>(name: string): E | undefined;
  toCSSVar(prefix?: string): string;
  toCSS(mode?: string): string;
}

/**
 * Token query builder with type narrowing
 */
export interface TokenQueryBuilder<T extends ProcessedToken = ProcessedToken> {
  ofType<K extends TokenType>(type: K): TokenQueryBuilder<ProcessedToken<K>>;
  ofTypes<K extends TokenType[]>(...types: K): TokenQueryBuilder<ProcessedToken<K[number]>>;

  matching(pattern: string | RegExp): TokenQueryBuilder<T>;
  inGroup(groupPath: string): TokenQueryBuilder<T>;
  startsWith(prefix: string): TokenQueryBuilder<T>;

  where(predicate: (token: T) => boolean): TokenQueryBuilder<T>;
  deprecated(): TokenQueryBuilder<T>;
  notDeprecated(): TokenQueryBuilder<T>;
  withExtension(name: string): TokenQueryBuilder<T>;
  generated(): TokenQueryBuilder<T>;
  hasMode(mode: string): TokenQueryBuilder<T>;

  or(other: TokenQueryBuilder<ProcessedToken>): TokenQueryBuilder<T>;
  and(other: TokenQueryBuilder<ProcessedToken>): TokenQueryBuilder<T>;
  not(): TokenQueryBuilder<T>;

  sortByPath(order?: "asc" | "desc"): TokenQueryBuilder<T>;
  sortBy(compareFn: (a: T, b: T) => number): TokenQueryBuilder<T>;
  take(count: number): TokenQueryBuilder<T>;
  skip(count: number): TokenQueryBuilder<T>;

  toArray(): T[];
  toIterator(): IterableIterator<T>;
  toMap(): Map<string, T>;
  groupByType(): Map<TokenType, T[]>;
  first(): T | undefined;
  count(): number;
  exists(): boolean;
  forEach(callback: (token: T) => void): void;
  map<U>(mapper: (token: T) => U): U[];
  reduce<U>(reducer: (acc: U, token: T) => U, initial: U): U;
}

/**
 * Token processor interface
 */
export interface TokenProcessorInterface {
  process(): Promise<ProcessorResult>;
  query(): TokenQueryBuilder<ProcessedToken>;
  tokens(): IterableIterator<ProcessedToken>;
  get(path: string): ProcessedToken | undefined;
  has(path: string): boolean;
  readonly size: number;
  readonly modes: ProcessorModes;
  readonly meta: ProcessorMeta;
  use(extension: ProcessorExtension | ProcessorExtension[]): this;
  clone(options?: Partial<ProcessorOptions>): TokenProcessorInterface;
  reprocess(): Promise<ProcessorResult>;
  setTokens(tokens: Record<string, unknown>): void;
}
