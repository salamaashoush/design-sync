// Main entry point
export { createTokenProcessor, TokenProcessor } from "./processor";

// Types
export type {
  // Core interfaces
  ProcessorOptions,
  ProcessorResult,
  ProcessorMeta,
  ProcessorModes,
  ProcessorWarning,
  ProcessorError,
  TokenProcessorInterface,

  // Token types
  ProcessedToken,
  TokenValueMap,
  NormalizedValueMap,
  ModeValues,

  // Filter types
  TokenFilter,
  TokenFilterObject,
  TokenFilterPredicate,

  // Query types
  TokenQueryBuilder,

  // Extension types
  ProcessorExtension,
  ExtensionContext,
  ExtensionLogger,
  TokenAction,
  AddTokenAction,
  UpdateTokenAction,
  RemoveTokenAction,
} from "./types";

// Token utilities
export { createProcessedToken, ProcessedTokenImpl } from "./token";

// Filter utilities
export {
  compileFilter,
  combineFiltersAnd,
  combineFiltersOr,
  negateFilter,
  type CompiledFilter,
} from "./filter";

// Mode utilities
export {
  createProcessorModes,
  extractModeValuesFromToken,
  discoverModes,
  validateRequiredModes,
  getRawModeValue,
  ProcessorModesImpl,
} from "./modes";

// Query utilities
export { createQueryBuilder, createFilteredQueryBuilder, TokenQueryBuilderImpl } from "./query";

// Extension utilities
export {
  createExtensionContext,
  createExtensionPipeline,
  createContextFactory,
  applyTokenActions,
  ExtensionContextImpl,
  ExtensionLoggerImpl,
  ExtensionPipeline,
} from "./extensions";

// Builtin extensions
export {
  colorModifiersExtension,
  colorGeneratorsExtension,
  responsiveExtension,
  getBuiltinExtensions,
  hasColorTokenModifiersExtension,
  hasGeneratorsExtension,
  DEFAULT_BREAKPOINTS,
  type ColorModifiersExtensionOptions,
  type ColorGeneratorsExtensionOptions,
  type ResponsiveExtensionOptions,
  type ResponsiveModifier,
  type ColorTokenModifiersExtension,
  type TokenGenerator,
  type TokenGeneratorsExtension,
} from "./extensions/builtin";
