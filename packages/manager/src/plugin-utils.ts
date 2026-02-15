import type { ProcessorModes } from "@design-sync/w3c-dtfm";
import { join } from "node:path";
import type {
  DesignSyncPlugin,
  PluginBuildResult,
  PluginContext,
  PluginMeta,
  PluginOutputFile,
} from "./types";

// ============================================================================
// Plugin Definition Helpers
// ============================================================================

/**
 * Options for definePlugin helper
 */
export interface DefinePluginOptions {
  /** Plugin version */
  version?: string;
  /** Plugin description */
  description?: string;
  /** onInit hook */
  onInit?: DesignSyncPlugin["onInit"];
  /** onBeforeBuild hook */
  onBeforeBuild?: DesignSyncPlugin["onBeforeBuild"];
  /** onAfterBuild hook */
  onAfterBuild?: DesignSyncPlugin["onAfterBuild"];
  /** onError hook */
  onError?: DesignSyncPlugin["onError"];
}

/**
 * Build function type for definePlugin
 */
export type BuildFn = (context: PluginContext) => Promise<PluginBuildResult> | PluginBuildResult;

/**
 * Helper to define plugins with minimal boilerplate.
 *
 * @example
 * ```typescript
 * const myPlugin = definePlugin('my-plugin', async (context) => {
 *   const colors = context.query().ofType('color').toArray();
 *   return {
 *     files: [{
 *       path: 'colors.css',
 *       content: colors.map(t => `--${t.name}: ${t.toCSS()};`).join('\n')
 *     }]
 *   };
 * });
 * ```
 */
export function definePlugin(
  name: string,
  build: BuildFn,
  options: DefinePluginOptions = {},
): DesignSyncPlugin {
  const meta: PluginMeta = {
    name,
    version: options.version,
    description: options.description,
  };

  return {
    meta,
    build,
    onInit: options.onInit,
    onBeforeBuild: options.onBeforeBuild,
    onAfterBuild: options.onAfterBuild,
    onError: options.onError,
  };
}

// ============================================================================
// Mode Helpers
// ============================================================================

/**
 * Get all available modes as an array.
 *
 * @example
 * ```typescript
 * const allModes = getAllModes(context.modes);
 * // ['default', 'dark', 'light']
 * ```
 */
export function getAllModes(modes: ProcessorModes): string[] {
  const modeSet = new Set<string>();
  modeSet.add(modes.defaultMode);
  for (const mode of modes.requiredModes) {
    modeSet.add(mode);
  }
  for (const mode of modes.availableModes) {
    modeSet.add(mode);
  }
  return Array.from(modeSet);
}

/**
 * Get modes to iterate over (requiredModes + defaultMode if not included).
 *
 * @example
 * ```typescript
 * for (const mode of getModesToIterate(context.modes)) {
 *   // Generate files for each mode
 * }
 * ```
 */
export function getModesToIterate(modes: ProcessorModes): string[] {
  const modeSet = new Set<string>();
  for (const mode of modes.requiredModes) {
    modeSet.add(mode);
  }
  if (!modeSet.has(modes.defaultMode)) {
    modeSet.add(modes.defaultMode);
  }
  return Array.from(modeSet);
}

/**
 * Create a record initialized for each mode.
 *
 * @example
 * ```typescript
 * const tokensByMode = createModeRecord(context.modes, () => ({} as Record<string, unknown>));
 * // { default: {}, dark: {}, light: {} }
 * ```
 */
export function createModeRecord<T>(modes: ProcessorModes, init: () => T): Record<string, T> {
  const result: Record<string, T> = {};
  for (const mode of getModesToIterate(modes)) {
    result[mode] = init();
  }
  return result;
}

// ============================================================================
// File Builder Helper
// ============================================================================

/**
 * File builder for constructing plugin output
 */
export interface FileBuilder {
  /**
   * Add a file to the output
   */
  add(path: string, content: string, type?: PluginOutputFile["type"]): this;

  /**
   * Add a JSON file
   */
  addJson(path: string, data: unknown): this;

  /**
   * Add a CSS file
   */
  addCss(path: string, content: string): this;

  /**
   * Add a TypeScript file
   */
  addTs(path: string, content: string): this;

  /**
   * Add a JavaScript file
   */
  addJs(path: string, content: string): this;

  /**
   * Get all files
   */
  getFiles(): PluginOutputFile[];

  /**
   * Build the result
   */
  build(warnings?: string[]): PluginBuildResult;
}

/**
 * Create a file builder for generating plugin output.
 *
 * @example
 * ```typescript
 * const builder = createFileBuilder('css');
 * builder
 *   .addCss('tokens.css', cssContent)
 *   .addJson('tokens.json', tokensData);
 * return builder.build();
 * ```
 */
export function createFileBuilder(outDir?: string): FileBuilder {
  const files: PluginOutputFile[] = [];
  const resolvePath = (path: string) => (outDir ? join(outDir, path) : path);

  const builder: FileBuilder = {
    add(path, content, type) {
      files.push({ path: resolvePath(path), content, type });
      return this;
    },
    addJson(path, data) {
      files.push({
        path: resolvePath(path),
        content: JSON.stringify(data, null, 2),
        type: "json",
      });
      return this;
    },
    addCss(path, content) {
      files.push({ path: resolvePath(path), content, type: "css" });
      return this;
    },
    addTs(path, content) {
      files.push({ path: resolvePath(path), content, type: "ts" });
      return this;
    },
    addJs(path, content) {
      files.push({ path: resolvePath(path), content, type: "js" });
      return this;
    },
    getFiles() {
      return files;
    },
    build(warnings) {
      return { files, warnings };
    },
  };

  return builder;
}

// ============================================================================
// Object Serialization Helpers
// ============================================================================

/**
 * Options for serializeToCSS
 */
export interface SerializeToCSSOptions {
  /** Selector to wrap the properties in */
  selector?: string;
  /** Indentation string */
  indent?: string;
}

/**
 * Serialize an object of CSS properties to a CSS string.
 *
 * @example
 * ```typescript
 * serializeToCSS({ '--color-primary': '#ff0000' }, { selector: ':root' });
 * // `:root {\n  --color-primary: #ff0000;\n}`
 * ```
 */
export function serializeToCSS(
  properties: Record<string, string | number>,
  options: SerializeToCSSOptions = {},
): string {
  const { selector, indent = "  " } = options;

  const lines = Object.entries(properties)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${indent}${key}: ${value};`);

  if (selector) {
    return `${selector} {\n${lines.join("\n")}\n}`;
  }

  return lines.join("\n");
}

/**
 * Serialize nested object to CSS with nested selectors.
 *
 * @example
 * ```typescript
 * serializeNestedToCSS({
 *   'colors': { '--primary': '#ff0000' },
 *   'spacing': { '--sm': '8px' }
 * }, ':root');
 * ```
 */
export function serializeNestedToCSS(
  obj: Record<string, Record<string, string | number>>,
  selector: string,
): string {
  const flatProps: Record<string, string | number> = {};

  for (const [_group, properties] of Object.entries(obj)) {
    for (const [key, value] of Object.entries(properties)) {
      flatProps[key] = value;
    }
  }

  return serializeToCSS(flatProps, { selector });
}

// ============================================================================
// Type Grouping Helpers
// ============================================================================

/**
 * Token type groups for common use cases
 */
export const TOKEN_TYPE_GROUPS = {
  /** Tokens that generate CSS custom properties */
  cssVarTypes: [
    "color",
    "dimension",
    "duration",
    "number",
    "fontFamily",
    "fontWeight",
    "cubicBezier",
  ] as const,
  /** Tokens that generate CSS classes/mixins */
  cssClassTypes: ["typography", "shadow", "border", "gradient", "transition"] as const,
  /** Composite token types */
  compositeTypes: [
    "typography",
    "shadow",
    "border",
    "gradient",
    "transition",
    "strokeStyle",
  ] as const,
} as const;

/**
 * Check if a token type should generate a CSS variable.
 */
export function isCssVarType(type: string): boolean {
  return (TOKEN_TYPE_GROUPS.cssVarTypes as readonly string[]).includes(type);
}

/**
 * Check if a token type should generate a CSS class.
 */
export function isCssClassType(type: string): boolean {
  return (TOKEN_TYPE_GROUPS.cssClassTypes as readonly string[]).includes(type);
}

/**
 * Check if a token type is composite.
 */
export function isCompositeType(type: string): boolean {
  return (TOKEN_TYPE_GROUPS.compositeTypes as readonly string[]).includes(type);
}

// ============================================================================
// Token Name Transformation Utilities
// ============================================================================

/**
 * Options for stripping prefixes from token paths
 */
export interface StripPrefixOptions {
  /** Prefixes to strip from the beginning of the path */
  prefixes: string | string[];
  /** Separator used in the path (default: '.') */
  separator?: string;
}

/**
 * Strip prefixes from token paths.
 * Useful for removing design system or organization prefixes.
 *
 * @example
 * ```typescript
 * stripTokenPrefix("kda.foundation.spacing.md", { prefixes: ["kda", "foundation"] })
 * // => "spacing.md"
 *
 * stripTokenPrefix("kda-foundation-spacing-md", { prefixes: ["kda", "foundation"], separator: "-" })
 * // => "spacing-md"
 * ```
 */
export function stripTokenPrefix(path: string, options: StripPrefixOptions): string {
  const { prefixes, separator = "." } = options;
  const prefixList = Array.isArray(prefixes) ? prefixes : [prefixes];

  if (prefixList.length === 0) {
    return path;
  }

  const parts = path.split(separator);
  let startIndex = 0;

  // Find how many parts match the prefixes
  for (const prefix of prefixList) {
    if (parts[startIndex]?.toLowerCase() === prefix.toLowerCase()) {
      startIndex++;
    }
  }

  return parts.slice(startIndex).join(separator);
}

/**
 * Options for simplifying token names
 */
export interface SimplifyTokenNameOptions {
  /** Prefixes to strip */
  stripPrefix?: string | string[];
  /** Custom separator in the input (default: '-') */
  inputSeparator?: string;
  /** Output separator (default: '-') */
  outputSeparator?: string;
  /** Transform function for the name */
  transform?: (name: string) => string;
}

/**
 * Simplify token name for CSS variable or other output.
 * Strips prefixes and optionally transforms the result.
 *
 * @example
 * ```typescript
 * simplifyTokenName("kda-foundation-spacing-md", { stripPrefix: ["kda", "foundation"] })
 * // => "spacing-md"
 *
 * simplifyTokenName("--kda-foundation-color-primary", { stripPrefix: ["kda", "foundation"] })
 * // => "--color-primary"
 * ```
 */
export function simplifyTokenName(name: string, options: SimplifyTokenNameOptions = {}): string {
  const { stripPrefix, inputSeparator = "-", outputSeparator = "-", transform } = options;

  // Handle CSS variable prefix
  const hasDoubleDash = name.startsWith("--");
  let workingName = hasDoubleDash ? name.slice(2) : name;

  // Strip prefixes
  if (stripPrefix) {
    const prefixList = Array.isArray(stripPrefix) ? stripPrefix : [stripPrefix];
    const parts = workingName.split(inputSeparator);
    let startIndex = 0;

    for (const prefix of prefixList) {
      if (parts[startIndex]?.toLowerCase() === prefix.toLowerCase()) {
        startIndex++;
      }
    }

    workingName = parts.slice(startIndex).join(outputSeparator);
  }

  // Apply custom transform
  if (transform) {
    workingName = transform(workingName);
  }

  return hasDoubleDash ? `--${workingName}` : workingName;
}

// ============================================================================
// Object Building Utilities
// ============================================================================

/**
 * Build a nested object from flat dot-notation entries.
 *
 * @example
 * ```typescript
 * buildNestedObject([
 *   ["spacing.sm", "0.5rem"],
 *   ["spacing.md", "1rem"],
 *   ["colors.primary", "#667eea"]
 * ])
 * // => { spacing: { sm: "0.5rem", md: "1rem" }, colors: { primary: "#667eea" } }
 * ```
 */
export function buildNestedObject<T>(
  entries: Array<[string, T]>,
  options: { separator?: string } = {},
): Record<string, unknown> {
  const { separator = "." } = options;
  const result: Record<string, unknown> = {};

  for (const [path, value] of entries) {
    const parts = path.split(separator);
    let current: Record<string, unknown> = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || typeof current[part] !== "object" || current[part] === null) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  }

  return result;
}

/**
 * Flatten a nested object to dot-notation entries.
 *
 * @example
 * ```typescript
 * flattenNestedObject({ spacing: { sm: "0.5rem", md: "1rem" } })
 * // => [["spacing.sm", "0.5rem"], ["spacing.md", "1rem"]]
 * ```
 */
export function flattenNestedObject<T = unknown>(
  obj: Record<string, unknown>,
  options: { separator?: string; prefix?: string } = {},
): Array<[string, T]> {
  const { separator = ".", prefix = "" } = options;
  const result: Array<[string, T]> = [];

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}${separator}${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result.push(
        ...flattenNestedObject<T>(value as Record<string, unknown>, { separator, prefix: path }),
      );
    } else {
      result.push([path, value as T]);
    }
  }

  return result;
}

// ============================================================================
// Tailwind Scale Mapping Utilities
// ============================================================================

/**
 * Standard Tailwind spacing scale (in rem, based on 0.25rem = 1)
 */
export const TAILWIND_SPACING_SCALE: Record<string, string> = {
  "0": "0",
  "0.5": "0.125rem",
  "1": "0.25rem",
  "1.5": "0.375rem",
  "2": "0.5rem",
  "2.5": "0.625rem",
  "3": "0.75rem",
  "3.5": "0.875rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "9": "2.25rem",
  "10": "2.5rem",
  "11": "2.75rem",
  "12": "3rem",
  "14": "3.5rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem",
  "28": "7rem",
  "32": "8rem",
  "36": "9rem",
  "40": "10rem",
  "44": "11rem",
  "48": "12rem",
  "52": "13rem",
  "56": "14rem",
  "60": "15rem",
  "64": "16rem",
  "72": "18rem",
  "80": "20rem",
  "96": "24rem",
};

/**
 * Common semantic spacing name mappings
 */
export const SEMANTIC_SPACING_MAP: Record<string, string> = {
  // Extra small to extra large
  "3xs": "0.5",
  "2xs": "1",
  xs: "2",
  sm: "3",
  md: "4",
  base: "4",
  lg: "6",
  xl: "8",
  "2xl": "10",
  "3xl": "12",
  "4xl": "16",
  "5xl": "20",
  // Numeric names
  n0: "0",
  n1: "1",
  n2: "2",
  n3: "3",
  n4: "4",
  n5: "5",
  n6: "6",
  n7: "7",
  n8: "8",
  n9: "9",
  n10: "10",
  n12: "12",
  n14: "14",
  n16: "16",
};

/**
 * Map a spacing value to Tailwind's numeric scale.
 * Returns the scale number or null if no match found.
 *
 * @example
 * ```typescript
 * mapToNumericScale("1rem")     // => "4"
 * mapToNumericScale("0.5rem")   // => "2"
 * mapToNumericScale("2rem")     // => "8"
 * mapToNumericScale("custom")   // => null
 * ```
 */
export function mapToNumericScale(value: string): string | null {
  // Normalize value
  const normalized = value.trim().toLowerCase();

  // Direct match in the scale
  for (const [scale, scaleValue] of Object.entries(TAILWIND_SPACING_SCALE)) {
    if (scaleValue === normalized) {
      return scale;
    }
  }

  // Try to parse rem value and calculate scale
  const remMatch = normalized.match(/^([\d.]+)rem$/);
  if (remMatch) {
    const remValue = parseFloat(remMatch[1]);
    const scaleValue = remValue / 0.25;

    // Check if it's a valid scale number
    if (TAILWIND_SPACING_SCALE[String(scaleValue)]) {
      return String(scaleValue);
    }
  }

  // Try to parse px value and convert to scale
  const pxMatch = normalized.match(/^([\d.]+)px$/);
  if (pxMatch) {
    const pxValue = parseFloat(pxMatch[1]);
    const remValue = pxValue / 16;
    const scaleValue = remValue / 0.25;

    if (TAILWIND_SPACING_SCALE[String(scaleValue)]) {
      return String(scaleValue);
    }
  }

  return null;
}

/**
 * Map a semantic name (like "md", "lg", "xl") to Tailwind's numeric scale.
 *
 * @example
 * ```typescript
 * mapSemanticToNumericScale("md")   // => "4"
 * mapSemanticToNumericScale("lg")   // => "6"
 * mapSemanticToNumericScale("xl")   // => "8"
 * mapSemanticToNumericScale("n4")   // => "4"
 * ```
 */
export function mapSemanticToNumericScale(name: string): string | null {
  const normalized = name.toLowerCase();
  return SEMANTIC_SPACING_MAP[normalized] ?? null;
}

// ============================================================================
// Dark Mode Utilities
// ============================================================================

/**
 * Compare two token value records and return only the differences.
 * Useful for minifying dark mode output.
 *
 * @example
 * ```typescript
 * getValueDifferences(
 *   { "color-bg": "#fff", "color-text": "#000", "spacing-md": "1rem" },
 *   { "color-bg": "#000", "color-text": "#fff", "spacing-md": "1rem" }
 * )
 * // => { "color-bg": "#000", "color-text": "#fff" }
 * ```
 */
export function getValueDifferences(
  baseValues: Record<string, string>,
  compareValues: Record<string, string>,
): Record<string, string> {
  const differences: Record<string, string> = {};

  for (const [key, value] of Object.entries(compareValues)) {
    if (baseValues[key] !== value) {
      differences[key] = value;
    }
  }

  return differences;
}

/**
 * Check if a token is different between two modes.
 * Returns true if the value differs.
 */
export function isTokenDifferentInMode(
  token: { toCSS: (mode: string) => string },
  baseMode: string,
  compareMode: string,
): boolean {
  return token.toCSS(baseMode) !== token.toCSS(compareMode);
}

// ============================================================================
// Category Mapping Utilities
// ============================================================================

/**
 * Token type to category mapping for various frameworks
 */
export interface CategoryMappingOptions {
  /** Path-based overrides for category detection */
  pathOverrides?: Record<string, string>;
  /** Custom type to category map */
  typeMap?: Record<string, string>;
}

/**
 * Default token type to CSS category mappings
 */
export const DEFAULT_TYPE_CATEGORY_MAP: Record<string, string> = {
  color: "colors",
  dimension: "spacing",
  fontFamily: "fontFamily",
  fontWeight: "fontWeight",
  shadow: "boxShadow",
  duration: "transitionDuration",
  cubicBezier: "transitionTimingFunction",
  border: "borderWidth",
  gradient: "backgroundImage",
  number: "opacity",
};

/**
 * Infer category from token path.
 * Useful for more accurate categorization based on naming.
 */
export function inferCategoryFromPath(path: string): string | null {
  const pathLower = path.toLowerCase();

  // Spacing patterns
  if (pathLower.includes("spacing") || pathLower.includes("space") || pathLower.includes("gap")) {
    return "spacing";
  }

  // Color patterns
  if (
    pathLower.includes("color") ||
    pathLower.includes("background") ||
    pathLower.includes("foreground")
  ) {
    return "colors";
  }

  // Typography patterns
  if (pathLower.includes("font-size") || pathLower.includes("fontsize")) {
    return "fontSize";
  }
  if (pathLower.includes("line-height") || pathLower.includes("lineheight")) {
    return "lineHeight";
  }
  if (pathLower.includes("letter-spacing") || pathLower.includes("letterspacing")) {
    return "letterSpacing";
  }

  // Border radius patterns
  if (
    pathLower.includes("radius") ||
    pathLower.includes("radii") ||
    pathLower.includes("rounded")
  ) {
    return "borderRadius";
  }

  // Shadow patterns
  if (pathLower.includes("shadow")) {
    return "boxShadow";
  }

  // Z-index patterns
  if (pathLower.includes("zindex") || pathLower.includes("z-index")) {
    return "zIndex";
  }

  // Opacity patterns
  if (pathLower.includes("opacity")) {
    return "opacity";
  }

  return null;
}
