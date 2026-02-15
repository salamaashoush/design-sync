import {
  createFileBuilder,
  createModeRecord,
  definePlugin,
  getModesToIterate,
} from "@design-sync/manager";
import { camelCase, set } from "@design-sync/utils";
import { type ProcessedToken, isTokenAlias } from "@design-sync/w3c-dtfm";

export interface TamaguiPluginConfig {
  /** Output directory for generated files (relative to main out dir) */
  outDir?: string;
  /** Generate TypeScript files */
  useTs?: boolean;
  /** Prefix for theme names */
  themePrefix?: string;
  /**
   * Generate shorthand property mappings
   * @default true
   */
  generateShorthands?: boolean;
  /**
   * Include web-specific tokens
   * @default true
   */
  includeWeb?: boolean;
  /**
   * Include native-specific tokens
   * @default true
   */
  includeNative?: boolean;
  /**
   * Media query configuration
   */
  media?: Record<string, { maxWidth?: number; minWidth?: number }>;
}

type TamaguiTokenCategory =
  | "color"
  | "space"
  | "size"
  | "radius"
  | "zIndex"
  | "font"
  | "fontSize"
  | "fontWeight"
  | "lineHeight"
  | "letterSpacing";

/**
 * Tamagui Plugin - Exports design tokens as Tamagui configuration
 *
 * Creates unified configuration for web and React Native via Tamagui.
 *
 * @example
 * ```typescript
 * // design-sync.config.ts
 * import { tamaguiPlugin } from '@design-sync/tamagui-plugin';
 *
 * export default {
 *   plugins: [tamaguiPlugin({
 *     themePrefix: 'app',
 *     generateShorthands: true,
 *     includeWeb: true,
 *     includeNative: true
 *   })],
 * };
 * ```
 *
 * Usage in tamagui.config.ts:
 * ```typescript
 * import { tokens, themes } from './tokens/tamagui.config';
 * import { createTamagui } from 'tamagui';
 *
 * const config = createTamagui({ tokens, themes });
 * export default config;
 * ```
 */
export function tamaguiPlugin(config: TamaguiPluginConfig = {}): ReturnType<typeof definePlugin> {
  const {
    outDir = "",
    useTs = true,
    themePrefix = "",
    generateShorthands = true,
    includeWeb: _includeWeb = true,
    includeNative: _includeNative = true,
    media,
  } = config;

  return definePlugin("tamagui-plugin", (context) => {
    const { modes } = context;
    const builder = createFileBuilder(outDir);
    const ext = useTs ? "ts" : "js";

    // Collect tokens
    const tokensByCategory: Record<string, Record<string, unknown>> = {};
    const themeTokens = createModeRecord<Record<string, unknown>>(modes, () => ({}));

    // Process all tokens
    context.query().forEach((token) => {
      const category = getTamaguiCategory(token);
      if (!category) return;

      // Color tokens go into themes, others go into tokens
      if (category === "color") {
        processThemeToken(token, themeTokens, modes.defaultMode);
      } else {
        processToken(token, tokensByCategory, category, modes.defaultMode);
      }
    });

    // Generate tokens file
    builder.add(`tokens.${ext}`, generateTokensFile(tokensByCategory, useTs), ext as "ts" | "js");

    // Generate themes file
    builder.add(
      `themes.${ext}`,
      generateThemesFile(themeTokens, modes, themePrefix, useTs),
      ext as "ts" | "js",
    );

    // Generate main config file
    builder.add(
      `tamagui.config.${ext}`,
      generateConfigFile(media, generateShorthands, useTs),
      ext as "ts" | "js",
    );

    // Generate shorthands if requested
    if (generateShorthands) {
      builder.add(`shorthands.${ext}`, generateShorthandsFile(useTs), ext as "ts" | "js");
    }

    return builder.build();
  });
}

// ============================================================================
// Token Category Mapping
// ============================================================================

function getTamaguiCategory(token: ProcessedToken): TamaguiTokenCategory | null {
  const { type, path } = token;
  const pathLower = path.toLowerCase();

  switch (type) {
    case "color":
      return "color";
    case "dimension": {
      if (pathLower.includes("spacing") || pathLower.includes("space") || pathLower.includes("gap"))
        return "space";
      if (pathLower.includes("width") || pathLower.includes("height") || pathLower.includes("size"))
        return "size";
      if (pathLower.includes("fontsize") || pathLower.includes("font-size")) return "fontSize";
      if (pathLower.includes("lineheight") || pathLower.includes("line-height"))
        return "lineHeight";
      if (
        pathLower.includes("letterspacing") ||
        pathLower.includes("letter-spacing") ||
        pathLower.includes("tracking")
      )
        return "letterSpacing";
      if (pathLower.includes("radius") || pathLower.includes("radii")) return "radius";
      return "space";
    }
    case "fontFamily":
      return "font";
    case "fontWeight":
      return "fontWeight";
    case "number": {
      if (pathLower.includes("zindex") || pathLower.includes("z-index")) return "zIndex";
      return null;
    }
    default:
      return null;
  }
}

function getTokenName(path: string): string {
  const parts = path.split(".");
  // Get meaningful parts
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
        "sizes",
        "size",
      ].includes(p.toLowerCase()),
  );
  return camelCase(filtered.join("-"));
}

// ============================================================================
// Token Processing
// ============================================================================

function processToken(
  token: ProcessedToken,
  tokens: Record<string, Record<string, unknown>>,
  category: TamaguiTokenCategory,
  mode: string,
) {
  if (!tokens[category]) {
    tokens[category] = {};
  }

  const name = getTokenName(token.path);
  const value = convertToTamaguiValue(token, mode, category);
  set(tokens[category], name, value);
}

function processThemeToken(
  token: ProcessedToken,
  themeTokens: Record<string, Record<string, unknown>>,
  _defaultMode: string,
) {
  const name = getTokenName(token.path);

  // Add to each mode
  for (const mode of Object.keys(themeTokens)) {
    const value = token.toCSS(mode);
    set(themeTokens[mode], name, value);
  }
}

function convertToTamaguiValue(
  token: ProcessedToken,
  mode: string,
  category: TamaguiTokenCategory,
): unknown {
  const value = token.getValue(mode);

  if (isTokenAlias(value)) {
    // Convert to Tamagui token reference
    const path = String(value).replace(/^\{|\}$/g, "");
    return `$${camelCase(path)}`;
  }

  const cssValue = token.toCSS(mode);

  // Convert dimension values to numbers for Tamagui (React Native needs numbers)
  if (["space", "size", "radius", "fontSize", "lineHeight", "letterSpacing"].includes(category)) {
    const numMatch = cssValue.match(/^(-?\d+(?:\.\d+)?)/);
    if (numMatch) {
      return parseFloat(numMatch[1]);
    }
  }

  return cssValue;
}

// ============================================================================
// File Generation
// ============================================================================

function generateTokensFile(
  tokensByCategory: Record<string, Record<string, unknown>>,
  useTs: boolean,
): string {
  const parts: string[] = [
    "// Auto-generated Tamagui tokens",
    "// Do not edit manually\n",
    'import { createTokens } from "tamagui";\n',
  ];

  // Generate token definitions
  for (const [category, tokens] of Object.entries(tokensByCategory)) {
    parts.push(`export const ${category} = ${serializeObject(tokens)} as const;\n`);
  }

  // Create combined tokens
  parts.push("export const tokens = createTokens({");
  for (const category of Object.keys(tokensByCategory)) {
    parts.push(`  ${category},`);
  }
  parts.push("});\n");

  if (useTs) {
    parts.push("export type Tokens = typeof tokens;");
  }

  return parts.join("\n");
}

function generateThemesFile(
  themeTokens: Record<string, Record<string, unknown>>,
  modes: { defaultMode: string; requiredModes: readonly string[] },
  themePrefix: string,
  useTs: boolean,
): string {
  const parts: string[] = ["// Auto-generated Tamagui themes", "// Do not edit manually\n"];

  // Generate each theme
  for (const [mode, tokens] of Object.entries(themeTokens)) {
    const themeName = themePrefix ? `${themePrefix}${capitalize(mode)}` : mode;
    parts.push(`export const ${themeName}Theme = ${serializeObject(tokens)} as const;\n`);
  }

  // Create themes object
  parts.push("export const themes = {");
  for (const mode of getModesToIterate(modes as any)) {
    const themeName = themePrefix ? `${themePrefix}${capitalize(mode)}` : mode;
    parts.push(`  ${mode}: ${themeName}Theme,`);
  }
  parts.push("} as const;\n");

  if (useTs) {
    parts.push("export type Theme = typeof themes[keyof typeof themes];");
    parts.push("export type ThemeName = keyof typeof themes;");
  }

  return parts.join("\n");
}

function generateConfigFile(
  media: TamaguiPluginConfig["media"],
  includeShorthands: boolean,
  useTs: boolean,
): string {
  const parts: string[] = [
    "// Auto-generated Tamagui configuration",
    "// Do not edit manually\n",
    'import { createTamagui } from "tamagui";',
    'import { tokens } from "./tokens";',
    'import { themes } from "./themes";',
  ];

  if (includeShorthands) {
    parts.push('import { shorthands } from "./shorthands";');
  }

  parts.push("");

  // Media configuration
  if (media) {
    parts.push("const media = {");
    for (const [name, query] of Object.entries(media)) {
      const conditions: string[] = [];
      if (query.minWidth !== undefined) {
        conditions.push(`minWidth: ${query.minWidth}`);
      }
      if (query.maxWidth !== undefined) {
        conditions.push(`maxWidth: ${query.maxWidth}`);
      }
      parts.push(`  ${name}: { ${conditions.join(", ")} },`);
    }
    parts.push("};\n");
  }

  // Create config
  parts.push("const config = createTamagui({");
  parts.push("  tokens,");
  parts.push("  themes,");
  if (includeShorthands) {
    parts.push("  shorthands,");
  }
  if (media) {
    parts.push("  media,");
  }
  parts.push("});\n");

  parts.push("export default config;\n");

  if (useTs) {
    parts.push("export type AppConfig = typeof config;\n");
    parts.push('declare module "tamagui" {');
    parts.push("  interface TamaguiCustomConfig extends AppConfig {}");
    parts.push("}");
  }

  return parts.join("\n");
}

function generateShorthandsFile(useTs: boolean): string {
  const shorthands = {
    // Spacing
    p: "padding",
    pt: "paddingTop",
    pr: "paddingRight",
    pb: "paddingBottom",
    pl: "paddingLeft",
    px: "paddingHorizontal",
    py: "paddingVertical",
    m: "margin",
    mt: "marginTop",
    mr: "marginRight",
    mb: "marginBottom",
    ml: "marginLeft",
    mx: "marginHorizontal",
    my: "marginVertical",
    // Sizing
    w: "width",
    h: "height",
    minW: "minWidth",
    minH: "minHeight",
    maxW: "maxWidth",
    maxH: "maxHeight",
    // Colors
    bg: "backgroundColor",
    // Border
    br: "borderRadius",
    bw: "borderWidth",
    bc: "borderColor",
    // Flex
    f: "flex",
    fd: "flexDirection",
    fw: "flexWrap",
    ai: "alignItems",
    jc: "justifyContent",
    // Position
    pos: "position",
    t: "top",
    r: "right",
    b: "bottom",
    l: "left",
    // Text
    ta: "textAlign",
    tt: "textTransform",
    // Other
    o: "opacity",
    ov: "overflow",
    zi: "zIndex",
    cur: "cursor",
  };

  const parts: string[] = [
    "// Auto-generated Tamagui shorthands",
    "// Do not edit manually\n",
    `export const shorthands = ${serializeObject(shorthands)} as const;`,
  ];

  if (useTs) {
    parts.push("\nexport type Shorthands = typeof shorthands;");
  }

  return parts.join("\n");
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
