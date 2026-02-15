// Alias utilities
export {
  normalizeTokenAlias,
  normalizeTokenRef,
  normalizeReference,
  pathToAlias,
  pathToRef,
  isValidAlias,
  isValidRef,
} from "./alias";

// Color system (prefer new color/ exports over culori.ts)
export * from "./color";

// CSS utilities
export * from "./css";

// Format detection and migration
export * from "./format";

// Group features ($extends, $root)
export * from "./groups";

// Guards and type checks (excluding isReference which is exported from resolver/references)
export {
  isDesignTokenGroup,
  isDesignToken,
  isDesignTokenLike,
  hasTokenExtensions,
  hasModeExtension,
  hasModesExtension,
  isCompositeToken,
  hasTokenAlias,
  isTokenAlias,
  isTokenRef,
  isDeprecatedToken,
  getDeprecationMessage,
  isColorToken,
  isCubicBezierToken,
  isFontFamilyToken,
  isFontWeightToken,
  isDimensionToken,
  isNumberToken,
  isDurationToken,
  isStrokeStyleToken,
  isShadowToken,
  isBorderToken,
  isTransitionToken,
  isGradientToken,
  isTypographyToken,
  isOtherToken,
  isReference,
} from "./guards";

// Type inference (use explicit names to avoid conflict with resolver)
export {
  inferTokenType,
  getInheritedType,
  getExplicitType,
  getReferencedType,
  inferAllTypes,
  findUntyped,
  applyInferredTypes,
  resolveAllTypes,
  allTypesResolvable,
  getTypeInheritanceChain,
  validateTypeConsistency,
  type TypeInferenceResult,
  type TypeInferenceError,
} from "./inference";

// Normalizers
export * from "./normalize";

// Resolver (exclude duplicate names that are exported from inference)
export { TokenResolver, resolveTokens, resolveTokensOrThrow, canResolve } from "./resolver";
export {
  stage1Validate,
  stage2BuildDependencyGraph,
  stage3ResolveAliases,
  stage4BuildOutput,
  topologicalSort,
  detectCircularReferences,
  runResolver,
  type ResolverOptions,
  type DependencyNode,
  type DependencyGraph,
} from "./resolver/stages";
export {
  ResolverError,
  CircularReferenceError,
  MissingReferenceError,
  CannotInferTypeError,
  ResolverErrorCode,
  type ResolverResult,
  type ResolverWarning,
} from "./resolver/errors";
export {
  isTokenReference,
  parseReference,
  pathToW3CRef,
  pathToLegacyAlias,
  collectReferencesFromValue,
  collectAllReferences,
  replaceReferences,
  hasReferences,
  getTokenByPath,
  getTokenValueByPath,
  getTokenTypeByPath,
  isValidReferencePath,
  type TokenReference,
} from "./resolver/references";

// Serialization
export * from "./serialize";

// Types
export * from "./types";

// Validation
export * from "./validation";

/**
 * Processor API (recommended)
 * New fluent API for processing design tokens with lazy evaluation,
 * type-narrowing queries, and async extension lifecycle.
 */
export * from "./processor";

/**
 * Walker (legacy)
 * @deprecated Use the processor API instead (`createTokenProcessor`).
 * Will be removed in the next major version.
 *
 * Note: Some walker exports have been renamed to avoid conflicts with the processor API:
 * - colorGeneratorsExtension → walkerColorGeneratorsExtension
 * - colorModifiersExtension → walkerColorModifiersExtension
 * - responsiveExtension → walkerResponsiveExtension
 * - TokenOverrideFn → WalkerTokenOverrideFn
 * - TokenGenerator → WalkerTokenGenerator
 */
export {
  // Token class
  WalkerDesignToken,
} from "./walker/token";

export {
  // Types with renamed exports to avoid conflicts
  type DesignTokenValueRecord,
  type DesignTokenValueByMode,
  type TokensWalkerBaseAction,
  type TokensWalkerAction,
  type PathMatcher,
  type TokenFilterObj,
  type TokensFilterParams,
  type TokensFilter,
  type TokensWalkerFilter,
  type TokensWalkerSchemaExtension,
  type TokenOverrideFn as WalkerTokenOverrideFn,
  type TokenOverrides,
  type WalkerValidationOptions,
  type WalkerResolverOptions,
  type WalkerGroupOptions,
} from "./walker/types";

export {
  // Utilities
  isDesignTokenValueRecord,
  getModeNormalizeValue,
  getModeRawValue,
  isMatchingTokensFilter,
  isSupportedTypeFilter,
} from "./walker/utils";

export {
  // Walker class
  TokensWalker,
} from "./walker/walker";

export {
  // Extensions with renamed exports
  colorGeneratorsExtension as walkerColorGeneratorsExtension,
  hasGeneratorsExtension as walkerHasGeneratorsExtension,
  type TokenGenerator as WalkerTokenGenerator,
  type TokenGeneratorsExtension as WalkerTokenGeneratorsExtension,
} from "./walker/extensions/generators";

export {
  colorModifiersExtension as walkerColorModifiersExtension,
  hasColorTokenModifiersExtension as walkerHasColorTokenModifiersExtension,
  type ColorModifiersExtensionOptions as WalkerColorModifiersExtensionOptions,
  type ColorTokenModifiersExtension as WalkerColorTokenModifiersExtension,
} from "./walker/extensions/modifiers";

export {
  responsiveExtension as walkerResponsiveExtension,
  type ResponsiveExtensionOptions as WalkerResponsiveExtensionOptions,
} from "./walker/extensions/responsive";
