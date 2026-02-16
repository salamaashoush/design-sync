import { isObject, set, get } from "@design-sync/utils";
import { normalizeReference } from "../alias";
import { detectTokenFormat } from "../format/detector";
import { migrateTokens } from "../format/migrate";
import { processGroups, usesGroupFeatures } from "../groups";
import { isDesignToken, isTokenAlias } from "../guards";
import { resolveAllTypes } from "../inference";
import { normalizeBorderValue } from "../normalize/border";
import { normalizeColorValue } from "../normalize/color";
import { normalizeDimensionValue } from "../normalize/dimension";
import { normalizeDurationValue } from "../normalize/duration";
import { normalizeGradientValue } from "../normalize/gradient";
import { normalizeShadowValue } from "../normalize/shadow";
import { normalizeStrokeStyleValue } from "../normalize/stroke";
import { normalizeCubicBezierValue, normalizeTransitionValue } from "../normalize/transition";
import {
  normalizeFontFamilyValue,
  normalizeFontWeightValue,
  normalizeTypographyValue,
} from "../normalize/typography";
import { resolveTokens } from "../resolver";
import type { DesignToken, TokenType } from "../types";
import {
  applyTokenActions,
  createContextFactory,
  createExtensionPipeline,
  getBuiltinExtensions,
  type ExtensionPipeline,
} from "./extensions";
import { compileFilter, type CompiledFilter } from "./filter";
import { createProcessorModes, extractModeValuesFromToken, type ProcessorModesImpl } from "./modes";
import { createQueryBuilder } from "./query";
import { createProcessedToken, ProcessedTokenImpl } from "./token";
import type {
  AddTokenAction,
  ProcessedToken,
  ProcessorError,
  ProcessorMeta,
  ProcessorModes,
  ProcessorOptions,
  ProcessorResult,
  ProcessorWarning,
  SchemaExtensionContext,
  TokenProcessorInterface,
  TokenQueryBuilder,
  UpdateTokenAction,
} from "./types";

/**
 * Normalize a token value based on its type
 */
function normalizeValue(value: unknown, type: TokenType): unknown {
  if (isTokenAlias(value)) {
    return value;
  }

  switch (type) {
    case "color":
      return normalizeColorValue(value);
    case "dimension":
      return normalizeDimensionValue(value);
    case "duration":
      return normalizeDurationValue(value);
    case "border":
      return normalizeBorderValue(value);
    case "shadow":
      return normalizeShadowValue(value);
    case "gradient":
      return normalizeGradientValue(value);
    case "transition":
      return normalizeTransitionValue(value);
    case "cubicBezier":
      return normalizeCubicBezierValue(value);
    case "strokeStyle":
      return normalizeStrokeStyleValue(value);
    case "fontFamily":
      return normalizeFontFamilyValue(value);
    case "fontWeight":
      return normalizeFontWeightValue(value);
    case "typography":
      return normalizeTypographyValue(value);
    case "number":
      return typeof value === "number" ? value : Number(value);
    case "link":
    case "other":
    default:
      return value;
  }
}

/**
 * Walk a token tree and extract all design tokens
 */
function walkTokens(
  tokens: Record<string, unknown>,
  callback: (path: string, token: DesignToken) => void,
  parentPath = "",
  inheritedType?: TokenType,
): void {
  for (const [key, value] of Object.entries(tokens)) {
    if (key.startsWith("$")) {
      continue;
    }

    const currentPath = parentPath ? `${parentPath}.${key}` : key;

    if (isDesignToken(value)) {
      callback(currentPath, value);
    } else if (isObject(value)) {
      const groupType = "$type" in value ? (value.$type as TokenType) : inheritedType;

      if ("$value" in value && groupType) {
        const valueObj = value as Record<string, unknown>;
        const token: Record<string, unknown> = {
          $value: valueObj.$value,
          $type: groupType,
        };
        if (valueObj.$description !== undefined) {
          token.$description = valueObj.$description;
        }
        if (valueObj.$extensions !== undefined) {
          token.$extensions = valueObj.$extensions;
        }
        if ("$deprecated" in valueObj) {
          token.$deprecated = valueObj.$deprecated;
        }
        callback(currentPath, token as unknown as DesignToken);
      } else {
        walkTokens(value as Record<string, unknown>, callback, currentPath, groupType);
      }
    }
  }
}

/**
 * W3C Design Token Processor
 *
 * Implements the W3C Design Token Format Module spec:
 * - Type inheritance (explicit > reference > group inheritance)
 * - Group features ($extends, $root)
 * - Alias resolution (4-stage resolver algorithm)
 * - Value normalization to W3C format
 *
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-resolver-20251028/
 */
export class TokenProcessor implements TokenProcessorInterface {
  private rawTokens: Record<string, unknown>;
  private processedTokens?: Record<string, unknown>;
  private options: ProcessorOptions;
  private tokenMap = new Map<string, ProcessedToken>();
  private _modes: ProcessorModesImpl;
  private _meta: ProcessorMeta;
  private pipeline: ExtensionPipeline;
  private filter: CompiledFilter;
  private processed = false;
  private warnings: ProcessorWarning[] = [];
  private errors: ProcessorError[] = [];

  constructor(tokens: Record<string, unknown>, options: ProcessorOptions = {}) {
    this.rawTokens = tokens;
    this.options = options;
    this._modes = createProcessorModes({
      default: options.defaultMode,
      required: options.requiredModes,
    });
    this.filter = compileFilter(options.filter);
    this.pipeline = createExtensionPipeline();
    this._meta = this.createInitialMeta();

    if (!options.disableBuiltinExtensions) {
      this.pipeline.addAll(getBuiltinExtensions());
    }

    if (options.extensions) {
      this.pipeline.addAll(options.extensions);
    }
  }

  private createInitialMeta(): ProcessorMeta {
    return {
      tokenCount: 0,
      processedAt: new Date(),
      detectedFormat: "unknown",
      extensionsRun: [],
      warnings: [],
      errors: [],
    };
  }

  private resolveAlias(alias: string): unknown {
    const path = normalizeReference(alias);
    const token = this.tokenMap.get(path);
    if (token) {
      return token.value;
    }

    if (this.processedTokens) {
      const parts = path.split(".");
      let current: unknown = this.processedTokens;
      for (const part of parts) {
        if (!isObject(current)) return undefined;
        current = (current as Record<string, unknown>)[part];
      }
      if (isDesignToken(current)) {
        return current.$value;
      }
    }

    return undefined;
  }

  private normalizeValueForType(value: unknown, type: TokenType): unknown {
    return normalizeValue(value, type);
  }

  private buildModeValues(token: DesignToken, path: string): Record<string, unknown> {
    const rawModeValues = extractModeValuesFromToken(token, this._modes);
    const normalizedModeValues: Record<string, unknown> = {};

    const override = this.options.overrides?.[path];

    for (const [mode, rawValue] of Object.entries(rawModeValues)) {
      let value: unknown;

      if (override) {
        value = override(mode, token, path);
      } else {
        value = rawValue;
      }

      if (!isTokenAlias(value)) {
        value = this.normalizeValueForType(value, token.$type);
      }

      normalizedModeValues[mode] = value;
    }

    return normalizedModeValues;
  }

  private createTokenFromAction(action: AddTokenAction): ProcessedToken {
    const token = {
      $type: action.token.$type,
      $value: action.token.$value,
      $description: action.token.$description,
      $extensions: action.token.$extensions,
    } as DesignToken;

    const modeValues = action.modeValues ?? {
      [this._modes.defaultMode]: action.token.$value,
    };

    return createProcessedToken(
      action.path,
      token,
      modeValues,
      this._modes,
      (v, t) => this.normalizeValueForType(v, t),
      {
        isGenerated: true,
        generatedBy: action.generatedBy,
      },
    );
  }

  private updateToken(token: ProcessedToken, action: UpdateTokenAction): void {
    if (token instanceof ProcessedTokenImpl) {
      token._updateModeValues(action.modeValues);
    }
  }

  private createContextFactory() {
    return createContextFactory(
      this,
      this._modes,
      (alias) => this.resolveAlias(alias),
      (value, type) => this.normalizeValueForType(value, type),
      (path) => this.get(path),
      this.warnings,
      this.errors,
      this.pipeline.getSharedState(),
    );
  }

  /**
   * Run schema-phase extensions on the raw token tree.
   * These extensions can add new tokens before alias resolution.
   */
  private async runSchemaExtensions(
    tokens: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    // Get all schema-phase extensions
    const schemaExtensions = this.pipeline.getSchemaExtensions();
    if (schemaExtensions.length === 0) {
      return tokens;
    }

    // Deep clone to avoid mutating the input
    const result = JSON.parse(JSON.stringify(tokens)) as Record<string, unknown>;

    // Create a context for schema extensions
    const createSchemaContext = (extensionName: string): SchemaExtensionContext => ({
      modes: this._modes,
      logger: {
        debug: (msg) => console.debug(`[${extensionName}] ${msg}`),
        info: (msg) => console.info(`[${extensionName}] ${msg}`),
        warn: (msg, path) => this.warnings.push({ message: `[${extensionName}] ${msg}`, path }),
        error: (msg, path) => this.errors.push({ message: `[${extensionName}] ${msg}`, path }),
      },
      addToken: (path: string, token: DesignToken) => {
        set(result, path, token);
      },
      getToken: (path: string): DesignToken | undefined => {
        const value = get(result, path);
        if (isDesignToken(value)) return value;
        // Handle tokens that inherit $type from a parent group
        if (isObject(value) && "$value" in value) {
          const parts = path.split(".");
          for (let i = parts.length - 1; i >= 0; i--) {
            const parentPath = parts.slice(0, i).join(".");
            const parent = parentPath ? get(result, parentPath) : result;
            if (isObject(parent) && "$type" in parent) {
              return { ...value, $type: parent.$type } as unknown as DesignToken;
            }
          }
        }
        return undefined;
      },
      getModeValue: (token: DesignToken, mode: string): unknown => {
        if (mode === this._modes.defaultMode) {
          return token.$value;
        }
        if (token.$extensions && isObject(token.$extensions) && "mode" in token.$extensions) {
          const modeExt = token.$extensions.mode as Record<string, unknown>;
          return modeExt[mode] ?? token.$value;
        }
        return token.$value;
      },
      normalizeValue: (value: unknown, type: TokenType) => this.normalizeValueForType(value, type),
    });

    // Run each schema extension
    for (const extension of schemaExtensions) {
      try {
        const context = createSchemaContext(extension.name);
        const filter = compileFilter(extension.filter);

        // Walk tokens and call onSchemaToken for matching tokens
        walkTokens(result, (path, token) => {
          // Create a temporary processed token for filter matching
          const tempToken = createProcessedToken(
            path,
            token,
            { [this._modes.defaultMode]: token.$value },
            this._modes,
            (v, t) => this.normalizeValueForType(v, t),
          );

          if (!filter(tempToken)) {
            return;
          }

          if (extension.onSchemaToken) {
            extension.onSchemaToken(path, token, context);

            // Write back mutations to the original tree node.
            // walkTokens may create a copy for inherited-type tokens,
            // so we sync changes ($value, $extensions) back to the tree.
            const original = get(result, path);
            if (isObject(original) && "$value" in original) {
              const orig = original as Record<string, unknown>;
              orig.$value = token.$value;
              if (token.$extensions) {
                orig.$extensions = token.$extensions;
              }
            }
          }
        });
      } catch (error) {
        this.errors.push({
          message: `[${extension.name}] Schema extension failed: ${error}`,
          cause: error instanceof Error ? error : undefined,
        });
      }
    }

    return result;
  }

  /**
   * Process tokens following W3C spec pipeline:
   * 1. Format detection & migration
   * 2. Groups processing ($extends, $root)
   * 3. Type inference (per W3C type inheritance rules)
   * 4. Schema extensions (generators create tokens before resolution)
   * 5. Alias resolution (4-stage resolver algorithm)
   * 6. Value normalization
   * 7. Token extensions (modifiers transform values after resolution)
   */
  async process(): Promise<ProcessorResult> {
    if (this.processed) {
      return this.createResult();
    }

    try {
      // 1. Format detection & auto-migration to W3C
      const format = detectTokenFormat(this.rawTokens);
      this._meta.detectedFormat = format;

      let tokens = this.rawTokens;
      if (format === "legacy" || format === "mixed") {
        const migrationResult = migrateTokens(tokens, { targetFormat: "w3c" });
        tokens = migrationResult.tokens;
        for (const warning of migrationResult.warnings) {
          this.warnings.push({ message: warning.message, path: warning.path });
        }
      }

      // 2. Groups processing ($extends, $root) per W3C spec
      const groupFeatures = usesGroupFeatures(tokens);
      if (groupFeatures.hasExtends || groupFeatures.hasRoot) {
        const groupsResult = processGroups(tokens);
        tokens = groupsResult.tokens;
        for (const error of groupsResult.errors) {
          this.errors.push({ message: error });
        }
      }

      // 3. Type inference (explicit > reference > inherited from parent group)
      tokens = resolveAllTypes(tokens);

      // 4. Schema extensions (generators, etc.) - runs on raw token tree
      tokens = await this.runSchemaExtensions(tokens);

      // 5. Alias resolution (W3C 4-stage resolver algorithm)
      const resolveResult = resolveTokens(tokens, {
        inferTypes: true,
        validateInput: false,
      });

      if (resolveResult.errors) {
        for (const error of resolveResult.errors) {
          this.errors.push({ message: error.message, path: error.path });
        }
      }
      if (resolveResult.warnings) {
        for (const warning of resolveResult.warnings) {
          this.warnings.push({ message: warning.message, path: warning.path });
        }
      }

      tokens = resolveResult.value ?? tokens;
      this.processedTokens = tokens;

      // 6. Walk and create ProcessedToken instances with normalization
      walkTokens(tokens, (path, token) => {
        const tempToken = createProcessedToken(
          path,
          token,
          { [this._modes.defaultMode]: token.$value },
          this._modes,
          (v, t) => this.normalizeValueForType(v, t),
        );

        if (!this.filter(tempToken)) {
          return;
        }

        const modeValues = this.buildModeValues(token, path);
        const processedToken = createProcessedToken(path, token, modeValues, this._modes, (v, t) =>
          this.normalizeValueForType(v, t),
        );

        this.tokenMap.set(path, processedToken);
      });

      // 7. Token extensions (modifiers, etc.) - runs on processed tokens
      const contextFactory = this.createContextFactory();

      await this.pipeline.runInit(contextFactory);

      const tokenActions: { path: string; actions: unknown[] }[] = [];
      for (const token of this.tokenMap.values()) {
        const actions = await this.pipeline.runOnToken(token, contextFactory);
        if (actions.length > 0) {
          tokenActions.push({ path: token.path, actions });
        }
      }

      for (const { actions } of tokenActions) {
        applyTokenActions(
          actions as AddTokenAction[],
          this.tokenMap,
          (action) => this.createTokenFromAction(action),
          (token, action) => this.updateToken(token, action),
        );
      }

      const allTokens = Array.from(this.tokenMap.values());
      const postActions = await this.pipeline.runPostProcess(allTokens, contextFactory);
      applyTokenActions(
        postActions,
        this.tokenMap,
        (action) => this.createTokenFromAction(action),
        (token, action) => this.updateToken(token, action),
      );

      await this.pipeline.runComplete(contextFactory);

      this.warnings.push(...this.pipeline.getWarnings());
      this.errors.push(...this.pipeline.getErrors());

      this._meta = {
        ...this._meta,
        tokenCount: this.tokenMap.size,
        processedAt: new Date(),
        extensionsRun: this.pipeline.getExtensionsRun(),
        warnings: this.warnings,
        errors: this.errors,
      };

      this.processed = true;
    } catch (error) {
      const contextFactory = this.createContextFactory();
      await this.pipeline.runOnError(
        error instanceof Error ? error : new Error(String(error)),
        contextFactory,
      );

      this.errors.push({
        message: `Processing failed: ${error}`,
        cause: error instanceof Error ? error : undefined,
      });
    }

    return this.createResult();
  }

  private createResult(): ProcessorResult {
    return {
      success: this.errors.length === 0,
      tokenCount: this.tokenMap.size,
      warnings: this.warnings,
      errors: this.errors,
    };
  }

  query(): TokenQueryBuilder<ProcessedToken> {
    return createQueryBuilder(() => this.tokens());
  }

  *tokens(): IterableIterator<ProcessedToken> {
    yield* this.tokenMap.values();
  }

  get(path: string): ProcessedToken | undefined {
    return this.tokenMap.get(path);
  }

  has(path: string): boolean {
    return this.tokenMap.has(path);
  }

  get size(): number {
    return this.tokenMap.size;
  }

  get modes(): ProcessorModes {
    return this._modes;
  }

  get meta(): ProcessorMeta {
    return this._meta;
  }

  use(
    extension: import("./types").ProcessorExtension | import("./types").ProcessorExtension[],
  ): this {
    const extensions = Array.isArray(extension) ? extension : [extension];
    this.pipeline.addAll(extensions);
    return this;
  }

  clone(options?: Partial<ProcessorOptions>): TokenProcessorInterface {
    const mergedOptions = { ...this.options, ...options };

    if (options?.extensions && this.options.extensions) {
      mergedOptions.extensions = [...this.options.extensions, ...options.extensions];
    }

    return new TokenProcessor(this.rawTokens, mergedOptions);
  }

  async reprocess(): Promise<ProcessorResult> {
    this.tokenMap.clear();
    this.warnings = [];
    this.errors = [];
    this.processed = false;
    this.processedTokens = undefined;
    this.pipeline.reset();
    return this.process();
  }

  setTokens(tokens: Record<string, unknown>): void {
    this.rawTokens = tokens;
    this.processedTokens = undefined;
    this.tokenMap.clear();
    this.warnings = [];
    this.errors = [];
    this.processed = false;
    this.pipeline.reset();
  }
}

/**
 * Create a W3C design token processor
 */
export function createTokenProcessor(
  tokens: Record<string, unknown>,
  options?: ProcessorOptions,
): TokenProcessorInterface {
  return new TokenProcessor(tokens, options);
}
