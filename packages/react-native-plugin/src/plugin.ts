import {
  createFileBuilder,
  createModeRecord,
  definePlugin,
  getModesToIterate,
  stripTokenPrefix,
} from "@design-sync/manager";
import { camelCase, set } from "@design-sync/utils";
import {
  type ProcessedToken,
  isTokenAlias,
  typographyToCssStyle,
} from "@design-sync/w3c-dtfm";

/**
 * react-native-paper typography variant names
 * Maps to Paper's typography system
 */
export type PaperTypographyVariant =
  | "displayLarge"
  | "displayMedium"
  | "displaySmall"
  | "headlineLarge"
  | "headlineMedium"
  | "headlineSmall"
  | "titleLarge"
  | "titleMedium"
  | "titleSmall"
  | "bodyLarge"
  | "bodyMedium"
  | "bodySmall"
  | "labelLarge"
  | "labelMedium"
  | "labelSmall";

/**
 * react-native-paper color roles
 */
export type PaperColorRole =
  | "primary"
  | "onPrimary"
  | "primaryContainer"
  | "onPrimaryContainer"
  | "secondary"
  | "onSecondary"
  | "secondaryContainer"
  | "onSecondaryContainer"
  | "tertiary"
  | "onTertiary"
  | "tertiaryContainer"
  | "onTertiaryContainer"
  | "error"
  | "onError"
  | "errorContainer"
  | "onErrorContainer"
  | "background"
  | "onBackground"
  | "surface"
  | "onSurface"
  | "surfaceVariant"
  | "onSurfaceVariant"
  | "outline"
  | "outlineVariant"
  | "inverseSurface"
  | "inverseOnSurface"
  | "inversePrimary"
  | "elevation"
  | "shadow"
  | "scrim"
  | "surfaceDisabled"
  | "onSurfaceDisabled"
  | "backdrop";

export interface ReactNativePluginConfig {
  /** Output directory for generated files (relative to main out dir) */
  outDir?: string;
  /** Generate TypeScript files */
  useTs?: boolean;
  /**
   * Generate StyleSheet.create() for typography
   * @default true
   */
  useStyleSheet?: boolean;
  /**
   * Convert rem values to pixels
   * Set to number for custom base size, false to disable
   * @default 16
   */
  remToPixels?: number | false;
  /**
   * Generate ThemeProvider component
   * @default false
   */
  generateProvider?: boolean;
  /**
   * Target platforms
   * @default ['ios', 'android']
   */
  platforms?: ("ios" | "android" | "web")[];
  /**
   * Strip design system prefix from token names
   * @example ['kda', 'foundation'] removes these from all token names
   */
  stripPrefix?: string | string[];
  /**
   * Enable responsive scaling for typography and spacing
   * Generates scaling utilities based on PixelRatio
   * @default false
   */
  responsiveScaling?: boolean;
  /**
   * Base screen width for responsive scaling calculations
   * @default 375 (iPhone standard width)
   */
  baseScreenWidth?: number;
  /**
   * Generate react-native-paper compatible theme
   * @default false
   */
  generatePaperTheme?: boolean;
  /**
   * Map token names to react-native-paper color roles
   * Keys are Paper color role names, values are token path patterns
   *
   * @example
   * ```typescript
   * paperColorMapping: {
   *   primary: 'brand.primary',
   *   secondary: 'brand.secondary',
   *   background: 'background.primary',
   *   surface: 'surface.primary',
   * }
   * ```
   */
  paperColorMapping?: Partial<Record<PaperColorRole, string>>;
  /**
   * Map token names to react-native-paper typography variants
   * Keys are Paper variant names, values are token path patterns
   *
   * @example
   * ```typescript
   * paperTypographyMapping: {
   *   displayLarge: 'heading.xl',
   *   headlineMedium: 'heading.md',
   *   bodyMedium: 'body.md',
   *   labelSmall: 'label.sm',
   * }
   * ```
   */
  paperTypographyMapping?: Partial<Record<PaperTypographyVariant, string>>;
}

type RNTokenCategory =
  | "colors"
  | "spacing"
  | "sizing"
  | "typography"
  | "shadows"
  | "radii"
  | "borders"
  | "zIndex"
  | "opacity";

// ============================================================================
// Paper Theme Pattern Detection
// ============================================================================

/**
 * Patterns to auto-detect react-native-paper color roles from token paths
 */
const PAPER_COLOR_PATTERNS: Record<PaperColorRole, RegExp[]> = {
  primary: [/primary$/i, /brand\.primary/i, /color\.primary/i],
  onPrimary: [/onprimary$/i, /on-primary$/i, /primary\.on/i],
  primaryContainer: [/primarycontainer$/i, /primary-container$/i, /primary\.container/i],
  onPrimaryContainer: [/onprimarycontainer$/i, /on-primary-container$/i],
  secondary: [/secondary$/i, /brand\.secondary/i, /accent$/i],
  onSecondary: [/onsecondary$/i, /on-secondary$/i],
  secondaryContainer: [/secondarycontainer$/i, /secondary-container$/i],
  onSecondaryContainer: [/onsecondarycontainer$/i, /on-secondary-container$/i],
  tertiary: [/tertiary$/i, /brand\.tertiary/i],
  onTertiary: [/ontertiary$/i, /on-tertiary$/i],
  tertiaryContainer: [/tertiarycontainer$/i, /tertiary-container$/i],
  onTertiaryContainer: [/ontertiarycontainer$/i, /on-tertiary-container$/i],
  error: [/error$/i, /semantic\.error/i, /danger$/i],
  onError: [/onerror$/i, /on-error$/i],
  errorContainer: [/errorcontainer$/i, /error-container$/i],
  onErrorContainer: [/onerrorcontainer$/i, /on-error-container$/i],
  background: [/background$/i, /background\.primary$/i],
  onBackground: [/onbackground$/i, /on-background$/i],
  surface: [/surface$/i, /surface\.primary$/i],
  onSurface: [/onsurface$/i, /on-surface$/i],
  surfaceVariant: [/surfacevariant$/i, /surface-variant$/i, /surface\.variant/i],
  onSurfaceVariant: [/onsurfacevariant$/i, /on-surface-variant$/i],
  outline: [/outline$/i, /border$/i],
  outlineVariant: [/outlinevariant$/i, /outline-variant$/i],
  inverseSurface: [/inversesurface$/i, /inverse-surface$/i],
  inverseOnSurface: [/inverseonsurface$/i, /inverse-on-surface$/i],
  inversePrimary: [/inverseprimary$/i, /inverse-primary$/i],
  elevation: [/elevation$/i, /shadow\.elevation/i],
  shadow: [/shadow$/i, /shadow\.color/i],
  scrim: [/scrim$/i, /overlay$/i, /backdrop$/i],
  surfaceDisabled: [/surfacedisabled$/i, /surface-disabled$/i, /surface\.disabled/i],
  onSurfaceDisabled: [/onsurfacedisabled$/i, /on-surface-disabled$/i],
  backdrop: [/backdrop$/i, /modal\.backdrop/i],
};

/**
 * Patterns to auto-detect react-native-paper typography variants from token paths
 */
const PAPER_TYPOGRAPHY_PATTERNS: Record<PaperTypographyVariant, RegExp[]> = {
  displayLarge: [/displaylarge$/i, /display-large$/i, /display\.lg$/i, /heading\.xxxl$/i],
  displayMedium: [/displaymedium$/i, /display-medium$/i, /display\.md$/i, /heading\.xxl$/i],
  displaySmall: [/displaysmall$/i, /display-small$/i, /display\.sm$/i],
  headlineLarge: [/headlinelarge$/i, /headline-large$/i, /headline\.lg$/i, /heading\.xl$/i],
  headlineMedium: [/headlinemedium$/i, /headline-medium$/i, /headline\.md$/i, /heading\.lg$/i],
  headlineSmall: [/headlinesmall$/i, /headline-small$/i, /headline\.sm$/i, /heading\.md$/i],
  titleLarge: [/titlelarge$/i, /title-large$/i, /title\.lg$/i],
  titleMedium: [/titlemedium$/i, /title-medium$/i, /title\.md$/i, /subtitle$/i],
  titleSmall: [/titlesmall$/i, /title-small$/i, /title\.sm$/i],
  bodyLarge: [/bodylarge$/i, /body-large$/i, /body\.lg$/i, /paragraph\.lg$/i],
  bodyMedium: [/bodymedium$/i, /body-medium$/i, /body\.md$/i, /body$/i, /paragraph$/i],
  bodySmall: [/bodysmall$/i, /body-small$/i, /body\.sm$/i, /paragraph\.sm$/i],
  labelLarge: [/labellarge$/i, /label-large$/i, /label\.lg$/i, /button$/i],
  labelMedium: [/labelmedium$/i, /label-medium$/i, /label\.md$/i, /label$/i],
  labelSmall: [/labelsmall$/i, /label-small$/i, /label\.sm$/i, /caption$/i],
};

/**
 * Find Paper color role using explicit mapping or auto-detection
 */
function findPaperColorRole(
  path: string,
  tokenName: string,
  explicitMapping?: Partial<Record<PaperColorRole, string>>,
): PaperColorRole | null {
  // Check explicit mappings first
  if (explicitMapping) {
    for (const [role, pattern] of Object.entries(explicitMapping) as [PaperColorRole, string][]) {
      if (path.includes(pattern) || tokenName === camelCase(pattern.split(".").join("-"))) {
        return role;
      }
    }
  }
  // Fall back to auto-detection
  for (const [role, patterns] of Object.entries(PAPER_COLOR_PATTERNS) as [PaperColorRole, RegExp[]][]) {
    if (patterns.some((p) => p.test(path))) {
      return role;
    }
  }
  return null;
}

/**
 * Find Paper typography variant using explicit mapping or auto-detection
 */
function findPaperTypographyVariant(
  path: string,
  tokenName: string,
  explicitMapping?: Partial<Record<PaperTypographyVariant, string>>,
): PaperTypographyVariant | null {
  // Check explicit mappings first
  if (explicitMapping) {
    for (const [variant, pattern] of Object.entries(explicitMapping) as [PaperTypographyVariant, string][]) {
      if (path.includes(pattern) || tokenName === camelCase(pattern.split(".").join("-"))) {
        return variant;
      }
    }
  }
  // Fall back to auto-detection
  for (const [variant, patterns] of Object.entries(PAPER_TYPOGRAPHY_PATTERNS) as [PaperTypographyVariant, RegExp[]][]) {
    if (patterns.some((p) => p.test(path))) {
      return variant;
    }
  }
  return null;
}

/**
 * React Native Plugin - Exports design tokens for React Native
 *
 * Creates theme objects and StyleSheet definitions for React Native apps.
 * Handles platform-specific differences (iOS shadows vs Android elevation).
 *
 * @example
 * ```typescript
 * // design-sync.config.ts
 * import { reactNativePlugin } from '@design-sync/react-native-plugin';
 *
 * export default {
 *   plugins: [reactNativePlugin({
 *     useTs: true,
 *     useStyleSheet: true,
 *     remToPixels: 16,
 *     generateProvider: true
 *   })],
 * };
 * ```
 *
 * Usage:
 * ```tsx
 * import { colors, spacing, typography } from './tokens/theme';
 * import { StyleSheet } from 'react-native';
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: colors.background,
 *     padding: spacing.md,
 *   },
 *   title: typography.heading,
 * });
 * ```
 */
export function reactNativePlugin(
  config: ReactNativePluginConfig = {},
): ReturnType<typeof definePlugin> {
  const {
    outDir = "",
    useTs = true,
    useStyleSheet = true,
    remToPixels = 16,
    generateProvider = false,
    platforms = ["ios", "android"],
    stripPrefix,
    responsiveScaling = false,
    baseScreenWidth = 375,
    generatePaperTheme = false,
    paperColorMapping,
    paperTypographyMapping,
  } = config;

  const stripPrefixArray = stripPrefix
    ? Array.isArray(stripPrefix)
      ? stripPrefix
      : stripPrefix.split(".")
    : [];

  return definePlugin("react-native-plugin", (context) => {
    const { modes } = context;
    const builder = createFileBuilder(outDir);
    const ext = useTs ? "ts" : "js";

    // Collect tokens by category for each mode
    const colors = createModeRecord<Record<string, string>>(modes, () => ({}));
    const spacing = createModeRecord<Record<string, number>>(modes, () => ({}));
    const sizing = createModeRecord<Record<string, number>>(modes, () => ({}));
    const typography = createModeRecord<Record<string, Record<string, unknown>>>(modes, () => ({}));
    const shadows = createModeRecord<Record<string, ShadowValue>>(modes, () => ({}));
    const radii = createModeRecord<Record<string, number>>(modes, () => ({}));
    const borders = createModeRecord<Record<string, unknown>>(modes, () => ({}));

    // Paper theme mappings (per mode for colors)
    const paperColorMappings = createModeRecord<Record<PaperColorRole, string>>(modes, () => ({} as Record<PaperColorRole, string>));
    const paperTypographyMappings: Record<PaperTypographyVariant, string> = {} as Record<PaperTypographyVariant, string>;

    // Process all tokens
    context.query().forEach((token) => {
      const category = getTokenCategory(token);
      if (!category) return;
      const tokenName = getTokenName(token.path, stripPrefixArray);

      switch (category) {
        case "colors":
          processColorToken(token, colors, modes.defaultMode, stripPrefixArray);
          // Detect Paper color role
          if (generatePaperTheme) {
            const paperColorRole = findPaperColorRole(token.path, tokenName, paperColorMapping);
            if (paperColorRole) {
              for (const mode of Object.keys(paperColorMappings)) {
                paperColorMappings[mode][paperColorRole] = tokenName;
              }
            }
          }
          break;
        case "spacing":
          processSpacingToken(token, spacing, modes.defaultMode, remToPixels, stripPrefixArray);
          break;
        case "sizing":
          processSizingToken(token, sizing, modes.defaultMode, remToPixels, stripPrefixArray);
          break;
        case "typography":
          processTypographyToken(token, typography, modes.defaultMode, remToPixels, stripPrefixArray);
          // Detect Paper typography variant
          if (generatePaperTheme) {
            const paperTypoVariant = findPaperTypographyVariant(token.path, tokenName, paperTypographyMapping);
            if (paperTypoVariant) {
              paperTypographyMappings[paperTypoVariant] = tokenName;
            }
          }
          break;
        case "shadows":
          processShadowToken(token, shadows, modes.defaultMode, platforms, stripPrefixArray);
          break;
        case "radii":
          processRadiusToken(token, radii, modes.defaultMode, remToPixels, stripPrefixArray);
          break;
        case "borders":
          processBorderToken(token, borders, modes.defaultMode, remToPixels, stripPrefixArray);
          break;
      }
    });

    // Generate files for each mode
    for (const mode of getModesToIterate(modes)) {
      const isDefault = mode === modes.defaultMode;
      const suffix = isDefault ? "" : `.${mode}`;

      builder.add(
        `colors${suffix}.${ext}`,
        generateColorsFile(colors[mode], useTs),
        ext as "ts" | "js",
      );
      builder.add(
        `spacing${suffix}.${ext}`,
        generateSpacingFile(spacing[mode], useTs),
        ext as "ts" | "js",
      );
      builder.add(
        `sizing${suffix}.${ext}`,
        generateSizingFile(sizing[mode], useTs),
        ext as "ts" | "js",
      );
      builder.add(
        `typography${suffix}.${ext}`,
        generateTypographyFile(typography[mode], useStyleSheet, useTs),
        ext as "ts" | "js",
      );
      builder.add(
        `shadows${suffix}.${ext}`,
        generateShadowsFile(shadows[mode], platforms, useTs),
        ext as "ts" | "js",
      );
    }

    // Generate combined theme file
    builder.add(
      `theme.${ext}`,
      generateThemeFile(modes, useTs),
      ext as "ts" | "js",
    );

    // Generate provider if requested
    if (generateProvider) {
      const providerExt = useTs ? "tsx" : "jsx";
      builder.add(`ThemeProvider.${providerExt}`, generateProviderFile(modes, useTs), "ts");
    }

    // Generate TypeScript types
    if (useTs) {
      builder.addTs("types.ts", generateTypesFile(platforms));
    }

    // Generate responsive scaling utilities
    if (responsiveScaling) {
      builder.add(
        `scaling.${ext}`,
        generateScalingFile(baseScreenWidth, useTs),
        ext as "ts" | "js",
      );
    }

    // Generate react-native-paper theme
    if (generatePaperTheme) {
      builder.add(
        `paper-theme.${ext}`,
        generatePaperThemeFile(
          colors,
          typography,
          paperColorMappings,
          paperTypographyMappings,
          modes,
          useTs,
        ),
        ext as "ts" | "js",
      );
    }

    return builder.build();
  });
}

// ============================================================================
// Types
// ============================================================================

interface ShadowValue {
  ios: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
  };
  android: {
    elevation: number;
    shadowColor: string;
  };
}

// ============================================================================
// Token Category Mapping
// ============================================================================

function getTokenCategory(token: ProcessedToken): RNTokenCategory | null {
  const { type, path } = token;
  const pathLower = path.toLowerCase();

  switch (type) {
    case "color":
      return "colors";
    case "dimension": {
      if (pathLower.includes("spacing") || pathLower.includes("space") || pathLower.includes("gap"))
        return "spacing";
      if (
        pathLower.includes("width") ||
        pathLower.includes("height") ||
        pathLower.includes("size")
      )
        return "sizing";
      if (pathLower.includes("radius") || pathLower.includes("radii")) return "radii";
      if (pathLower.includes("fontsize") || pathLower.includes("font")) return null; // handled by typography
      return "spacing";
    }
    case "shadow":
      return "shadows";
    case "typography":
      return "typography";
    case "border":
      return "borders";
    case "number": {
      if (pathLower.includes("zindex") || pathLower.includes("z-index")) return "zIndex";
      if (pathLower.includes("opacity")) return "opacity";
      return null;
    }
    default:
      return null;
  }
}

function getTokenName(path: string, stripPrefixArray: string[] = []): string {
  // Apply prefix stripping first
  let simplifiedPath = path;
  if (stripPrefixArray.length > 0) {
    simplifiedPath = stripTokenPrefix(path, { prefixes: stripPrefixArray, separator: "." });
  }

  const parts = simplifiedPath.split(".");
  const filtered = parts.filter(
    (p) =>
      ![
        "colors",
        "color",
        "spacing",
        "space",
        "typography",
        "shadows",
        "shadow",
        "sizes",
        "size",
        "radii",
        "radius",
      ].includes(p.toLowerCase()),
  );
  return camelCase(filtered.join("-"));
}

// ============================================================================
// Unit Conversion
// ============================================================================

function convertToPixels(value: string, remBase: number | false): number {
  if (remBase === false) {
    // Try to extract number
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }

  // Handle rem
  const remMatch = value.match(/^(-?\d+(?:\.\d+)?)rem$/);
  if (remMatch) {
    return parseFloat(remMatch[1]) * remBase;
  }

  // Handle em (treat as rem for simplicity)
  const emMatch = value.match(/^(-?\d+(?:\.\d+)?)em$/);
  if (emMatch) {
    return parseFloat(emMatch[1]) * remBase;
  }

  // Handle px
  const pxMatch = value.match(/^(-?\d+(?:\.\d+)?)px$/);
  if (pxMatch) {
    return parseFloat(pxMatch[1]);
  }

  // Try to extract number directly
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

// ============================================================================
// Token Processing
// ============================================================================

function processColorToken(
  token: ProcessedToken,
  colors: Record<string, Record<string, string>>,
  defaultMode: string,
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);
  for (const mode of Object.keys(colors)) {
    colors[mode][name] = token.toCSS(mode);
  }
}

function processSpacingToken(
  token: ProcessedToken,
  spacing: Record<string, Record<string, number>>,
  defaultMode: string,
  remBase: number | false,
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);
  for (const mode of Object.keys(spacing)) {
    spacing[mode][name] = convertToPixels(token.toCSS(mode), remBase);
  }
}

function processSizingToken(
  token: ProcessedToken,
  sizing: Record<string, Record<string, number>>,
  defaultMode: string,
  remBase: number | false,
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);
  for (const mode of Object.keys(sizing)) {
    sizing[mode][name] = convertToPixels(token.toCSS(mode), remBase);
  }
}

function processTypographyToken(
  token: ProcessedToken,
  typography: Record<string, Record<string, Record<string, unknown>>>,
  defaultMode: string,
  remBase: number | false,
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);

  for (const mode of Object.keys(typography)) {
    const value = token.getValue(mode);
    const style = typographyToCssStyle(value);

    if (isTokenAlias(style) || typeof style !== "object") continue;

    const rnStyle: Record<string, unknown> = {};
    const cssStyle = style as Record<string, unknown>;

    if (cssStyle.fontFamily) {
      rnStyle.fontFamily = String(cssStyle.fontFamily).split(",")[0].trim().replace(/['"]/g, "");
    }
    if (cssStyle.fontSize) {
      rnStyle.fontSize = convertToPixels(String(cssStyle.fontSize), remBase);
    }
    if (cssStyle.fontWeight) {
      rnStyle.fontWeight = String(cssStyle.fontWeight);
    }
    if (cssStyle.lineHeight) {
      rnStyle.lineHeight = convertToPixels(String(cssStyle.lineHeight), remBase);
    }
    if (cssStyle.letterSpacing) {
      rnStyle.letterSpacing = convertToPixels(String(cssStyle.letterSpacing), remBase);
    }

    typography[mode][name] = rnStyle;
  }
}

function processShadowToken(
  token: ProcessedToken,
  shadows: Record<string, Record<string, ShadowValue>>,
  defaultMode: string,
  platforms: ("ios" | "android" | "web")[],
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);

  for (const mode of Object.keys(shadows)) {
    const cssValue = token.toCSS(mode);

    // Parse CSS shadow: offsetX offsetY blurRadius spreadRadius color
    const shadowMatch = cssValue.match(
      /(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s*(?:(-?\d+(?:\.\d+)?(?:px)?)\s+)?(.+)/,
    );

    let offsetX = 0;
    let offsetY = 2;
    let blur = 4;
    let color = "rgba(0, 0, 0, 0.25)";

    if (shadowMatch) {
      offsetX = parseFloat(shadowMatch[1]);
      offsetY = parseFloat(shadowMatch[2]);
      blur = parseFloat(shadowMatch[3]);
      color = shadowMatch[5] || color;
    }

    // Estimate Android elevation from shadow blur
    const elevation = Math.round(blur / 2);

    shadows[mode][name] = {
      ios: {
        shadowColor: color,
        shadowOffset: { width: offsetX, height: offsetY },
        shadowOpacity: 1,
        shadowRadius: blur,
      },
      android: {
        elevation,
        shadowColor: color,
      },
    };
  }
}

function processRadiusToken(
  token: ProcessedToken,
  radii: Record<string, Record<string, number>>,
  defaultMode: string,
  remBase: number | false,
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);
  for (const mode of Object.keys(radii)) {
    radii[mode][name] = convertToPixels(token.toCSS(mode), remBase);
  }
}

function processBorderToken(
  token: ProcessedToken,
  borders: Record<string, Record<string, unknown>>,
  defaultMode: string,
  remBase: number | false,
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);

  for (const mode of Object.keys(borders)) {
    const value = token.getValue(mode);

    if (typeof value === "object" && value !== null) {
      const borderValue = value as { width?: unknown; color?: unknown; style?: string };
      borders[mode][name] = {
        borderWidth: borderValue.width ? convertToPixels(String(borderValue.width), remBase) : 1,
        borderColor: borderValue.color ? String(borderValue.color) : "#000000",
        borderStyle: borderValue.style || "solid",
      };
    }
  }
}

// ============================================================================
// File Generation
// ============================================================================

function generateColorsFile(colors: Record<string, string>, useTs: boolean): string {
  const parts: string[] = [
    "// Auto-generated React Native colors",
    "// Do not edit manually\n",
    `export const colors = ${serializeObject(colors)} as const;\n`,
  ];

  if (useTs) {
    parts.push("export type Colors = typeof colors;");
    parts.push("export type ColorName = keyof Colors;");
  }

  return parts.join("\n");
}

function generateSpacingFile(spacing: Record<string, number>, useTs: boolean): string {
  const parts: string[] = [
    "// Auto-generated React Native spacing",
    "// Do not edit manually\n",
    `export const spacing = ${serializeObject(spacing)} as const;\n`,
  ];

  if (useTs) {
    parts.push("export type Spacing = typeof spacing;");
    parts.push("export type SpacingName = keyof Spacing;");
  }

  return parts.join("\n");
}

function generateSizingFile(sizing: Record<string, number>, useTs: boolean): string {
  const parts: string[] = [
    "// Auto-generated React Native sizing",
    "// Do not edit manually\n",
    `export const sizing = ${serializeObject(sizing)} as const;\n`,
  ];

  if (useTs) {
    parts.push("export type Sizing = typeof sizing;");
    parts.push("export type SizingName = keyof Sizing;");
  }

  return parts.join("\n");
}

function generateTypographyFile(
  typography: Record<string, Record<string, unknown>>,
  useStyleSheet: boolean,
  useTs: boolean,
): string {
  const parts: string[] = [
    "// Auto-generated React Native typography",
    "// Do not edit manually\n",
  ];

  if (useStyleSheet) {
    parts.push('import { StyleSheet } from "react-native";\n');
    parts.push(`export const typography = StyleSheet.create(${serializeObject(typography)});\n`);
  } else {
    parts.push(`export const typography = ${serializeObject(typography)} as const;\n`);
  }

  if (useTs) {
    parts.push("export type Typography = typeof typography;");
    parts.push("export type TypographyName = keyof Typography;");
  }

  return parts.join("\n");
}

function generateShadowsFile(
  shadows: Record<string, ShadowValue>,
  platforms: ("ios" | "android" | "web")[],
  useTs: boolean,
): string {
  const parts: string[] = [
    "// Auto-generated React Native shadows",
    "// Do not edit manually\n",
    'import { Platform } from "react-native";\n',
  ];

  // Generate shadow helpers
  parts.push("const createShadow = (ios: IOSShadow, android: AndroidShadow) =>");
  parts.push('  Platform.select({ ios, android, default: ios });\n');

  if (useTs) {
    parts.push("interface IOSShadow {");
    parts.push("  shadowColor: string;");
    parts.push("  shadowOffset: { width: number; height: number };");
    parts.push("  shadowOpacity: number;");
    parts.push("  shadowRadius: number;");
    parts.push("}\n");
    parts.push("interface AndroidShadow {");
    parts.push("  elevation: number;");
    parts.push("  shadowColor: string;");
    parts.push("}\n");
  }

  parts.push("export const shadows = {");
  for (const [name, value] of Object.entries(shadows)) {
    parts.push(`  ${name}: createShadow(`);
    parts.push(`    ${serializeObject(value.ios)},`);
    parts.push(`    ${serializeObject(value.android)}`);
    parts.push(`  ),`);
  }
  parts.push("} as const;\n");

  if (useTs) {
    parts.push("export type Shadows = typeof shadows;");
    parts.push("export type ShadowName = keyof Shadows;");
  }

  return parts.join("\n");
}

function generateThemeFile(
  modes: { defaultMode: string; requiredModes: readonly string[] },
  useTs: boolean,
): string {
  const parts: string[] = [
    "// Auto-generated React Native theme",
    "// Do not edit manually\n",
    'export { colors } from "./colors";',
    'export { spacing } from "./spacing";',
    'export { sizing } from "./sizing";',
    'export { typography } from "./typography";',
    'export { shadows } from "./shadows";\n',
    'import { colors } from "./colors";',
    'import { spacing } from "./spacing";',
    'import { sizing } from "./sizing";',
    'import { typography } from "./typography";',
    'import { shadows } from "./shadows";\n',
    "export const theme = {",
    "  colors,",
    "  spacing,",
    "  sizing,",
    "  typography,",
    "  shadows,",
    "} as const;\n",
    "export default theme;",
  ];

  if (useTs) {
    parts.push("\nexport type Theme = typeof theme;");
  }

  return parts.join("\n");
}

function generateProviderFile(
  modes: { defaultMode: string; requiredModes: readonly string[] },
  useTs: boolean,
): string {
  const parts: string[] = [
    "// Auto-generated React Native ThemeProvider",
    "// Do not edit manually\n",
    'import React, { createContext, useContext, useState, useMemo } from "react";',
  ];

  if (useTs) {
    parts.push('import type { ReactNode } from "react";');
  }

  parts.push('import { theme } from "./theme";\n');

  // Import mode-specific themes
  for (const mode of getModesToIterate(modes as any)) {
    if (mode === modes.defaultMode) continue;
    parts.push(`import { colors as ${mode}Colors } from "./colors.${mode}";`);
  }

  parts.push("");

  const themeType = useTs ? ": typeof theme" : "";
  const modeType = useTs
    ? `: ${getModesToIterate(modes as any)
        .map((m) => `"${m}"`)
        .join(" | ")}`
    : "";

  parts.push(`const themes${useTs ? ": Record<string, typeof theme>" : ""} = {`);
  parts.push(`  ${modes.defaultMode}: theme,`);
  for (const mode of getModesToIterate(modes as any)) {
    if (mode === modes.defaultMode) continue;
    parts.push(`  ${mode}: { ...theme, colors: ${mode}Colors },`);
  }
  parts.push("};\n");

  if (useTs) {
    parts.push("interface ThemeContextValue {");
    parts.push("  theme: typeof theme;");
    parts.push(`  mode${modeType};`);
    parts.push(`  setMode: (mode${modeType}) => void;`);
    parts.push("}\n");
  }

  parts.push(`const ThemeContext = createContext${useTs ? "<ThemeContextValue | undefined>" : ""}(undefined);\n`);

  parts.push("export function useTheme() {");
  parts.push("  const context = useContext(ThemeContext);");
  parts.push('  if (!context) throw new Error("useTheme must be used within ThemeProvider");');
  parts.push("  return context;");
  parts.push("}\n");

  if (useTs) {
    parts.push("interface ThemeProviderProps {");
    parts.push("  children: ReactNode;");
    parts.push(`  initialMode?${modeType};`);
    parts.push("}\n");
  }

  parts.push(
    `export function ThemeProvider({ children, initialMode = "${modes.defaultMode}" }${useTs ? ": ThemeProviderProps" : ""}) {`,
  );
  parts.push(`  const [mode, setMode] = useState${useTs ? modeType : ""}(initialMode);`);
  parts.push("  const value = useMemo(() => ({");
  parts.push("    theme: themes[mode],");
  parts.push("    mode,");
  parts.push("    setMode,");
  parts.push("  }), [mode]);\n");
  parts.push("  return (");
  parts.push("    <ThemeContext.Provider value={value}>");
  parts.push("      {children}");
  parts.push("    </ThemeContext.Provider>");
  parts.push("  );");
  parts.push("}");

  return parts.join("\n");
}

function generateTypesFile(platforms: ("ios" | "android" | "web")[]): string {
  return [
    "// Auto-generated React Native types",
    "// Do not edit manually\n",
    'import type { TextStyle, ViewStyle } from "react-native";\n',
    "export interface IOSShadow {",
    "  shadowColor: string;",
    "  shadowOffset: { width: number; height: number };",
    "  shadowOpacity: number;",
    "  shadowRadius: number;",
    "}\n",
    "export interface AndroidShadow {",
    "  elevation: number;",
    "  shadowColor: string;",
    "}\n",
    "export type Shadow = IOSShadow | AndroidShadow;\n",
    "export { Colors, ColorName } from './colors';",
    "export { Spacing, SpacingName } from './spacing';",
    "export { Sizing, SizingName } from './sizing';",
    "export { Typography, TypographyName } from './typography';",
    "export { Shadows, ShadowName } from './shadows';",
    "export { Theme } from './theme';",
  ].join("\n");
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

// ============================================================================
// Responsive Scaling
// ============================================================================

function generateScalingFile(baseScreenWidth: number, useTs: boolean): string {
  const parts: string[] = [
    "// Auto-generated React Native responsive scaling utilities",
    "// Do not edit manually\n",
    'import { Dimensions, PixelRatio } from "react-native";\n',
  ];

  parts.push(`const BASE_WIDTH = ${baseScreenWidth};\n`);

  parts.push("const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');\n");

  parts.push("/**");
  parts.push(" * Scale a value proportionally to the screen width");
  parts.push(" * @param size - The base size to scale");
  parts.push(" * @returns Scaled size based on screen width");
  parts.push(" */");
  parts.push(`export function scale(size${useTs ? ": number" : ""})${useTs ? ": number" : ""} {`);
  parts.push(`  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH / BASE_WIDTH) * size);`);
  parts.push("}\n");

  parts.push("/**");
  parts.push(" * Scale a value with moderation factor (for typography)");
  parts.push(" * @param size - The base size to scale");
  parts.push(" * @param factor - Moderation factor (0-1), default 0.5");
  parts.push(" * @returns Moderately scaled size");
  parts.push(" */");
  parts.push(`export function moderateScale(size${useTs ? ": number" : ""}, factor${useTs ? ": number" : ""} = 0.5)${useTs ? ": number" : ""} {`);
  parts.push(`  return PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor);`);
  parts.push("}\n");

  parts.push("/**");
  parts.push(" * Scale a value vertically (based on screen height)");
  parts.push(" * @param size - The base size to scale");
  parts.push(" * @returns Vertically scaled size");
  parts.push(" */");
  const baseHeight = Math.round(baseScreenWidth * (16 / 9)); // Assume 16:9 aspect ratio
  parts.push(`export function verticalScale(size${useTs ? ": number" : ""})${useTs ? ": number" : ""} {`);
  parts.push(`  const BASE_HEIGHT = ${baseHeight};`);
  parts.push(`  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / BASE_HEIGHT) * size);`);
  parts.push("}\n");

  parts.push("/**");
  parts.push(" * Responsive font size helper");
  parts.push(" * @param size - Base font size");
  parts.push(" * @returns Responsive font size");
  parts.push(" */");
  parts.push(`export function fontSize(size${useTs ? ": number" : ""})${useTs ? ": number" : ""} {`);
  parts.push(`  return moderateScale(size, 0.25);`);
  parts.push("}\n");

  parts.push("/**");
  parts.push(" * Responsive spacing helper");
  parts.push(" * @param size - Base spacing size");
  parts.push(" * @returns Responsive spacing");
  parts.push(" */");
  parts.push(`export function spacing(size${useTs ? ": number" : ""})${useTs ? ": number" : ""} {`);
  parts.push(`  return scale(size);`);
  parts.push("}\n");

  parts.push("/**");
  parts.push(" * Screen dimensions");
  parts.push(" */");
  parts.push("export const screen = {");
  parts.push("  width: SCREEN_WIDTH,");
  parts.push("  height: SCREEN_HEIGHT,");
  parts.push(`  isSmall: SCREEN_WIDTH < 375,`);
  parts.push(`  isMedium: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,`);
  parts.push(`  isLarge: SCREEN_WIDTH >= 414,`);
  parts.push("} as const;\n");

  if (useTs) {
    parts.push("export type ScalingFunction = (size: number) => number;");
  }

  return parts.join("\n");
}

// ============================================================================
// react-native-paper Theme
// ============================================================================

function generatePaperThemeFile(
  colors: Record<string, Record<string, string>>,
  typography: Record<string, Record<string, Record<string, unknown>>>,
  paperColorMappings: Record<string, Record<PaperColorRole, string>>,
  paperTypographyMappings: Record<PaperTypographyVariant, string>,
  modes: { defaultMode: string; requiredModes: readonly string[] },
  useTs: boolean,
): string {
  const defaultColorMappings = paperColorMappings[modes.defaultMode] || {};
  const darkModeKey = modes.requiredModes.find((m) => m.toLowerCase().includes("dark")) || "dark";
  const darkColorMappings = paperColorMappings[darkModeKey] || {};

  const defaultColors = colors[modes.defaultMode] || {};
  const darkColors = colors[darkModeKey] || {};
  const defaultTypo = typography[modes.defaultMode] || {};

  const parts: string[] = [
    "// Auto-generated react-native-paper theme",
    "// Do not edit manually\n",
    'import { MD3LightTheme, MD3DarkTheme, configureFonts } from "react-native-paper";',
  ];

  if (useTs) {
    parts.push('import type { MD3Theme, MD3Colors } from "react-native-paper";\n');
  } else {
    parts.push("");
  }

  // Build color mappings for light theme
  const buildColorMappings = (
    mappings: Record<PaperColorRole, string>,
    colorSource: Record<string, string>,
  ): string[] => {
    const colorLines: string[] = [];
    const orderedRoles: PaperColorRole[] = [
      "primary",
      "onPrimary",
      "primaryContainer",
      "onPrimaryContainer",
      "secondary",
      "onSecondary",
      "secondaryContainer",
      "onSecondaryContainer",
      "tertiary",
      "onTertiary",
      "tertiaryContainer",
      "onTertiaryContainer",
      "error",
      "onError",
      "errorContainer",
      "onErrorContainer",
      "background",
      "onBackground",
      "surface",
      "onSurface",
      "surfaceVariant",
      "onSurfaceVariant",
      "outline",
      "outlineVariant",
      "inverseSurface",
      "inverseOnSurface",
      "inversePrimary",
      "shadow",
      "scrim",
      "surfaceDisabled",
      "onSurfaceDisabled",
      "backdrop",
    ];

    for (const role of orderedRoles) {
      const tokenName = mappings[role];
      if (tokenName && colorSource[tokenName]) {
        colorLines.push(`    ${role}: "${colorSource[tokenName]}",`);
      }
    }
    return colorLines;
  };

  // Build typography config
  const buildTypographyConfig = (): string[] => {
    const typoLines: string[] = [];
    const orderedVariants: PaperTypographyVariant[] = [
      "displayLarge",
      "displayMedium",
      "displaySmall",
      "headlineLarge",
      "headlineMedium",
      "headlineSmall",
      "titleLarge",
      "titleMedium",
      "titleSmall",
      "bodyLarge",
      "bodyMedium",
      "bodySmall",
      "labelLarge",
      "labelMedium",
      "labelSmall",
    ];

    for (const variant of orderedVariants) {
      const tokenName = paperTypographyMappings[variant];
      if (tokenName && defaultTypo[tokenName]) {
        const style = defaultTypo[tokenName];
        typoLines.push(`    ${variant}: {`);
        if (style.fontFamily) typoLines.push(`      fontFamily: "${style.fontFamily}",`);
        if (style.fontSize) typoLines.push(`      fontSize: ${style.fontSize},`);
        if (style.fontWeight) typoLines.push(`      fontWeight: "${style.fontWeight}",`);
        if (style.lineHeight) typoLines.push(`      lineHeight: ${style.lineHeight},`);
        if (style.letterSpacing) typoLines.push(`      letterSpacing: ${style.letterSpacing},`);
        typoLines.push(`    },`);
      }
    }
    return typoLines;
  };

  const lightColorLines = buildColorMappings(defaultColorMappings, defaultColors);
  const darkColorLines = buildColorMappings(darkColorMappings, darkColors);
  const typographyLines = buildTypographyConfig();

  // Generate font configuration
  if (typographyLines.length > 0) {
    parts.push("const fontConfig = {");
    parts.push(...typographyLines);
    parts.push("} as const;\n");
  }

  // Generate light theme
  parts.push(`export const lightPaperTheme${useTs ? ": MD3Theme" : ""} = {`);
  parts.push("  ...MD3LightTheme,");
  if (lightColorLines.length > 0) {
    parts.push("  colors: {");
    parts.push("    ...MD3LightTheme.colors,");
    parts.push(...lightColorLines);
    parts.push("  },");
  }
  if (typographyLines.length > 0) {
    parts.push("  fonts: configureFonts({ config: fontConfig }),");
  }
  parts.push("} as const;\n");

  // Generate dark theme
  parts.push(`export const darkPaperTheme${useTs ? ": MD3Theme" : ""} = {`);
  parts.push("  ...MD3DarkTheme,");
  if (darkColorLines.length > 0) {
    parts.push("  colors: {");
    parts.push("    ...MD3DarkTheme.colors,");
    parts.push(...darkColorLines);
    parts.push("  },");
  }
  if (typographyLines.length > 0) {
    parts.push("  fonts: configureFonts({ config: fontConfig }),");
  }
  parts.push("} as const;\n");

  // Export helper
  parts.push("/**");
  parts.push(" * Get Paper theme based on color scheme");
  parts.push(" * @param isDark - Whether to use dark theme");
  parts.push(" * @returns Paper MD3 theme");
  parts.push(" */");
  parts.push(`export function getPaperTheme(isDark${useTs ? ": boolean" : ""} = false)${useTs ? ": MD3Theme" : ""} {`);
  parts.push("  return isDark ? darkPaperTheme : lightPaperTheme;");
  parts.push("}");

  return parts.join("\n");
}
