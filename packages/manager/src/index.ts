// Configuration
export * from "./config";

// Fetcher
export * from "./fetcher";

// Logger
export * from "./logger";

// Manager
export { TokensManager } from "./manager";

// Types
export type {
  BuildOptions,
  BuildResult,
  DesignSyncConfig,
  DesignSyncPlugin,
  DesignSyncProcessorConfig,
  PluginBuildResult,
  PluginContext,
  PluginInitContext,
  PluginLogger,
  PluginMeta,
  PluginOutputFile,
  PluginResult,
} from "./types";

// Plugin utilities
export {
  // Plugin definition
  definePlugin,
  type BuildFn,
  type DefinePluginOptions,
  // Mode helpers
  getAllModes,
  getModesToIterate,
  createModeRecord,
  // File builder
  createFileBuilder,
  type FileBuilder,
  // CSS helpers
  serializeToCSS,
  serializeNestedToCSS,
  type SerializeToCSSOptions,
  // Type grouping
  TOKEN_TYPE_GROUPS,
  isCssVarType,
  isCssClassType,
  isCompositeType,
  // Token name transformation
  stripTokenPrefix,
  simplifyTokenName,
  type StripPrefixOptions,
  type SimplifyTokenNameOptions,
  // Object building
  buildNestedObject,
  flattenNestedObject,
  // Tailwind scale mapping
  TAILWIND_SPACING_SCALE,
  SEMANTIC_SPACING_MAP,
  mapToNumericScale,
  mapSemanticToNumericScale,
  // Dark mode utilities
  getValueDifferences,
  isTokenDifferentInMode,
  // Category mapping
  DEFAULT_TYPE_CATEGORY_MAP,
  inferCategoryFromPath,
  type CategoryMappingOptions,
} from "./plugin-utils";

// Writer
export * from "./writer";
