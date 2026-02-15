import {
  createFileBuilder,
  createModeRecord,
  definePlugin,
  getModesToIterate,
  getValueDifferences,
  stripTokenPrefix,
} from "@design-sync/manager";
import { kebabCase, set } from "@design-sync/utils";
import {
  type ProcessedToken,
  isTokenAlias,
  pathToCssVarName,
  processCssVarRef,
  typographyToCssStyle,
} from "@design-sync/w3c-dtfm";

export interface UnoCSSPluginConfig {
  /** Output directory for generated files (relative to main out dir) */
  outDir?: string;
  /** Output format: 'theme' for theme config, 'preset' for UnoCSS preset */
  format?: "theme" | "preset";
  /**
   * Use CSS variables for values
   * @default false
   */
  useCssVars?: boolean;
  /** Prefix for CSS variable names and token references */
  prefix?: string;
  /**
   * Generate typography shortcuts
   * @default true
   */
  generateShortcuts?: boolean;
  /**
   * Generate TypeScript types
   * @default true
   */
  generateTypes?: boolean;
  /**
   * Custom breakpoints mapping
   */
  breakpoints?: Record<string, string>;
  /**
   * Dark mode selector
   * @default '[data-theme="dark"]'
   */
  darkModeSelector?: string;

  // NEW ERGONOMIC OPTIONS

  /**
   * Generate CSS variable preflights for theming
   * @default true when useCssVars is true
   */
  generatePreflights?: boolean;

  /**
   * Strip design system prefix from token names
   * @example ['kda', 'foundation'] removes these from all token names
   */
  stripPrefix?: string | string[];

  /**
   * Semantic token aliases for easier access
   * Maps semantic names to CSS properties
   * @example { bg: 'backgroundColor', text: 'color' }
   */
  semanticAliases?: Record<string, string>;

  /**
   * Dynamic shortcut generation from token groups (e.g., typography)
   * @default false
   */
  dynamicShortcuts?: boolean;

  /**
   * Only include dark mode values that differ from light mode
   * Reduces output size by not repeating unchanged values
   * @default false
   */
  minifyDarkMode?: boolean;
}

type ThemeCategory =
  | "colors"
  | "spacing"
  | "width"
  | "height"
  | "fontSize"
  | "fontWeight"
  | "fontFamily"
  | "lineHeight"
  | "letterSpacing"
  | "borderRadius"
  | "boxShadow"
  | "duration"
  | "easing"
  | "borderWidth"
  | "borderColor"
  | "zIndex"
  | "opacity";

/**
 * UnoCSS Plugin - Exports design tokens as UnoCSS theme configuration
 *
 * Creates theme configuration and optional shortcuts for UnoCSS.
 *
 * @example
 * ```typescript
 * // design-sync.config.ts
 * import { unoCSSPlugin } from '@design-sync/unocss-plugin';
 *
 * export default {
 *   plugins: [unoCSSPlugin({
 *     format: 'preset',
 *     useCssVars: true,
 *     generatePreflights: true,
 *     stripPrefix: ['kda', 'foundation'],
 *     minifyDarkMode: true,
 *     dynamicShortcuts: true,
 *   })],
 * };
 * ```
 *
 * Usage in uno.config.ts:
 * ```typescript
 * import { designTokensPreset } from './tokens/preset';
 *
 * export default defineConfig({
 *   presets: [designTokensPreset()],
 * });
 * ```
 */
export function unoCSSPlugin(config: UnoCSSPluginConfig = {}): ReturnType<typeof definePlugin> {
  const {
    outDir = "",
    format = "theme",
    useCssVars = false,
    prefix,
    generateShortcuts = true,
    generateTypes = true,
    breakpoints,
    darkModeSelector = '[data-theme="dark"]',
    // New options
    generatePreflights = useCssVars,
    stripPrefix,
    semanticAliases = {},
    dynamicShortcuts = false,
    minifyDarkMode = false,
  } = config;

  const stripPrefixArray = stripPrefix
    ? Array.isArray(stripPrefix)
      ? stripPrefix
      : stripPrefix.split(".")
    : [];

  return definePlugin("unocss-plugin", (context) => {
    const { modes } = context;
    const builder = createFileBuilder(outDir);

    // Collect theme tokens
    const theme: Record<string, Record<string, unknown>> = {};
    const shortcuts: Array<[string, string]> = [];
    const cssVars = createModeRecord<Record<string, string>>(modes, () => ({}));

    // Process all tokens
    context.query().forEach((token) => {
      const category = getThemeCategory(token);
      if (!category) return;

      if (token.type === "typography" && (generateShortcuts || dynamicShortcuts)) {
        processTypographyShortcut(
          token,
          shortcuts,
          modes.defaultMode,
          useCssVars,
          prefix,
          stripPrefixArray,
        );
      } else {
        processThemeToken(
          token,
          theme,
          cssVars,
          category,
          modes,
          useCssVars,
          prefix,
          stripPrefixArray,
        );
      }
    });

    // Add custom breakpoints if provided
    if (breakpoints) {
      theme["breakpoints"] = breakpoints;
    }

    // Apply semantic aliases to theme categories
    const aliasedTheme = applySemanticAliases(theme, semanticAliases);

    // Apply minifyDarkMode if enabled
    let darkModeVars = cssVars["dark"] || {};
    if (minifyDarkMode && cssVars[modes.defaultMode]) {
      darkModeVars = getValueDifferences(cssVars[modes.defaultMode], darkModeVars);
    }

    // Generate output based on format
    if (format === "preset") {
      builder.addTs(
        "preset.ts",
        generatePresetFile(
          aliasedTheme,
          shortcuts,
          generateShortcuts || dynamicShortcuts,
          useCssVars && generatePreflights,
          cssVars[modes.defaultMode],
          darkModeVars,
          darkModeSelector,
        ),
      );
    } else {
      builder.addTs(
        "theme.ts",
        generateThemeFile(aliasedTheme, shortcuts, generateShortcuts || dynamicShortcuts),
      );
    }

    // Generate CSS variables files if using CSS vars (separate files approach)
    if (useCssVars && !generatePreflights) {
      for (const mode of getModesToIterate(modes)) {
        const isDefault = mode === modes.defaultMode;
        let varsToOutput = cssVars[mode];

        // Apply minifyDarkMode for non-default modes
        if (minifyDarkMode && !isDefault) {
          varsToOutput = getValueDifferences(cssVars[modes.defaultMode], cssVars[mode]);
        }

        if (Object.keys(varsToOutput).length > 0) {
          builder.add(
            isDefault ? "variables.css" : `variables.${mode}.css`,
            generateCssVarsFile(varsToOutput, isDefault ? ":root" : `[data-theme="${mode}"]`),
            "css",
          );
        }
      }
    }

    // Generate types if requested
    if (generateTypes) {
      builder.addTs("types.ts", generateTypesFile(aliasedTheme));
    }

    return builder.build();
  });
}

// ============================================================================
// Theme Category Mapping
// ============================================================================

function getThemeCategory(token: ProcessedToken): ThemeCategory | null {
  const { type, path } = token;
  const pathLower = path.toLowerCase();

  switch (type) {
    case "color":
      if (pathLower.includes("border")) return "borderColor";
      return "colors";
    case "dimension": {
      if (pathLower.includes("spacing") || pathLower.includes("space")) return "spacing";
      if (pathLower.includes("width") && !pathLower.includes("border")) return "width";
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
      if (pathLower.includes("radius") || pathLower.includes("radii")) return "borderRadius";
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
      return "duration";
    case "cubicBezier":
      return "easing";
    case "number": {
      if (pathLower.includes("opacity")) return "opacity";
      if (pathLower.includes("zindex") || pathLower.includes("z-index")) return "zIndex";
      return null;
    }
    default:
      return null;
  }
}

function getTokenName(path: string, prefix?: string, stripPrefixArray: string[] = []): string {
  // Strip prefixes first
  let simplifiedPath = path;
  if (stripPrefixArray.length > 0) {
    simplifiedPath = stripTokenPrefix(path, { prefixes: stripPrefixArray, separator: "." });
  }

  const parts = simplifiedPath.split(".");
  // Filter common category prefixes
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

  const name = kebabCase(filtered.join("-"));
  return prefix ? `${prefix}-${name}` : name;
}

function getCssVarName(path: string, prefix?: string, stripPrefixArray: string[] = []): string {
  // Strip prefixes first
  let simplifiedPath = path;
  if (stripPrefixArray.length > 0) {
    simplifiedPath = stripTokenPrefix(path, { prefixes: stripPrefixArray, separator: "." });
  }

  return pathToCssVarName(simplifiedPath, prefix);
}

// ============================================================================
// Token Processing
// ============================================================================

function processThemeToken(
  token: ProcessedToken,
  theme: Record<string, Record<string, unknown>>,
  cssVars: Record<string, Record<string, string>>,
  category: ThemeCategory,
  modes: { defaultMode: string; requiredModes: readonly string[] },
  useCssVars: boolean,
  prefix?: string,
  stripPrefixArray: string[] = [],
) {
  if (!theme[category]) {
    theme[category] = {};
  }

  const tokenName = getTokenName(token.path, prefix, stripPrefixArray);

  if (useCssVars) {
    // Store CSS var reference in theme
    const cssVarName = getCssVarName(token.path, prefix, stripPrefixArray);
    set(theme[category], tokenName, `var(${cssVarName})`);

    // Store actual values in CSS vars records
    for (const mode of getModesToIterate(modes as any)) {
      const cssValue = token.toCSS(mode);
      cssVars[mode][cssVarName] = processTokenValue(cssValue);
    }
  } else {
    // Store value directly
    set(theme[category], tokenName, processTokenValue(token.toCSS(modes.defaultMode)));
  }
}

function processTypographyShortcut(
  token: ProcessedToken,
  shortcuts: Array<[string, string]>,
  defaultMode: string,
  useCssVars: boolean,
  prefix?: string,
  stripPrefixArray: string[] = [],
) {
  const value = token.getValue(defaultMode);
  const style = typographyToCssStyle(value);

  if (isTokenAlias(style) || typeof style !== "object") return;

  // Get simplified shortcut name
  let shortcutName = token.name;
  if (stripPrefixArray.length > 0) {
    const simplified = stripTokenPrefix(token.path, { prefixes: stripPrefixArray, separator: "." });
    const parts = simplified.split(".");
    shortcutName = parts[parts.length - 1] || token.name;
  }
  shortcutName = `text-${kebabCase(shortcutName)}`;

  const classes: string[] = [];

  const styleObj = style as Record<string, unknown>;

  if (styleObj.fontFamily) {
    const fontValue = useCssVars
      ? String(processCssVarRef(String(styleObj.fontFamily), prefix))
      : String(styleObj.fontFamily);
    classes.push(`font-[${fontValue.replace(/\s+/g, "_")}]`);
  }
  if (styleObj.fontSize) {
    classes.push(`text-[${styleObj.fontSize}]`);
  }
  if (styleObj.fontWeight) {
    classes.push(`font-${styleObj.fontWeight}`);
  }
  if (styleObj.lineHeight) {
    classes.push(`leading-[${styleObj.lineHeight}]`);
  }
  if (styleObj.letterSpacing) {
    classes.push(`tracking-[${styleObj.letterSpacing}]`);
  }

  if (classes.length > 0) {
    shortcuts.push([shortcutName, classes.join(" ")]);
  }
}

function processTokenValue(value: string | number): string {
  return String(value);
}

function applySemanticAliases(
  theme: Record<string, Record<string, unknown>>,
  aliases: Record<string, string>,
): Record<string, Record<string, unknown>> {
  if (Object.keys(aliases).length === 0) return theme;

  const aliasedTheme: Record<string, Record<string, unknown>> = { ...theme };

  // Create aliases that point to existing categories
  for (const [alias, targetCategory] of Object.entries(aliases)) {
    if (theme[targetCategory]) {
      aliasedTheme[alias] = theme[targetCategory];
    }
  }

  return aliasedTheme;
}

// ============================================================================
// File Generation
// ============================================================================

function generatePresetFile(
  theme: Record<string, Record<string, unknown>>,
  shortcuts: Array<[string, string]>,
  includeShortcuts: boolean,
  includePreflights: boolean,
  lightVars?: Record<string, string>,
  darkVars?: Record<string, string>,
  darkModeSelector?: string,
): string {
  const parts: string[] = [
    "// Auto-generated UnoCSS preset",
    "// Do not edit manually\n",
    'import { definePreset, type Preset } from "unocss";\n',
    "export const designTokensPreset = definePreset((): Preset => ({",
    '  name: "design-tokens",',
    `  theme: ${serializeObject(theme)},`,
  ];

  // Add preflights if enabled
  if (includePreflights && lightVars) {
    const lightCss = serializePreflightCss(lightVars, ":root");
    const darkCss =
      darkVars && Object.keys(darkVars).length > 0
        ? serializePreflightCss(darkVars, darkModeSelector || '[data-theme="dark"]')
        : "";

    parts.push(`  preflights: [
    {
      getCSS: () => \`
${lightCss}${darkCss ? "\n" + darkCss : ""}
      \`,
    },
  ],`);
  }

  if (includeShortcuts && shortcuts.length > 0) {
    parts.push(`  shortcuts: ${serializeShortcuts(shortcuts)},`);
  }

  parts.push("}));\n");
  parts.push("export default designTokensPreset;");

  return parts.join("\n");
}

function generateThemeFile(
  theme: Record<string, Record<string, unknown>>,
  shortcuts: Array<[string, string]>,
  includeShortcuts: boolean,
): string {
  const parts: string[] = [
    "// Auto-generated UnoCSS theme",
    "// Do not edit manually\n",
    'import type { Theme } from "unocss/preset-mini";\n',
    `export const designTokensTheme: Theme = ${serializeObject(theme)};\n`,
  ];

  if (includeShortcuts && shortcuts.length > 0) {
    parts.push(`export const shortcuts = ${serializeShortcuts(shortcuts)};\n`);
  }

  parts.push("export default designTokensTheme;");

  return parts.join("\n");
}

function generateCssVarsFile(vars: Record<string, string>, selector: string): string {
  const lines = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");

  return `${selector} {\n${lines}\n}\n`;
}

function generateTypesFile(theme: Record<string, Record<string, unknown>>): string {
  const parts: string[] = [
    "// Auto-generated UnoCSS types",
    "// Do not edit manually\n",
    'import type { Theme } from "unocss/preset-mini";\n',
    "export interface DesignTokensTheme extends Theme {",
  ];

  for (const [category, tokens] of Object.entries(theme)) {
    parts.push(`  ${category}?: {`);
    for (const name of Object.keys(tokens)) {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$-]*$/.test(name) ? name : `"${name}"`;
      parts.push(`    ${safeKey}?: string;`);
    }
    parts.push("  };");
  }

  parts.push("}\n");

  // Add helper types for common categories
  parts.push("// Helper types for common categories");
  if (theme.colors) {
    parts.push("export type ThemeColors = keyof NonNullable<DesignTokensTheme['colors']>;");
  }
  if (theme.spacing) {
    parts.push("export type ThemeSpacing = keyof NonNullable<DesignTokensTheme['spacing']>;");
  }
  if (theme.fontSize) {
    parts.push("export type ThemeFontSize = keyof NonNullable<DesignTokensTheme['fontSize']>;");
  }

  return parts.join("\n");
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

function serializeShortcuts(shortcuts: Array<[string, string]>): string {
  const entries = shortcuts.map(([name, value]) => `  ["${name}", "${value}"]`).join(",\n");
  return `[\n${entries}\n]`;
}

function serializePreflightCss(vars: Record<string, string>, selector: string): string {
  if (Object.keys(vars).length === 0) return "";

  const lines = Object.entries(vars)
    .map(([name, value]) => `          ${name}: ${value};`)
    .join("\n");

  return `        ${selector} {
${lines}
        }`;
}
