import { createFileBuilder, definePlugin, stripTokenPrefix } from "@design-sync/manager";
import { camelCase, set } from "@design-sync/utils";
import { type ProcessedToken, isTokenAlias } from "@design-sync/w3c-dtfm";

export interface PandaPluginConfig {
  /** Output directory for generated files (relative to main out dir) */
  outDir?: string;
  /** Output format: 'preset' for Panda preset, 'config' for direct config */
  format?: "preset" | "config";
  /**
   * Use semantic tokens for mode-aware values
   * @default true
   */
  useSemanticTokens?: boolean;
  /**
   * Generate TypeScript types
   * @default true
   */
  generateTypes?: boolean;
  /** Prefix for token names */
  prefix?: string;
  /** Custom conditions for modes and breakpoints */
  conditions?: {
    breakpoints?: Record<string, string>;
    colorMode?: { dark?: string; light?: string };
  };

  // NEW ERGONOMIC OPTIONS

  /**
   * Preserve token nesting from paths
   * When true, generates hierarchical token structure
   * @default false
   */
  preserveHierarchy?: boolean;

  /**
   * Token grouping strategy
   * - 'flat': Flat token names like "kdaFoundationXl"
   * - 'hierarchical': Nested structure preserving path hierarchy
   * - 'semantic': Groups by semantic category (colors, spacing, etc.)
   * @default 'flat'
   */
  groupingStrategy?: "flat" | "hierarchical" | "semantic";

  /**
   * Strip prefix from token paths
   * @example ['kda', 'foundation'] removes these from all token paths
   */
  stripPrefix?: string | string[];

  /**
   * Generate component recipes from token patterns
   * @default false
   */
  generateRecipes?: boolean;
}

type TokenCategory =
  | "colors"
  | "spacing"
  | "sizes"
  | "fontSizes"
  | "fontWeights"
  | "fonts"
  | "lineHeights"
  | "letterSpacings"
  | "radii"
  | "shadows"
  | "durations"
  | "easings"
  | "borders"
  | "gradients"
  | "zIndex"
  | "opacity";

/**
 * Panda CSS Plugin - Exports design tokens as Panda CSS presets
 *
 * Panda CSS has native W3C DTFM support, making transformation minimal.
 * Creates a preset file that can be used in panda.config.ts.
 *
 * @example
 * ```typescript
 * // design-sync.config.ts
 * import { pandaPlugin } from '@design-sync/panda-plugin';
 *
 * export default {
 *   plugins: [pandaPlugin({
 *     format: 'preset',
 *     preserveHierarchy: true,
 *     stripPrefix: ['kda', 'foundation'],
 *     groupingStrategy: 'semantic',
 *   })],
 * };
 * ```
 *
 * Usage in panda.config.ts:
 * ```typescript
 * import { designTokensPreset } from './tokens/preset';
 *
 * export default defineConfig({
 *   presets: [designTokensPreset],
 * });
 * ```
 */
export function pandaPlugin(config: PandaPluginConfig = {}): ReturnType<typeof definePlugin> {
  const {
    outDir = "",
    format = "preset",
    useSemanticTokens = true,
    generateTypes = true,
    prefix,
    conditions,
    // New options
    preserveHierarchy = false,
    groupingStrategy = "flat",
    stripPrefix,
    generateRecipes = false,
  } = config;

  const stripPrefixArray = stripPrefix
    ? Array.isArray(stripPrefix)
      ? stripPrefix
      : stripPrefix.split(".")
    : [];

  const useHierarchy =
    preserveHierarchy || groupingStrategy === "hierarchical" || groupingStrategy === "semantic";

  return definePlugin("panda-plugin", (context) => {
    const { modes } = context;
    const builder = createFileBuilder(outDir);

    // Collect tokens by category
    const tokens: Record<string, Record<string, unknown>> = {};
    const semanticTokens: Record<string, Record<string, unknown>> = {};

    // For hierarchical mode, collect as entries
    const tokenEntries: Array<[string, { value: string }]> = [];
    const semanticEntries: Array<[string, Record<string, unknown>]> = [];

    // Process all tokens
    context.query().forEach((token) => {
      const category = getTokenCategory(token);
      if (!category) return;

      if (useHierarchy) {
        processHierarchicalToken(
          token,
          tokenEntries,
          semanticEntries,
          category,
          modes.defaultMode,
          stripPrefixArray,
          groupingStrategy,
          useSemanticTokens,
        );
      } else {
        const tokenName = getTokenName(token.path, prefix, stripPrefixArray);

        if (useSemanticTokens && token.isMultiMode) {
          processSemanticToken(token, semanticTokens, category, tokenName, modes.defaultMode);
        } else {
          processToken(token, tokens, category, tokenName, modes.defaultMode);
        }
      }
    });

    // Build final token objects for hierarchical mode
    let finalTokens = tokens;
    let finalSemanticTokens = semanticTokens;

    if (useHierarchy) {
      finalTokens = buildNestedTokens(tokenEntries);
      finalSemanticTokens = buildNestedSemanticTokens(semanticEntries);
    }

    // Generate output based on format
    if (format === "preset") {
      builder.addTs(
        "preset.ts",
        generatePresetFile(finalTokens, finalSemanticTokens, conditions, useSemanticTokens),
      );
    } else {
      builder.addTs(
        "tokens.ts",
        generateTokensFile(finalTokens, finalSemanticTokens, useSemanticTokens),
      );
    }

    // Generate types if requested
    if (generateTypes) {
      builder.addTs(
        "types.ts",
        generateTypesFile(finalTokens, finalSemanticTokens, useSemanticTokens),
      );
    }

    // Generate recipes if requested
    if (generateRecipes) {
      const recipes = detectAndBuildRecipes(context.query().toArray(), stripPrefixArray);
      if (Object.keys(recipes).length > 0) {
        builder.addTs("recipes.ts", generateRecipesFile(recipes));
      }
    }

    return builder.build();
  });
}

// ============================================================================
// Token Category Mapping
// ============================================================================

function getTokenCategory(token: ProcessedToken): TokenCategory | null {
  const { type, path } = token;
  const pathLower = path.toLowerCase();

  switch (type) {
    case "color":
      return "colors";
    case "dimension": {
      if (pathLower.includes("spacing") || pathLower.includes("space")) return "spacing";
      if (pathLower.includes("size")) return "sizes";
      if (pathLower.includes("fontsize") || pathLower.includes("font-size")) return "fontSizes";
      if (pathLower.includes("lineheight") || pathLower.includes("line-height"))
        return "lineHeights";
      if (
        pathLower.includes("letterspacing") ||
        pathLower.includes("letter-spacing") ||
        pathLower.includes("tracking")
      )
        return "letterSpacings";
      if (pathLower.includes("radius") || pathLower.includes("radii")) return "radii";
      if (pathLower.includes("zindex") || pathLower.includes("z-index")) return "zIndex";
      return "sizes";
    }
    case "fontFamily":
      return "fonts";
    case "fontWeight":
      return "fontWeights";
    case "shadow":
      return "shadows";
    case "duration":
      return "durations";
    case "cubicBezier":
      return "easings";
    case "border":
      return "borders";
    case "gradient":
      return "gradients";
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
  // Remove common prefixes like 'colors', 'spacing', etc.
  const filtered = parts.filter(
    (p) =>
      !["colors", "spacing", "sizes", "typography", "fonts", "shadows", "borders"].includes(
        p.toLowerCase(),
      ),
  );
  const name = camelCase(filtered.join("-"));
  return prefix ? `${prefix}${name.charAt(0).toUpperCase()}${name.slice(1)}` : name;
}

function getHierarchicalTokenPath(
  path: string,
  category: TokenCategory,
  stripPrefixArray: string[],
  groupingStrategy: string,
): string {
  // Strip prefixes first
  let simplifiedPath = path;
  if (stripPrefixArray.length > 0) {
    simplifiedPath = stripTokenPrefix(path, { prefixes: stripPrefixArray, separator: "." });
  }

  // For semantic grouping, ensure category is at the root
  if (groupingStrategy === "semantic") {
    const parts = simplifiedPath.split(".");
    // Remove category-like parts from path to avoid duplication
    const filtered = parts.filter(
      (p) =>
        ![
          "colors",
          "color",
          "spacing",
          "space",
          "sizes",
          "size",
          "fonts",
          "font",
          "shadows",
          "shadow",
          "borders",
          "border",
          "radii",
          "radius",
        ].includes(p.toLowerCase()),
    );
    return `${category}.${filtered.join(".")}`;
  }

  return simplifiedPath;
}

// ============================================================================
// Token Processing
// ============================================================================

function processToken(
  token: ProcessedToken,
  tokens: Record<string, Record<string, unknown>>,
  category: TokenCategory,
  name: string,
  defaultMode: string,
) {
  if (!tokens[category]) {
    tokens[category] = {};
  }

  const value = formatTokenValue(token, defaultMode);
  set(tokens[category], name, { value });
}

function processSemanticToken(
  token: ProcessedToken,
  semanticTokens: Record<string, Record<string, unknown>>,
  category: TokenCategory,
  name: string,
  defaultMode: string,
) {
  if (!semanticTokens[category]) {
    semanticTokens[category] = {};
  }

  const modeValues = token.modeValues;
  const value: Record<string, unknown> = {
    value: formatTokenValue(token, defaultMode),
  };

  // Add mode-specific values with CORRECT condition keys (no underscore prefix)
  for (const [mode, _modeValue] of Object.entries(modeValues)) {
    if (mode === defaultMode) continue;

    // Use correct Panda condition names WITHOUT underscore prefix
    const condition = mapModeToCondition(mode);
    value[condition] = token.toCSS(mode);
  }

  set(semanticTokens[category], name, value);
}

function processHierarchicalToken(
  token: ProcessedToken,
  tokenEntries: Array<[string, { value: string }]>,
  semanticEntries: Array<[string, Record<string, unknown>]>,
  category: TokenCategory,
  defaultMode: string,
  stripPrefixArray: string[],
  groupingStrategy: string,
  useSemanticTokens: boolean,
) {
  const hierarchicalPath = getHierarchicalTokenPath(
    token.path,
    category,
    stripPrefixArray,
    groupingStrategy,
  );

  if (useSemanticTokens && token.isMultiMode) {
    const modeValues = token.modeValues;
    const value: Record<string, unknown> = {
      value: formatTokenValue(token, defaultMode),
    };

    for (const [mode, _modeValue] of Object.entries(modeValues)) {
      if (mode === defaultMode) continue;
      const condition = mapModeToCondition(mode);
      value[condition] = token.toCSS(mode);
    }

    semanticEntries.push([hierarchicalPath, value]);
  } else {
    tokenEntries.push([hierarchicalPath, { value: formatTokenValue(token, defaultMode) }]);
  }
}

function buildNestedTokens(
  entries: Array<[string, { value: string }]>,
): Record<string, Record<string, unknown>> {
  const result: Record<string, Record<string, unknown>> = {};

  for (const [path, value] of entries) {
    const parts = path.split(".");
    const category = parts[0];
    const restPath = parts.slice(1).join(".");

    if (!result[category]) {
      result[category] = {};
    }

    if (restPath) {
      set(result[category], restPath, value);
    } else {
      // Handle case where path is just the category
      Object.assign(result[category], value);
    }
  }

  return result;
}

function buildNestedSemanticTokens(
  entries: Array<[string, Record<string, unknown>]>,
): Record<string, Record<string, unknown>> {
  const result: Record<string, Record<string, unknown>> = {};

  for (const [path, value] of entries) {
    const parts = path.split(".");
    const category = parts[0];
    const restPath = parts.slice(1).join(".");

    if (!result[category]) {
      result[category] = {};
    }

    if (restPath) {
      set(result[category], restPath, value);
    } else {
      Object.assign(result[category], value);
    }
  }

  return result;
}

function formatTokenValue(token: ProcessedToken, mode: string): string {
  const value = token.getValue(mode);

  if (isTokenAlias(value)) {
    // Convert alias to Panda token reference
    const path = String(value).replace(/^\{|\}$/g, "");
    return `{${path.replace(/\./g, ".")}}`;
  }

  return token.toCSS(mode);
}

/**
 * Map mode names to Panda condition keys.
 * IMPORTANT: Panda semantic tokens use condition keys WITHOUT underscore prefix.
 * The underscore prefix (_dark, _hover) is for CSS conditions in style props.
 */
function mapModeToCondition(mode: string): string {
  const modeLower = mode.toLowerCase();

  // For semantic tokens, use plain condition names (not _prefixed)
  // These match the conditions defined in the preset
  const modeMap: Record<string, string> = {
    dark: "dark",
    light: "light",
    // State-based conditions (these would need _prefix in style props, but not in token definitions)
  };

  return modeMap[modeLower] || mode;
}

// ============================================================================
// File Generation
// ============================================================================

function generatePresetFile(
  tokens: Record<string, Record<string, unknown>>,
  semanticTokens: Record<string, Record<string, unknown>>,
  conditions?: PandaPluginConfig["conditions"],
  useSemanticTokens?: boolean,
): string {
  const parts: string[] = [
    "// Auto-generated Panda CSS preset",
    "// Do not edit manually\n",
    'import { definePreset } from "@pandacss/dev";\n',
  ];

  const presetParts: string[] = [
    "export const designTokensPreset = definePreset({",
    '  name: "design-tokens",',
  ];

  // Add conditions if specified
  if (conditions) {
    presetParts.push("  conditions: {");
    if (conditions.colorMode) {
      if (conditions.colorMode.dark) {
        const escaped = conditions.colorMode.dark.replace(/"/g, '\\"');
        presetParts.push(`    dark: "${escaped}",`);
      }
      if (conditions.colorMode.light) {
        const escaped = conditions.colorMode.light.replace(/"/g, '\\"');
        presetParts.push(`    light: "${escaped}",`);
      }
    }
    if (conditions.breakpoints) {
      for (const [name, value] of Object.entries(conditions.breakpoints)) {
        const escaped = value.replace(/"/g, '\\"');
        presetParts.push(`    ${name}: "${escaped}",`);
      }
    }
    presetParts.push("  },");
  }

  // Add theme tokens
  presetParts.push("  theme: {");
  presetParts.push("    tokens: " + serializeTokens(tokens) + ",");

  if (useSemanticTokens && Object.keys(semanticTokens).length > 0) {
    presetParts.push("    semanticTokens: " + serializeTokens(semanticTokens) + ",");
  }

  presetParts.push("  },");
  presetParts.push("});");

  parts.push(presetParts.join("\n"));
  parts.push("\nexport default designTokensPreset;");

  return parts.join("\n");
}

function generateTokensFile(
  tokens: Record<string, Record<string, unknown>>,
  semanticTokens: Record<string, Record<string, unknown>>,
  useSemanticTokens?: boolean,
): string {
  const parts: string[] = [
    "// Auto-generated Panda CSS tokens",
    "// Do not edit manually\n",
    `export const tokens = ${serializeTokens(tokens)} as const;\n`,
  ];

  if (useSemanticTokens && Object.keys(semanticTokens).length > 0) {
    parts.push(`export const semanticTokens = ${serializeTokens(semanticTokens)} as const;\n`);
  }

  return parts.join("\n");
}

function generateTypesFile(
  tokens: Record<string, Record<string, unknown>>,
  semanticTokens: Record<string, Record<string, unknown>>,
  useSemanticTokens?: boolean,
): string {
  const parts: string[] = [
    "// Auto-generated Panda CSS types",
    "// Do not edit manually\n",
    'import type { Tokens, SemanticTokens } from "@pandacss/dev";\n',
    "export interface DesignTokens extends Tokens {",
  ];

  for (const [category, categoryTokens] of Object.entries(tokens)) {
    parts.push(`  ${category}: {`);
    generateTokenTypeEntries(categoryTokens, parts, "    ");
    parts.push("  };");
  }

  parts.push("}\n");

  if (useSemanticTokens && Object.keys(semanticTokens).length > 0) {
    parts.push("export interface DesignSemanticTokens extends SemanticTokens {");
    for (const [category, categoryTokens] of Object.entries(semanticTokens)) {
      parts.push(`  ${category}: {`);
      generateSemanticTokenTypeEntries(categoryTokens, parts, "    ");
      parts.push("  };");
    }
    parts.push("}");
  }

  return parts.join("\n");
}

function generateTokenTypeEntries(
  tokens: Record<string, unknown>,
  parts: string[],
  indent: string,
): void {
  for (const [name, value] of Object.entries(tokens)) {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name) ? name : `"${name}"`;

    if (typeof value === "object" && value !== null && "value" in value) {
      parts.push(`${indent}${safeKey}: { value: string };`);
    } else if (typeof value === "object" && value !== null) {
      parts.push(`${indent}${safeKey}: {`);
      generateTokenTypeEntries(value as Record<string, unknown>, parts, indent + "  ");
      parts.push(`${indent}};`);
    }
  }
}

function generateSemanticTokenTypeEntries(
  tokens: Record<string, unknown>,
  parts: string[],
  indent: string,
): void {
  for (const [name, value] of Object.entries(tokens)) {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name) ? name : `"${name}"`;

    if (typeof value === "object" && value !== null && "value" in value) {
      parts.push(`${indent}${safeKey}: { value: string; dark?: string; light?: string };`);
    } else if (typeof value === "object" && value !== null) {
      parts.push(`${indent}${safeKey}: {`);
      generateSemanticTokenTypeEntries(value as Record<string, unknown>, parts, indent + "  ");
      parts.push(`${indent}};`);
    }
  }
}

function serializeTokens(obj: unknown, indent = 0): string {
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
    const items = obj.map((item) => serializeTokens(item, indent + 1)).join(", ");
    return `[${items}]`;
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "{}";

    const props = entries
      .map(([key, value]) => {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        return `${spaces}  ${safeKey}: ${serializeTokens(value, indent + 1)}`;
      })
      .join(",\n");

    return `{\n${props}\n${spaces}}`;
  }

  return String(obj);
}

// ============================================================================
// Recipe Generation
// ============================================================================

interface RecipeVariant {
  [key: string]: Record<string, string>;
}

interface Recipe {
  className: string;
  description?: string;
  base?: Record<string, string>;
  variants?: Record<string, RecipeVariant>;
  defaultVariants?: Record<string, string>;
}

/**
 * Detect token patterns and build recipes from them.
 * Looks for common component patterns like:
 * - button.sm, button.md, button.lg → button recipe with size variants
 * - text.heading, text.body → text recipe with variant types
 */
function detectAndBuildRecipes(
  tokens: ProcessedToken[],
  stripPrefixArray: string[],
): Record<string, Recipe> {
  const recipes: Record<string, Recipe> = {};
  const componentPatterns = new Map<string, Map<string, ProcessedToken[]>>();

  // Group tokens by component pattern
  for (const token of tokens) {
    let path = token.path;
    if (stripPrefixArray.length > 0) {
      path = stripTokenPrefix(path, { prefixes: stripPrefixArray, separator: "." });
    }

    const parts = path.split(".");

    // Look for component-like patterns (e.g., button.primary, text.heading.lg)
    // Common patterns: component.variant, component.size, component.state
    if (parts.length >= 2) {
      const componentName = parts[0].toLowerCase();
      const variantPath = parts.slice(1).join(".");

      // Check if this looks like a component token
      if (isComponentPattern(componentName)) {
        if (!componentPatterns.has(componentName)) {
          componentPatterns.set(componentName, new Map());
        }
        const variants = componentPatterns.get(componentName)!;
        if (!variants.has(variantPath)) {
          variants.set(variantPath, []);
        }
        variants.get(variantPath)!.push(token);
      }
    }
  }

  // Build recipes from detected patterns
  for (const [componentName, variants] of componentPatterns) {
    if (variants.size < 2) continue; // Need at least 2 variants for a recipe

    const recipe = buildRecipeFromPatterns(componentName, variants);
    if (recipe) {
      recipes[componentName] = recipe;
    }
  }

  return recipes;
}

/**
 * Check if a name looks like a component pattern
 */
function isComponentPattern(name: string): boolean {
  const componentPatterns = [
    "button",
    "btn",
    "text",
    "typography",
    "heading",
    "input",
    "card",
    "badge",
    "alert",
    "avatar",
    "chip",
    "tag",
    "label",
    "link",
  ];
  return componentPatterns.includes(name.toLowerCase());
}

/**
 * Build a recipe from detected token patterns
 */
function buildRecipeFromPatterns(
  componentName: string,
  variants: Map<string, ProcessedToken[]>,
): Recipe | null {
  const recipe: Recipe = {
    className: componentName,
    variants: {},
  };

  // Categorize variants by type (size, visual, state)
  const sizeVariants: Record<string, Record<string, string>> = {};
  const visualVariants: Record<string, Record<string, string>> = {};

  for (const [variantPath, tokens] of variants) {
    const variantName = variantPath.split(".")[0];

    // Detect size variants
    if (isSizeVariant(variantName)) {
      sizeVariants[variantName] = buildVariantStyles(tokens);
    } else {
      // Visual/semantic variants (primary, secondary, etc.)
      visualVariants[variantName] = buildVariantStyles(tokens);
    }
  }

  // Add variants to recipe
  if (Object.keys(sizeVariants).length > 0) {
    recipe.variants!.size = sizeVariants;
    recipe.defaultVariants = { size: Object.keys(sizeVariants)[0] };
  }

  if (Object.keys(visualVariants).length > 0) {
    recipe.variants!.variant = visualVariants;
    if (!recipe.defaultVariants) {
      recipe.defaultVariants = {};
    }
    recipe.defaultVariants.variant = Object.keys(visualVariants)[0];
  }

  // Only return if we have meaningful variants
  if (Object.keys(recipe.variants!).length === 0) {
    return null;
  }

  return recipe;
}

function isSizeVariant(name: string): boolean {
  const sizePatterns = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "small", "medium", "large"];
  return sizePatterns.includes(name.toLowerCase());
}

function buildVariantStyles(tokens: ProcessedToken[]): Record<string, string> {
  const styles: Record<string, string> = {};

  for (const token of tokens) {
    const cssProperty = tokenTypeToCssProperty(token.type, token.path);
    if (cssProperty) {
      // Use token reference instead of raw value
      const tokenPath = token.path.replace(/\./g, ".");
      styles[cssProperty] = `{${tokenPath}}`;
    }
  }

  return styles;
}

function tokenTypeToCssProperty(type: string, path: string): string | null {
  const pathLower = path.toLowerCase();

  switch (type) {
    case "color":
      if (pathLower.includes("background") || pathLower.includes("bg")) return "backgroundColor";
      if (pathLower.includes("border")) return "borderColor";
      return "color";
    case "dimension":
      if (pathLower.includes("fontsize") || pathLower.includes("font-size")) return "fontSize";
      if (pathLower.includes("lineheight") || pathLower.includes("line-height"))
        return "lineHeight";
      if (pathLower.includes("padding")) return "padding";
      if (pathLower.includes("margin")) return "margin";
      if (pathLower.includes("radius")) return "borderRadius";
      if (pathLower.includes("gap")) return "gap";
      if (pathLower.includes("height")) return "height";
      if (pathLower.includes("width")) return "width";
      return null;
    case "fontFamily":
      return "fontFamily";
    case "fontWeight":
      return "fontWeight";
    case "shadow":
      return "boxShadow";
    default:
      return null;
  }
}

function generateRecipesFile(recipes: Record<string, Recipe>): string {
  const parts: string[] = [
    "// Auto-generated Panda CSS recipes",
    "// Do not edit manually\n",
    'import { defineRecipe } from "@pandacss/dev";\n',
  ];

  for (const [name, recipe] of Object.entries(recipes)) {
    const recipeName = `${name}Recipe`;
    parts.push(`export const ${recipeName} = defineRecipe({`);
    parts.push(`  className: "${recipe.className}",`);

    if (recipe.base && Object.keys(recipe.base).length > 0) {
      parts.push(`  base: ${serializeTokens(recipe.base, 1)},`);
    }

    if (recipe.variants && Object.keys(recipe.variants).length > 0) {
      parts.push("  variants: {");
      for (const [variantType, variants] of Object.entries(recipe.variants)) {
        parts.push(`    ${variantType}: {`);
        for (const [variantName, styles] of Object.entries(variants)) {
          parts.push(`      ${variantName}: ${serializeTokens(styles, 3)},`);
        }
        parts.push("    },");
      }
      parts.push("  },");
    }

    if (recipe.defaultVariants && Object.keys(recipe.defaultVariants).length > 0) {
      parts.push(`  defaultVariants: ${serializeTokens(recipe.defaultVariants, 1)},`);
    }

    parts.push("});\n");
  }

  // Export all recipes as a collection
  const recipeNames = Object.keys(recipes).map((name) => `${name}Recipe`);
  parts.push(`export const recipes = {`);
  for (const name of recipeNames) {
    parts.push(`  ${name},`);
  }
  parts.push(`};`);

  return parts.join("\n");
}
