import {
  createModeRecord,
  definePlugin,
  getModesToIterate,
  getValueDifferences,
  stripTokenPrefix,
  type PluginOutputFile,
} from "@design-sync/manager";
import { kebabCase, set } from "@design-sync/utils";
import {
  convertColorSpace,
  formatW3CColorToCSS,
  isTokenAlias,
  parseCSSToW3CColor,
  pathToCssVarName,
  pathToStyleName,
  processCssVarRef,
  serializeObjectToCSS,
  typographyToCssStyle,
  type ProcessedToken,
  type W3CColorSpace,
} from "@design-sync/w3c-dtfm";
import { join } from "node:path";

export interface CSSPluginConfig {
  /** CSS selectors for themes. Can be string, array, or object mapping mode to selectors */
  selectors?: string | string[] | Record<string, string | string[]>;
  /** Render typography as CSS font shorthand instead of separate properties */
  typographyAsFontProperty?: boolean;
  /** Token types to extract as CSS classes instead of variables */
  extractAsStyle?: string[];
  /** Output directory for CSS files (relative to main out dir) */
  outDir?: string;
  /**
   * Wrap tokens in CSS @layer for better cascade control
   * Can be a boolean (uses "tokens" layer) or custom layer name
   * @default false
   */
  useLayer?: boolean | string;
  /**
   * Generate prefers-color-scheme media queries for dark mode
   * Maps mode names to color scheme ("light" or "dark")
   * @example { dark: "dark", light: "light" }
   */
  colorScheme?: Record<string, "light" | "dark">;
  /**
   * Add fallback values for CSS variables (for legacy browser support)
   * @default false
   */
  includeFallbacks?: boolean;
  /**
   * Prefix for CSS custom property names
   * @example "ds" generates --ds-colors-primary
   */
  prefix?: string;
  /**
   * Generate a single combined CSS file instead of per-mode files
   * @default false
   */
  combineOutput?: boolean;

  // NEW ERGONOMIC OPTIONS

  /**
   * Strip prefix from token names
   * Removes design system or organization prefixes from CSS variable names
   * @example ['kda', 'foundation'] removes "kda-foundation-" from variable names
   */
  stripPrefix?: string | string[];

  /**
   * Organize tokens by semantic layer
   * - 'single': All tokens in one layer (default behavior)
   * - 'semantic': Separate layers for colors, spacing, typography, etc.
   * @default 'single'
   */
  layerStrategy?: "single" | "semantic";

  /**
   * Color format for output
   * @default 'hex'
   */
  colorFormat?: "oklch" | "hex" | "rgb" | "hsl";

  /**
   * Color fallback format (for browsers that don't support oklch)
   * Only used when colorFormat is 'oklch'
   */
  colorFallback?: "hex" | "rgb";

  /**
   * Only include dark mode values that differ from light mode
   * Reduces output size by not repeating unchanged values
   * @default false
   */
  minifyDarkMode?: boolean;
}

/**
 * CSS Plugin - Exports design tokens as CSS custom properties and classes
 *
 * Creates CSS files with:
 * - CSS custom properties (variables) for most token types
 * - CSS classes for typography tokens (or other types specified in extractAsStyle)
 * - Optional CSS @layer support for cascade control
 * - Optional prefers-color-scheme support for automatic dark mode
 *
 * @example
 * ```typescript
 * // design-sync.config.ts
 * import { cssPlugin } from '@design-sync/css-plugin';
 *
 * export default {
 *   plugins: [cssPlugin({
 *     selectors: {
 *       default: ':root',
 *       dark: '[data-theme="dark"]'
 *     },
 *     useLayer: 'design-tokens',
 *     colorScheme: { dark: 'dark', light: 'light' },
 *     prefix: 'ds'
 *   })],
 * };
 * ```
 */
export function cssPlugin(config: CSSPluginConfig = {}): ReturnType<typeof definePlugin> {
  const {
    selectors = ":root",
    typographyAsFontProperty = false,
    extractAsStyle = ["typography"],
    outDir = "",
    useLayer = false,
    colorScheme,
    includeFallbacks = false,
    prefix,
    combineOutput = false,
    // New options
    stripPrefix,
    layerStrategy = "single",
    colorFormat = "hex",
    colorFallback,
    minifyDarkMode = false,
  } = config;

  const stripPrefixArray = stripPrefix
    ? Array.isArray(stripPrefix)
      ? stripPrefix
      : stripPrefix.split(".")
    : [];

  return definePlugin("css-plugin", (context) => {
    const { modes } = context;

    // Track CSS variables and styles by category (for semantic layers)
    const cssVars = createModeRecord<Record<string, string>>(modes, () => ({}));
    const cssVarsByCategory = createModeRecord<Record<string, Record<string, string>>>(
      modes,
      () => ({}),
    );
    const fallbackVars = createModeRecord<Record<string, string>>(modes, () => ({}));
    const styles: string[] = [];
    const mediaQueries = new Map<string, string[]>();

    // Determine which types generate classes vs variables
    const generateClassFor = extractAsStyle.filter((type) =>
      typographyAsFontProperty ? type !== "typography" : true,
    );

    // Process all tokens
    context.query().forEach((token) => {
      if (generateClassFor.includes(token.type)) {
        processStyleToken(token, styles, mediaQueries, modes.defaultMode);
      } else {
        processCssVarToken(
          token,
          cssVars,
          cssVarsByCategory,
          fallbackVars,
          modes.defaultMode,
          getModesToIterate(modes),
          prefix,
          includeFallbacks,
          stripPrefixArray,
          layerStrategy === "semantic",
          colorFormat,
          colorFallback,
        );
      }
    });

    // Build files
    const files: PluginOutputFile[] = [];

    // Add styles file if there are any
    if (styles.length > 0 || mediaQueries.size > 0) {
      files.push(createStylesFile(styles, mediaQueries, outDir, useLayer));
    }

    // Apply minifyDarkMode to non-default modes
    const processedVars = { ...cssVars };
    if (minifyDarkMode) {
      for (const mode of getModesToIterate(modes)) {
        if (mode !== modes.defaultMode) {
          processedVars[mode] = getValueDifferences(cssVars[modes.defaultMode], cssVars[mode]);
        }
      }
    }

    // Generate combined or separate theme files
    if (combineOutput) {
      if (layerStrategy === "semantic") {
        files.push(
          createSemanticLayerFile(
            cssVarsByCategory,
            selectors,
            colorScheme,
            outDir,
            modes.defaultMode,
            getModesToIterate(modes),
            minifyDarkMode,
          ),
        );
      } else {
        files.push(
          createCombinedThemeFile(
            processedVars,
            selectors,
            colorScheme,
            useLayer,
            outDir,
            modes.defaultMode,
            getModesToIterate(modes),
          ),
        );
      }
    } else {
      for (const mode of getModesToIterate(modes)) {
        const varsToOutput =
          minifyDarkMode && mode !== modes.defaultMode ? processedVars[mode] : cssVars[mode];

        if (layerStrategy === "semantic") {
          files.push(
            createSemanticThemeFile(mode, cssVarsByCategory[mode], selectors, colorScheme, outDir),
          );
        } else {
          files.push(createThemeFile(mode, varsToOutput, selectors, colorScheme, useLayer, outDir));
        }
      }
    }

    return { files };
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

function getModeSelectors(mode: string, selectors: CSSPluginConfig["selectors"]): string[] {
  const defaultSelectors = [":root"];

  if (!selectors) {
    return defaultSelectors;
  }

  if (Array.isArray(selectors)) {
    return selectors;
  }

  if (typeof selectors === "string") {
    return [selectors];
  }

  const modeSelectors = selectors[mode] ?? defaultSelectors;
  return Array.isArray(modeSelectors) ? modeSelectors : [modeSelectors];
}

function convertToCssValue(value: unknown): string | number {
  // Handle W3C dimension/duration objects
  if (typeof value === "object" && value !== null && "value" in value && "unit" in value) {
    return `${(value as { value: number; unit: string }).value}${(value as { value: number; unit: string }).unit}`;
  }
  return value as string | number;
}

function processCssStyleObject(style: Record<string, unknown>): Record<string, string | number> {
  const result: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(style)) {
    const converted = convertToCssValue(value);
    result[key] = processCssVarRef(converted);
  }
  return result;
}

/**
 * Convert a color value to the specified format
 * @param cssValue - The CSS color value (e.g., "#667eea", "rgb(102, 126, 234)")
 * @param targetFormat - The target format ("oklch", "hex", "rgb", "hsl")
 * @returns The formatted color value, or original if not a color
 */
function formatColorValue(cssValue: string, targetFormat: CSSPluginConfig["colorFormat"]): string {
  // Skip if not a color format or already in target format
  if (!cssValue || typeof cssValue !== "string") {
    return cssValue;
  }

  // Skip CSS variable references
  if (cssValue.startsWith("var(")) {
    return cssValue;
  }

  // Try to parse as color
  const colorSpaceMap: Record<NonNullable<CSSPluginConfig["colorFormat"]>, W3CColorSpace> = {
    oklch: "oklch",
    hex: "srgb",
    rgb: "srgb",
    hsl: "hsl",
  };

  const targetSpace = colorSpaceMap[targetFormat || "hex"];

  try {
    // Parse the CSS color
    const parsed = parseCSSToW3CColor(cssValue, targetSpace);
    if (!parsed) {
      return cssValue; // Not a valid color, return as-is
    }

    // Convert to target color space
    const converted = convertColorSpace(parsed, targetSpace);

    // Format based on target format
    if (targetFormat === "hex") {
      // For hex, return the hex string if available
      return converted.hex || formatW3CColorToCSS(converted);
    }

    if (targetFormat === "rgb") {
      // Format as rgb()
      const formatted = formatW3CColorToCSS(converted);
      return formatted;
    }

    if (targetFormat === "oklch") {
      // Format as oklch()
      // Note: fallbackFormat is handled separately via includeFallbacks option
      // which stores fallback values in fallbackVars for broader browser support
      return formatW3CColorToCSS(converted);
    }

    return formatW3CColorToCSS(converted);
  } catch {
    // If parsing fails, return original value
    return cssValue;
  }
}

function processCssVarToken(
  token: ProcessedToken,
  cssVars: Record<string, Record<string, string>>,
  cssVarsByCategory: Record<string, Record<string, Record<string, string>>>,
  fallbackVars: Record<string, Record<string, string>>,
  defaultMode: string,
  allModes: string[],
  prefix?: string,
  includeFallbacks?: boolean,
  stripPrefixArray: string[] = [],
  useSemanticCategories = false,
  colorFormat: CSSPluginConfig["colorFormat"] = "hex",
  colorFallback?: CSSPluginConfig["colorFallback"],
) {
  // Get simplified variable name with prefix stripping
  let simplifiedPath = token.path;
  if (stripPrefixArray.length > 0) {
    simplifiedPath = stripTokenPrefix(token.path, { prefixes: stripPrefixArray, separator: "." });
  }

  const varName = pathToCssVarName(simplifiedPath, prefix);
  const isColorToken = token.type === "color";

  // Process default mode value
  let defaultCssValue = token.toCSS(defaultMode);

  // Apply color format conversion for color tokens
  if (isColorToken && colorFormat !== "hex") {
    defaultCssValue = formatColorValue(String(defaultCssValue), colorFormat);
  }

  const defaultValue = processCssVarRef(convertToCssValue(defaultCssValue), prefix);

  set(cssVars[defaultMode], varName, defaultValue);

  // Track by category if using semantic layers
  if (useSemanticCategories) {
    const category = getTokenCategory(token);
    if (!cssVarsByCategory[defaultMode][category]) {
      cssVarsByCategory[defaultMode][category] = {};
    }
    cssVarsByCategory[defaultMode][category][varName] = String(defaultValue);
  }

  if (includeFallbacks) {
    // For fallbacks, use colorFallback format or raw value for broader browser support
    const fallbackValue =
      isColorToken && colorFormat === "oklch" && colorFallback
        ? formatColorValue(String(token.toCSS(defaultMode)), colorFallback)
        : String(token.toCSS(defaultMode));
    set(fallbackVars[defaultMode], varName, fallbackValue);
  }

  for (const mode of allModes) {
    if (mode === defaultMode) continue;

    let modeCssValue = token.toCSS(mode);

    // Apply color format conversion for color tokens
    if (isColorToken && colorFormat !== "hex") {
      modeCssValue = formatColorValue(String(modeCssValue), colorFormat);
    }

    const modeValue = processCssVarRef(convertToCssValue(modeCssValue), prefix);
    set(cssVars[mode], varName, modeValue);

    if (useSemanticCategories) {
      const category = getTokenCategory(token);
      if (!cssVarsByCategory[mode][category]) {
        cssVarsByCategory[mode][category] = {};
      }
      cssVarsByCategory[mode][category][varName] = String(modeValue);
    }

    if (includeFallbacks) {
      const fallbackValue =
        isColorToken && colorFormat === "oklch" && colorFallback
          ? formatColorValue(String(token.toCSS(mode)), colorFallback)
          : String(token.toCSS(mode));
      set(fallbackVars[mode], varName, fallbackValue);
    }
  }
}

function getTokenCategory(token: ProcessedToken): string {
  const { type, path } = token;
  const pathLower = path.toLowerCase();

  switch (type) {
    case "color":
      return "colors";
    case "dimension": {
      if (pathLower.includes("spacing") || pathLower.includes("space") || pathLower.includes("gap"))
        return "spacing";
      if (pathLower.includes("fontsize") || pathLower.includes("font-size")) return "typography";
      if (pathLower.includes("lineheight") || pathLower.includes("line-height"))
        return "typography";
      if (pathLower.includes("letterspacing") || pathLower.includes("letter-spacing"))
        return "typography";
      if (pathLower.includes("radius") || pathLower.includes("radii")) return "borders";
      if (pathLower.includes("border") && pathLower.includes("width")) return "borders";
      if (pathLower.includes("width") || pathLower.includes("height")) return "sizing";
      return "spacing";
    }
    case "fontFamily":
    case "fontWeight":
      return "typography";
    case "shadow":
      return "effects";
    case "duration":
    case "cubicBezier":
      return "motion";
    case "number": {
      if (pathLower.includes("opacity")) return "effects";
      if (pathLower.includes("zindex") || pathLower.includes("z-index")) return "zindex";
      return "misc";
    }
    default:
      return "misc";
  }
}

function processStyleToken(
  token: ProcessedToken,
  styles: string[],
  mediaQueries: Map<string, string[]>,
  defaultMode: string,
) {
  const selector = `.${pathToStyleName(token.path, { textTransform: kebabCase })}`;
  const rawValue = token.getValue(defaultMode);

  // Check if the token has responsive extension
  const isResponsive = token.hasExtension("responsive");

  if (isResponsive) {
    // Handle responsive typography
    const modeValues = token.modeValues;
    const baseValue = (modeValues as Record<string, unknown>)["base"];
    if (baseValue) {
      const baseStyle = typographyToCssStyle(baseValue);
      if (!isTokenAlias(baseStyle) && typeof baseStyle === "object") {
        const processedBase = processCssStyleObject(baseStyle as Record<string, unknown>);
        styles.push(serializeObjectToCSS(processedBase, selector));

        // Process breakpoint-specific styles
        for (const [breakpoint, value] of Object.entries(modeValues)) {
          if (breakpoint === "base") continue;

          const breakpointStyle = typographyToCssStyle(value);
          if (isTokenAlias(breakpointStyle) || typeof breakpointStyle !== "object") continue;

          // Filter out properties that are the same as base
          const filteredEntries = Object.entries(breakpointStyle).filter(
            ([key, val]) => (baseStyle as Record<string, unknown>)[key] !== val,
          );

          if (filteredEntries.length > 0) {
            const mediaQuery = breakpoint.startsWith("@media")
              ? breakpoint
              : `@media ${breakpoint}`;
            const existing = mediaQueries.get(mediaQuery) ?? [];
            existing.push(serializeObjectToCSS(Object.fromEntries(filteredEntries), selector));
            mediaQueries.set(mediaQuery, existing);
          }
        }
      }
    }
  } else {
    // Non-responsive typography
    const style = typographyToCssStyle(rawValue);
    if (!isTokenAlias(style) && typeof style === "object") {
      const processedStyle = processCssStyleObject(style as Record<string, unknown>);
      styles.push(serializeObjectToCSS(processedStyle, selector));
    }
  }
}

function createStylesFile(
  styles: string[],
  mediaQueries: Map<string, string[]>,
  outDir: string,
  useLayer: boolean | string,
): PluginOutputFile {
  let allStyles = [...styles];

  // Add media query styles
  for (const [breakpoint, breakpointStyles] of mediaQueries.entries()) {
    allStyles.push(`${breakpoint} {\n${breakpointStyles.join("\n")}\n}`);
  }

  // Wrap in @layer if enabled
  if (useLayer) {
    const layerName = typeof useLayer === "string" ? useLayer : "tokens";
    allStyles = [`@layer ${layerName} {\n${allStyles.join("\n")}\n}`];
  }

  return {
    path: join(outDir, "styles.css"),
    content: allStyles.join("\n"),
    type: "css",
  };
}

function createThemeFile(
  mode: string,
  tokens: Record<string, string>,
  selectors: CSSPluginConfig["selectors"],
  colorScheme: CSSPluginConfig["colorScheme"],
  useLayer: boolean | string,
  outDir: string,
): PluginOutputFile {
  const modeSelectors = getModeSelectors(mode, selectors);
  const parts: string[] = [];

  // Generate selector-based CSS
  const selectorCSS = modeSelectors
    .map((selector) => serializeObjectToCSS(tokens, selector))
    .join("\n");

  // Check if we need prefers-color-scheme media query
  const scheme = colorScheme?.[mode];
  if (scheme) {
    // Add both selector-based and media query-based variants
    parts.push(selectorCSS);
    parts.push(
      `@media (prefers-color-scheme: ${scheme}) {\n${serializeObjectToCSS(tokens, ":root")}\n}`,
    );
  } else {
    parts.push(selectorCSS);
  }

  let content = parts.join("\n\n");

  // Wrap in @layer if enabled
  if (useLayer) {
    const layerName = typeof useLayer === "string" ? useLayer : "tokens";
    content = `@layer ${layerName} {\n${content}\n}`;
  }

  return {
    path: join(outDir, `${mode}.css`),
    content,
    type: "css",
  };
}

function createCombinedThemeFile(
  cssVars: Record<string, Record<string, string>>,
  selectors: CSSPluginConfig["selectors"],
  colorScheme: CSSPluginConfig["colorScheme"],
  useLayer: boolean | string,
  outDir: string,
  defaultMode: string,
  allModes: string[],
): PluginOutputFile {
  const parts: string[] = [];

  for (const mode of allModes) {
    const tokens = cssVars[mode];
    const modeSelectors = getModeSelectors(mode, selectors);
    const scheme = colorScheme?.[mode];

    // Generate selector-based CSS
    const selectorCSS = modeSelectors
      .map((selector) => serializeObjectToCSS(tokens, selector))
      .join("\n");

    if (scheme && mode !== defaultMode) {
      // For non-default modes with color scheme, use media query
      parts.push(
        `/* ${mode} theme */\n${selectorCSS}\n\n@media (prefers-color-scheme: ${scheme}) {\n${serializeObjectToCSS(tokens, ":root")}\n}`,
      );
    } else {
      parts.push(`/* ${mode} theme */\n${selectorCSS}`);
    }
  }

  let content = parts.join("\n\n");

  // Wrap in @layer if enabled
  if (useLayer) {
    const layerName = typeof useLayer === "string" ? useLayer : "tokens";
    content = `@layer ${layerName} {\n${content}\n}`;
  }

  return {
    path: join(outDir, "tokens.css"),
    content,
    type: "css",
  };
}

function createSemanticThemeFile(
  mode: string,
  varsByCategory: Record<string, Record<string, string>>,
  selectors: CSSPluginConfig["selectors"],
  colorScheme: CSSPluginConfig["colorScheme"],
  outDir: string,
): PluginOutputFile {
  const modeSelectors = getModeSelectors(mode, selectors);
  const parts: string[] = [];

  // Generate CSS for each category in its own layer
  for (const [category, tokens] of Object.entries(varsByCategory)) {
    if (Object.keys(tokens).length === 0) continue;

    const layerName = `tokens.${category}`;
    const selectorCSS = modeSelectors
      .map((selector) => serializeObjectToCSS(tokens, selector))
      .join("\n");

    parts.push(`@layer ${layerName} {\n${selectorCSS}\n}`);
  }

  // Add color scheme media query if configured
  const scheme = colorScheme?.[mode];
  if (scheme) {
    const allTokens = Object.values(varsByCategory).reduce(
      (acc, tokens) => ({ ...acc, ...tokens }),
      {},
    );
    parts.push(
      `@media (prefers-color-scheme: ${scheme}) {\n${serializeObjectToCSS(allTokens, ":root")}\n}`,
    );
  }

  return {
    path: join(outDir, `${mode}.css`),
    content: parts.join("\n\n"),
    type: "css",
  };
}

function createSemanticLayerFile(
  cssVarsByCategory: Record<string, Record<string, Record<string, string>>>,
  selectors: CSSPluginConfig["selectors"],
  colorScheme: CSSPluginConfig["colorScheme"],
  outDir: string,
  defaultMode: string,
  allModes: string[],
  minifyDarkMode: boolean,
): PluginOutputFile {
  const parts: string[] = [];

  // Collect all category names
  const allCategories = new Set<string>();
  for (const mode of allModes) {
    for (const category of Object.keys(cssVarsByCategory[mode])) {
      allCategories.add(category);
    }
  }

  // Generate layer order declaration
  const layerOrder = Array.from(allCategories)
    .map((cat) => `tokens.${cat}`)
    .join(", ");
  parts.push(`@layer ${layerOrder};`);

  // Generate CSS for each mode
  for (const mode of allModes) {
    const modeSelectors = getModeSelectors(mode, selectors);

    parts.push(`\n/* ${mode} theme */`);

    for (const category of allCategories) {
      let tokens = cssVarsByCategory[mode][category] || {};

      // Apply minifyDarkMode for non-default modes
      if (minifyDarkMode && mode !== defaultMode && cssVarsByCategory[defaultMode][category]) {
        tokens = getValueDifferences(cssVarsByCategory[defaultMode][category], tokens);
      }

      if (Object.keys(tokens).length === 0) continue;

      const layerName = `tokens.${category}`;
      const selectorCSS = modeSelectors
        .map((selector) => serializeObjectToCSS(tokens, selector))
        .join("\n");

      parts.push(`@layer ${layerName} {\n${selectorCSS}\n}`);
    }

    // Add color scheme media query if configured
    const scheme = colorScheme?.[mode];
    if (scheme && mode !== defaultMode) {
      let allTokens = Object.values(cssVarsByCategory[mode]).reduce(
        (acc, tokens) => ({ ...acc, ...tokens }),
        {},
      );

      if (minifyDarkMode && cssVarsByCategory[defaultMode]) {
        const defaultAllTokens = Object.values(cssVarsByCategory[defaultMode]).reduce(
          (acc, tokens) => ({ ...acc, ...tokens }),
          {},
        );
        allTokens = getValueDifferences(defaultAllTokens, allTokens);
      }

      if (Object.keys(allTokens).length > 0) {
        parts.push(
          `@media (prefers-color-scheme: ${scheme}) {\n${serializeObjectToCSS(allTokens, ":root")}\n}`,
        );
      }
    }
  }

  return {
    path: join(outDir, "tokens.css"),
    content: parts.join("\n"),
    type: "css",
  };
}
