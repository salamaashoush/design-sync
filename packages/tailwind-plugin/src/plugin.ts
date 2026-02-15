import {
  createFileBuilder,
  createModeRecord,
  definePlugin,
  getModesToIterate,
  getValueDifferences,
  isTokenDifferentInMode,
  mapSemanticToNumericScale,
  stripTokenPrefix,
} from "@design-sync/manager";
import { kebabCase, set } from "@design-sync/utils";
import {
  convertColorSpace,
  formatW3CColorToCSS,
  parseCSSToW3CColor,
  pathToCssVarName,
  type ProcessedToken,
  type W3CColorSpace,
} from "@design-sync/w3c-dtfm";

export interface TailwindPluginConfig {
  /**
   * Tailwind CSS version
   * - v3: Generates tailwind.config.ts with JS theme
   * - v4: Generates CSS with @theme declarations
   * @default 4
   */
  version?: 3 | 4;
  /** Output directory for generated files (relative to main out dir) */
  outDir?: string;
  /** Config file name for v3 */
  configFileName?: string;
  /** CSS file name for v4 */
  cssFileName?: string;
  /** Prefix for token names */
  prefix?: string;
  /**
   * Extend theme instead of replacing
   * @default true
   */
  extend?: boolean;
  /** Generate TypeScript files (v3 only) */
  useTs?: boolean;
  /**
   * Dark mode strategy for v3
   * @default 'class'
   */
  darkMode?: "class" | "media" | false;
  /**
   * Color format for output
   * @default 'hex'
   */
  colorFormat?: "hex" | "rgb" | "hsl" | "oklch";
  /**
   * Custom content paths for v3 config
   */
  content?: string[];

  // NEW ERGONOMIC OPTIONS

  /**
   * Strip design system prefix from token names
   * @example 'kda.foundation' or ['kda', 'foundation']
   */
  stripPrefix?: string | string[];

  /**
   * Map semantic names to Tailwind numeric scale
   * When true, converts names like "spacing.md" to "--spacing-4"
   * @default false
   */
  useNumericScale?: boolean;

  /**
   * Only include dark mode values that differ from light mode
   * Reduces output size by not repeating unchanged values
   * @default false
   */
  minifyDarkMode?: boolean;

  /**
   * Namespace prefix for custom tokens in v4
   * @example 'ds' → --ds-color-primary
   */
  namespace?: string;
}

type TailwindCategory =
  | "colors"
  | "spacing"
  | "fontSize"
  | "fontWeight"
  | "fontFamily"
  | "lineHeight"
  | "letterSpacing"
  | "borderRadius"
  | "boxShadow"
  | "transitionTimingFunction"
  | "transitionDuration"
  | "borderWidth"
  | "borderColor"
  | "zIndex"
  | "opacity"
  | "width"
  | "height"
  | "maxWidth"
  | "maxHeight"
  | "minWidth"
  | "minHeight";

/**
 * Tailwind CSS Plugin - Exports design tokens as Tailwind configuration
 *
 * Supports both Tailwind v3 (JS config) and v4 (CSS @theme).
 *
 * @example
 * ```typescript
 * // design-sync.config.ts
 * import { tailwindPlugin } from '@design-sync/tailwind-plugin';
 *
 * export default {
 *   plugins: [tailwindPlugin({
 *     version: 4,
 *     stripPrefix: ['kda', 'foundation'],
 *     useNumericScale: true,
 *     colorFormat: 'oklch',
 *     minifyDarkMode: true,
 *   })],
 * };
 * ```
 *
 * For v3:
 * ```typescript
 * // tailwind.config.ts
 * import { designTokensConfig } from './tokens/tailwind.config';
 * export default designTokensConfig;
 * ```
 *
 * For v4:
 * ```css
 * @import "./tokens/theme.css";
 * ```
 */
export function tailwindPlugin(config: TailwindPluginConfig = {}): ReturnType<typeof definePlugin> {
  const {
    version = 4,
    outDir = "",
    configFileName = "tailwind.config",
    cssFileName = "theme.css",
    prefix,
    extend = true,
    useTs = true,
    darkMode = "class",
    colorFormat = "hex",
    content = ["./src/**/*.{js,ts,jsx,tsx}"],
    // New options
    stripPrefix,
    useNumericScale = false,
    minifyDarkMode = false,
    namespace,
  } = config;

  const stripPrefixArray = stripPrefix
    ? Array.isArray(stripPrefix)
      ? stripPrefix
      : stripPrefix.split(".")
    : [];

  return definePlugin("tailwind-plugin", (context) => {
    const { modes } = context;
    const builder = createFileBuilder(outDir);

    // Collect theme tokens by mode
    const theme: Record<string, Record<string, unknown>> = {};
    const darkTheme: Record<string, Record<string, unknown>> = {};

    // Track raw values for dark mode comparison
    const lightValues: Record<string, string> = {};
    const darkValues: Record<string, string> = {};

    // Process all tokens
    context.query().forEach((token) => {
      const category = getTailwindCategory(token);
      if (!category) return;

      // Get simplified token name
      const tokenName = getSimplifiedTokenName(token.path, {
        stripPrefix: stripPrefixArray,
        category,
        useNumericScale,
        prefix,
        namespace,
      });

      if (version === 4) {
        const lightValue = formatTokenValue(token, modes.defaultMode, colorFormat);
        processV4Token(token, theme, category, tokenName, lightValue);
        lightValues[`${category}.${tokenName}`] = lightValue;

        // Process dark mode tokens
        if (modes.requiredModes.includes("dark") || token.modeValues["dark"]) {
          const darkValue = formatTokenValue(token, "dark", colorFormat);
          darkValues[`${category}.${tokenName}`] = darkValue;

          // Only add to dark theme if different from light (when minifyDarkMode is enabled)
          if (!minifyDarkMode || isTokenDifferentInMode(token, modes.defaultMode, "dark")) {
            processV4Token(token, darkTheme, category, tokenName, darkValue);
          }
        }
      } else {
        const value = formatTokenValue(token, modes.defaultMode, colorFormat);
        processV3Token(token, theme, category, tokenName, value);
      }
    });

    // Generate output based on version
    if (version === 4) {
      builder.add(cssFileName, generateV4CssFile(theme, darkTheme, namespace), "css");
    } else {
      const ext = useTs ? "ts" : "js";
      builder.add(
        `${configFileName}.${ext}`,
        generateV3ConfigFile(theme, extend, darkMode, content, useTs),
        ext as "ts" | "js",
      );

      // Generate CSS variables file for dark mode support
      const cssVars = createModeRecord<Record<string, string>>(modes, () => ({}));
      context.query().forEach((token) => {
        const varName = getSimplifiedCssVarName(token.path, {
          stripPrefix: stripPrefixArray,
          prefix: namespace || prefix,
        });
        for (const mode of getModesToIterate(modes)) {
          cssVars[mode][varName] = formatTokenValue(token, mode, colorFormat);
        }
      });

      for (const mode of getModesToIterate(modes)) {
        const selector = mode === modes.defaultMode ? ":root" : `.${mode}`;

        // Apply minifyDarkMode for non-default modes
        let varsToOutput = cssVars[mode];
        if (minifyDarkMode && mode !== modes.defaultMode) {
          varsToOutput = getValueDifferences(cssVars[modes.defaultMode], cssVars[mode]);
        }

        if (Object.keys(varsToOutput).length > 0) {
          builder.add(`${mode}.css`, generateCssVarsFile(varsToOutput, selector), "css");
        }
      }
    }

    return builder.build();
  });
}

// ============================================================================
// Token Name Helpers
// ============================================================================

interface TokenNameOptions {
  stripPrefix: string[];
  category: TailwindCategory;
  useNumericScale: boolean;
  prefix?: string;
  namespace?: string;
}

function getSimplifiedTokenName(path: string, options: TokenNameOptions): string {
  const { stripPrefix, category, useNumericScale, prefix, namespace } = options;

  // Strip prefixes from path
  let simplifiedPath = path;
  if (stripPrefix.length > 0) {
    simplifiedPath = stripTokenPrefix(path, { prefixes: stripPrefix, separator: "." });
  }

  // Split and filter common category prefixes
  const parts = simplifiedPath.split(".");
  const filtered = parts.filter(
    (p) =>
      ![
        "colors",
        "color",
        "spacing",
        "space",
        "typography",
        "font",
        "fonts",
        "shadow",
        "shadows",
        "border",
        "borders",
        "radius",
        "radii",
      ].includes(p.toLowerCase()),
  );

  // Get the meaningful name parts
  let name = kebabCase(filtered.join("-"));

  // Apply numeric scale mapping for spacing/sizing categories
  if (
    useNumericScale &&
    (category === "spacing" || category === "width" || category === "height")
  ) {
    const lastPart = filtered[filtered.length - 1];
    if (lastPart) {
      const numericScale = mapSemanticToNumericScale(lastPart);
      if (numericScale) {
        // Replace the last part with the numeric scale value
        const baseParts = filtered.slice(0, -1);
        name =
          baseParts.length > 0 ? `${kebabCase(baseParts.join("-"))}-${numericScale}` : numericScale;
      }
    }
  }

  // Apply prefix/namespace
  if (namespace) {
    return `${namespace}-${name}`;
  }
  if (prefix) {
    return `${prefix}-${name}`;
  }

  return name;
}

function getSimplifiedCssVarName(
  path: string,
  options: { stripPrefix: string[]; prefix?: string },
): string {
  const { stripPrefix, prefix } = options;

  // Strip prefixes from path
  let simplifiedPath = path;
  if (stripPrefix.length > 0) {
    simplifiedPath = stripTokenPrefix(path, { prefixes: stripPrefix, separator: "." });
  }

  return pathToCssVarName(simplifiedPath, prefix);
}

// ============================================================================
// Category Mapping
// ============================================================================

function getTailwindCategory(token: ProcessedToken): TailwindCategory | null {
  const { type, path } = token;
  const pathLower = path.toLowerCase();

  switch (type) {
    case "color":
      if (pathLower.includes("border")) return "borderColor";
      return "colors";
    case "dimension": {
      if (pathLower.includes("spacing") || pathLower.includes("space") || pathLower.includes("gap"))
        return "spacing";
      if (pathLower.includes("maxwidth") || pathLower.includes("max-width")) return "maxWidth";
      if (pathLower.includes("maxheight") || pathLower.includes("max-height")) return "maxHeight";
      if (pathLower.includes("minwidth") || pathLower.includes("min-width")) return "minWidth";
      if (pathLower.includes("minheight") || pathLower.includes("min-height")) return "minHeight";
      if (pathLower.includes("width")) return "width";
      if (pathLower.includes("height")) return "height";
      if (pathLower.includes("fontsize") || pathLower.includes("font-size")) return "fontSize";
      if (pathLower.includes("lineheight") || pathLower.includes("line-height"))
        return "lineHeight";
      if (
        pathLower.includes("letterspacing") ||
        pathLower.includes("letter-spacing") ||
        pathLower.includes("tracking")
      )
        return "letterSpacing";
      if (
        pathLower.includes("radius") ||
        pathLower.includes("radii") ||
        pathLower.includes("rounded")
      )
        return "borderRadius";
      if (pathLower.includes("border") && pathLower.includes("width")) return "borderWidth";
      return "spacing";
    }
    case "fontFamily":
      return "fontFamily";
    case "fontWeight":
      return "fontWeight";
    case "shadow":
      return "boxShadow";
    case "duration":
      return "transitionDuration";
    case "cubicBezier":
      return "transitionTimingFunction";
    case "number": {
      if (pathLower.includes("opacity")) return "opacity";
      if (pathLower.includes("zindex") || pathLower.includes("z-index")) return "zIndex";
      return null;
    }
    default:
      return null;
  }
}

// ============================================================================
// Token Value Formatting
// ============================================================================

function formatTokenValue(token: ProcessedToken, mode: string, colorFormat: string): string {
  const value = token.toCSS(mode);

  // Format colors if this is a color token
  if (token.type === "color" && colorFormat !== "hex") {
    return convertColorToFormat(value, colorFormat as TailwindPluginConfig["colorFormat"]);
  }

  return value;
}

/**
 * Convert a color value to the specified format
 */
function convertColorToFormat(
  cssValue: string,
  targetFormat: TailwindPluginConfig["colorFormat"],
): string {
  // Skip if not a valid color value or already in target format
  if (!cssValue || typeof cssValue !== "string") {
    return cssValue;
  }

  // Skip CSS variable references
  if (cssValue.startsWith("var(")) {
    return cssValue;
  }

  // Map format to W3C color space
  const colorSpaceMap: Record<NonNullable<TailwindPluginConfig["colorFormat"]>, W3CColorSpace> = {
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
      return converted.hex || formatW3CColorToCSS(converted);
    }

    return formatW3CColorToCSS(converted);
  } catch {
    // If parsing fails, return original value
    return cssValue;
  }
}

// ============================================================================
// V3 Processing (JavaScript Config)
// ============================================================================

function processV3Token(
  token: ProcessedToken,
  theme: Record<string, Record<string, unknown>>,
  category: TailwindCategory,
  tokenName: string,
  value: string,
) {
  if (!theme[category]) {
    theme[category] = {};
  }

  set(theme[category], tokenName, value);
}

// ============================================================================
// V4 Processing (CSS @theme)
// ============================================================================

function processV4Token(
  token: ProcessedToken,
  theme: Record<string, Record<string, unknown>>,
  category: TailwindCategory,
  tokenName: string,
  value: string,
) {
  if (!theme[category]) {
    theme[category] = {};
  }

  set(theme[category], tokenName, value);
}

// ============================================================================
// File Generation
// ============================================================================

function generateV3ConfigFile(
  theme: Record<string, Record<string, unknown>>,
  extend: boolean,
  darkMode: "class" | "media" | false,
  content: string[],
  useTs: boolean,
): string {
  const parts: string[] = [
    "// Auto-generated Tailwind CSS configuration",
    "// Do not edit manually\n",
  ];

  if (useTs) {
    parts.push('import type { Config } from "tailwindcss";\n');
    parts.push("const config: Config = {");
  } else {
    parts.push("/** @type {import('tailwindcss').Config} */");
    parts.push("const config = {");
  }

  // Content
  parts.push(`  content: ${JSON.stringify(content)},`);

  // Dark mode
  if (darkMode) {
    parts.push(`  darkMode: "${darkMode}",`);
  }

  // Theme
  if (extend) {
    parts.push("  theme: {");
    parts.push("    extend: " + serializeObject(theme, 2) + ",");
    parts.push("  },");
  } else {
    parts.push("  theme: " + serializeObject(theme, 1) + ",");
  }

  parts.push("  plugins: [],");
  parts.push("};\n");
  parts.push("export default config;");
  parts.push("export { config as designTokensConfig };");

  return parts.join("\n");
}

function generateV4CssFile(
  theme: Record<string, Record<string, unknown>>,
  darkTheme: Record<string, Record<string, unknown>>,
  namespace?: string,
): string {
  const parts: string[] = [
    "/* Auto-generated Tailwind CSS v4 theme */",
    "/* Do not edit manually */\n",
    "@theme {",
  ];

  // Generate CSS custom properties for each category
  for (const [category, tokens] of Object.entries(theme)) {
    const cssCategory = mapCategoryToCssNamespace(category);
    parts.push(`  /* ${category} */`);

    for (const [name, value] of Object.entries(tokens as Record<string, string>)) {
      const varName = namespace ? `--${cssCategory}-${name}` : `--${cssCategory}-${name}`;
      parts.push(`  ${varName}: ${value};`);
    }
    parts.push("");
  }

  parts.push("}\n");

  // Generate dark mode overrides if any
  const hasDarkTokens =
    Object.keys(darkTheme).length > 0 &&
    Object.values(darkTheme).some((tokens) => Object.keys(tokens).length > 0);

  if (hasDarkTokens) {
    parts.push("@media (prefers-color-scheme: dark) {");
    parts.push("  @theme {");

    for (const [category, tokens] of Object.entries(darkTheme)) {
      if (Object.keys(tokens).length === 0) continue;

      const cssCategory = mapCategoryToCssNamespace(category);

      for (const [name, value] of Object.entries(tokens as Record<string, string>)) {
        const varName = namespace ? `--${cssCategory}-${name}` : `--${cssCategory}-${name}`;
        parts.push(`    ${varName}: ${value};`);
      }
    }

    parts.push("  }");
    parts.push("}");
  }

  return parts.join("\n");
}

function generateCssVarsFile(vars: Record<string, string>, selector: string): string {
  const lines = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");

  return `${selector} {\n${lines}\n}\n`;
}

function mapCategoryToCssNamespace(category: string): string {
  const mapping: Record<string, string> = {
    colors: "color",
    spacing: "spacing",
    fontSize: "font-size",
    fontWeight: "font-weight",
    fontFamily: "font-family",
    lineHeight: "line-height",
    letterSpacing: "letter-spacing",
    borderRadius: "radius",
    boxShadow: "shadow",
    transitionTimingFunction: "ease",
    transitionDuration: "duration",
    borderWidth: "border-width",
    borderColor: "border-color",
    zIndex: "z",
    opacity: "opacity",
    width: "width",
    height: "height",
    maxWidth: "max-width",
    maxHeight: "max-height",
    minWidth: "min-width",
    minHeight: "min-height",
  };
  return mapping[category] || kebabCase(category);
}

function serializeObject(obj: unknown, indent = 0): string {
  const spaces = "  ".repeat(indent);

  if (obj === null || obj === undefined) {
    return "undefined";
  }

  if (typeof obj === "string") {
    return `"${obj}"`;
  }

  if (typeof obj === "number" || typeof obj === "boolean") {
    return String(obj);
  }

  if (Array.isArray(obj)) {
    const items = obj.map((item) => serializeObject(item, indent + 1)).join(", ");
    return `[${items}]`;
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "{}";

    const props = entries
      .map(([key, value]) => {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        return `${spaces}  ${safeKey}: ${serializeObject(value, indent + 1)}`;
      })
      .join(",\n");

    return `{\n${props}\n${spaces}}`;
  }

  return String(obj);
}
