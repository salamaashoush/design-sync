import {
  createFileBuilder,
  createModeRecord,
  definePlugin,
  getModesToIterate,
  stripTokenPrefix,
} from "@design-sync/manager";
import { camelCase, pascalCase } from "@design-sync/utils";
import { type ProcessedToken, isTokenAlias, typographyToCssStyle } from "@design-sync/w3c-dtfm";

/**
 * Material 3 ColorScheme role names
 * Maps to Flutter's ColorScheme properties
 */
export type M3ColorRole =
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
  | "surface"
  | "onSurface"
  | "surfaceContainerLowest"
  | "surfaceContainerLow"
  | "surfaceContainer"
  | "surfaceContainerHigh"
  | "surfaceContainerHighest"
  | "onSurfaceVariant"
  | "outline"
  | "outlineVariant"
  | "inverseSurface"
  | "onInverseSurface"
  | "inversePrimary"
  | "shadow"
  | "scrim"
  | "surfaceTint";

/**
 * Material 3 TextTheme role names
 * Maps to Flutter's TextTheme properties
 */
export type M3TypographyRole =
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

export interface FlutterPluginConfig {
  /** Output directory for generated files (relative to main out dir) */
  outDir?: string;
  /** Library name for Dart files */
  libraryName?: string;
  /**
   * Use Material 3 theming
   * @default true
   */
  material3?: boolean;
  /**
   * Generate ThemeData configuration
   * @default true
   */
  generateThemeData?: boolean;
  /**
   * Support dark mode
   * @default true
   */
  supportDarkMode?: boolean;
  /**
   * Use const constructors for better performance
   * @default true
   */
  useConst?: boolean;
  /**
   * Strip design system prefix from token names
   * @example ['kda', 'foundation'] removes these from all token names
   */
  stripPrefix?: string | string[];
  /**
   * Map token names to Material 3 ColorScheme roles
   * Keys are M3 role names, values are token path patterns
   *
   * @example
   * ```typescript
   * colorSchemeMapping: {
   *   primary: 'brand.primary',
   *   secondary: 'brand.secondary',
   *   surface: 'background.surface',
   *   error: 'semantic.error',
   * }
   * ```
   */
  colorSchemeMapping?: Partial<Record<M3ColorRole, string>>;
  /**
   * Map token names to Material 3 TextTheme roles
   * Keys are M3 role names, values are token path patterns
   *
   * @example
   * ```typescript
   * typographyMapping: {
   *   displayLarge: 'heading.xl',
   *   headlineMedium: 'heading.md',
   *   bodyMedium: 'body.md',
   *   labelSmall: 'label.sm',
   * }
   * ```
   */
  typographyMapping?: Partial<Record<M3TypographyRole, string>>;
  /**
   * Generate ThemeExtension for custom tokens not mapped to M3
   * @default false
   */
  generateThemeExtension?: boolean;
}

// ============================================================================
// M3 Pattern Detection
// ============================================================================

/**
 * Patterns to auto-detect M3 ColorScheme roles from token paths
 */
const COLOR_ROLE_PATTERNS: Record<M3ColorRole, RegExp[]> = {
  primary: [/primary$/i, /brand\.primary/i, /color\.primary/i],
  onPrimary: [/onprimary$/i, /on-primary$/i, /primary\.on/i, /on\.primary/i],
  primaryContainer: [/primarycontainer$/i, /primary-container$/i, /primary\.container/i],
  onPrimaryContainer: [/onprimarycontainer$/i, /on-primary-container$/i, /primary\.container\.on/i],
  secondary: [/secondary$/i, /brand\.secondary/i, /accent$/i],
  onSecondary: [/onsecondary$/i, /on-secondary$/i, /secondary\.on/i],
  secondaryContainer: [/secondarycontainer$/i, /secondary-container$/i, /secondary\.container/i],
  onSecondaryContainer: [/onsecondarycontainer$/i, /on-secondary-container$/i],
  tertiary: [/tertiary$/i, /brand\.tertiary/i],
  onTertiary: [/ontertiary$/i, /on-tertiary$/i, /tertiary\.on/i],
  tertiaryContainer: [/tertiarycontainer$/i, /tertiary-container$/i, /tertiary\.container/i],
  onTertiaryContainer: [/ontertiarycontainer$/i, /on-tertiary-container$/i],
  error: [/error$/i, /semantic\.error/i, /danger$/i],
  onError: [/onerror$/i, /on-error$/i, /error\.on/i],
  errorContainer: [/errorcontainer$/i, /error-container$/i, /error\.container/i],
  onErrorContainer: [/onerrorcontainer$/i, /on-error-container$/i],
  surface: [/surface$/i, /background\.surface/i],
  onSurface: [/onsurface$/i, /on-surface$/i, /surface\.on/i],
  surfaceContainerLowest: [/surfacecontainerlowest$/i, /surface-container-lowest$/i, /surface\.container\.lowest/i],
  surfaceContainerLow: [/surfacecontainerlow$/i, /surface-container-low$/i, /surface\.container\.low/i],
  surfaceContainer: [/surfacecontainer$/i, /surface-container$/i, /surface\.container/i],
  surfaceContainerHigh: [/surfacecontainerhigh$/i, /surface-container-high$/i, /surface\.container\.high/i],
  surfaceContainerHighest: [/surfacecontainerhighest$/i, /surface-container-highest$/i, /surface\.container\.highest/i],
  onSurfaceVariant: [/onsurfacevariant$/i, /on-surface-variant$/i, /surface\.variant\.on/i],
  outline: [/outline$/i, /border$/i],
  outlineVariant: [/outlinevariant$/i, /outline-variant$/i, /border\.light$/i],
  inverseSurface: [/inversesurface$/i, /inverse-surface$/i, /surface\.inverse/i],
  onInverseSurface: [/oninversesurface$/i, /on-inverse-surface$/i],
  inversePrimary: [/inverseprimary$/i, /inverse-primary$/i, /primary\.inverse/i],
  shadow: [/shadow$/i, /shadow\.color/i],
  scrim: [/scrim$/i, /overlay$/i, /backdrop$/i],
  surfaceTint: [/surfacetint$/i, /surface-tint$/i, /surface\.tint/i],
};

/**
 * Patterns to auto-detect M3 TextTheme roles from token paths
 */
const TYPOGRAPHY_ROLE_PATTERNS: Record<M3TypographyRole, RegExp[]> = {
  displayLarge: [/displaylarge$/i, /display-large$/i, /display\.lg$/i, /heading\.xxxl$/i, /h1$/i],
  displayMedium: [/displaymedium$/i, /display-medium$/i, /display\.md$/i, /heading\.xxl$/i, /h2$/i],
  displaySmall: [/displaysmall$/i, /display-small$/i, /display\.sm$/i, /heading\.xl$/i],
  headlineLarge: [/headlinelarge$/i, /headline-large$/i, /headline\.lg$/i, /heading\.lg$/i, /h3$/i],
  headlineMedium: [/headlinemedium$/i, /headline-medium$/i, /headline\.md$/i, /heading\.md$/i, /h4$/i],
  headlineSmall: [/headlinesmall$/i, /headline-small$/i, /headline\.sm$/i, /heading\.sm$/i, /h5$/i],
  titleLarge: [/titlelarge$/i, /title-large$/i, /title\.lg$/i, /h6$/i],
  titleMedium: [/titlemedium$/i, /title-medium$/i, /title\.md$/i, /subtitle$/i],
  titleSmall: [/titlesmall$/i, /title-small$/i, /title\.sm$/i],
  bodyLarge: [/bodylarge$/i, /body-large$/i, /body\.lg$/i, /paragraph\.lg$/i],
  bodyMedium: [/bodymedium$/i, /body-medium$/i, /body\.md$/i, /paragraph$/i, /body$/i],
  bodySmall: [/bodysmall$/i, /body-small$/i, /body\.sm$/i, /paragraph\.sm$/i],
  labelLarge: [/labellarge$/i, /label-large$/i, /label\.lg$/i, /button$/i],
  labelMedium: [/labelmedium$/i, /label-medium$/i, /label\.md$/i, /label$/i],
  labelSmall: [/labelsmall$/i, /label-small$/i, /label\.sm$/i, /caption$/i, /overline$/i],
};

/**
 * Find M3 color role for a given token path
 */
function detectColorRole(path: string): M3ColorRole | null {
  for (const [role, patterns] of Object.entries(COLOR_ROLE_PATTERNS) as [M3ColorRole, RegExp[]][]) {
    if (patterns.some((p) => p.test(path))) {
      return role;
    }
  }
  return null;
}

/**
 * Find M3 typography role for a given token path
 */
function detectTypographyRole(path: string): M3TypographyRole | null {
  for (const [role, patterns] of Object.entries(TYPOGRAPHY_ROLE_PATTERNS) as [M3TypographyRole, RegExp[]][]) {
    if (patterns.some((p) => p.test(path))) {
      return role;
    }
  }
  return null;
}

/**
 * Find color role using explicit mapping or auto-detection
 */
function findColorRole(
  path: string,
  tokenName: string,
  explicitMapping?: Partial<Record<M3ColorRole, string>>,
): M3ColorRole | null {
  // Check explicit mappings first
  if (explicitMapping) {
    for (const [role, pattern] of Object.entries(explicitMapping) as [M3ColorRole, string][]) {
      if (path.includes(pattern) || tokenName === camelCase(pattern.split(".").join("-"))) {
        return role;
      }
    }
  }
  // Fall back to auto-detection
  return detectColorRole(path);
}

/**
 * Find typography role using explicit mapping or auto-detection
 */
function findTypographyRole(
  path: string,
  tokenName: string,
  explicitMapping?: Partial<Record<M3TypographyRole, string>>,
): M3TypographyRole | null {
  // Check explicit mappings first
  if (explicitMapping) {
    for (const [role, pattern] of Object.entries(explicitMapping) as [M3TypographyRole, string][]) {
      if (path.includes(pattern) || tokenName === camelCase(pattern.split(".").join("-"))) {
        return role;
      }
    }
  }
  // Fall back to auto-detection
  return detectTypographyRole(path);
}

/**
 * Flutter Plugin - Exports design tokens as Dart code for Flutter
 *
 * Creates Dart files with Color constants, TextStyle definitions,
 * and ThemeData configuration for Material 3.
 *
 * @example
 * ```typescript
 * // design-sync.config.ts
 * import { flutterPlugin } from '@design-sync/flutter-plugin';
 *
 * export default {
 *   plugins: [flutterPlugin({
 *     libraryName: 'app_theme',
 *     material3: true,
 *     generateThemeData: true
 *   })],
 * };
 * ```
 *
 * Usage in Flutter:
 * ```dart
 * import 'tokens/theme_data.dart';
 *
 * MaterialApp(
 *   theme: AppThemeData.lightTheme,
 *   darkTheme: AppThemeData.darkTheme,
 * )
 * ```
 */
export function flutterPlugin(config: FlutterPluginConfig = {}): ReturnType<typeof definePlugin> {
  const {
    outDir = "",
    libraryName = "design_tokens",
    material3 = true,
    generateThemeData = true,
    supportDarkMode = true,
    useConst = true,
    stripPrefix,
    colorSchemeMapping,
    typographyMapping,
    generateThemeExtension = false,
  } = config;

  const stripPrefixArray = stripPrefix
    ? Array.isArray(stripPrefix)
      ? stripPrefix
      : stripPrefix.split(".")
    : [];

  return definePlugin("flutter-plugin", (context) => {
    const { modes } = context;
    const builder = createFileBuilder(outDir);

    // Collect tokens by category
    const colors = createModeRecord<Record<string, string>>(modes, () => ({}));
    const spacing = createModeRecord<Record<string, number>>(modes, () => ({}));
    const typography = createModeRecord<Record<string, Record<string, unknown>>>(modes, () => ({}));
    const shadows = createModeRecord<Record<string, string[]>>(modes, () => ({}));
    const radii = createModeRecord<Record<string, number>>(modes, () => ({}));

    // M3 color role mappings (role -> token name for each mode)
    const colorRoleMappings = createModeRecord<Record<M3ColorRole, string>>(modes, () => ({} as Record<M3ColorRole, string>));
    // M3 typography role mappings (role -> token name)
    const typographyRoleMappings: Record<M3TypographyRole, string> = {} as Record<M3TypographyRole, string>;

    // Process all tokens
    context.query().forEach((token) => {
      const { type, path } = token;
      const pathLower = path.toLowerCase();
      const tokenName = getTokenName(path, stripPrefixArray);

      switch (type) {
        case "color":
          processColorToken(token, colors, modes.defaultMode, stripPrefixArray);
          // Detect or use explicit M3 color role mapping
          const colorRole = findColorRole(path, tokenName, colorSchemeMapping);
          if (colorRole) {
            for (const mode of Object.keys(colorRoleMappings)) {
              colorRoleMappings[mode][colorRole] = tokenName;
            }
          }
          break;
        case "dimension":
          if (pathLower.includes("radius") || pathLower.includes("radii")) {
            processRadiusToken(token, radii, modes.defaultMode, stripPrefixArray);
          } else if (!pathLower.includes("font")) {
            processSpacingToken(token, spacing, modes.defaultMode, stripPrefixArray);
          }
          break;
        case "typography":
          processTypographyToken(token, typography, modes.defaultMode, stripPrefixArray);
          // Detect or use explicit M3 typography role mapping
          const typoRole = findTypographyRole(path, tokenName, typographyMapping);
          if (typoRole) {
            typographyRoleMappings[typoRole] = tokenName;
          }
          break;
        case "shadow":
          processShadowToken(token, shadows, modes.defaultMode, stripPrefixArray);
          break;
      }
    });

    // Generate Dart files
    builder.add("colors.dart", generateColorsFile(colors, modes, libraryName, useConst));
    builder.add("spacing.dart", generateSpacingFile(spacing[modes.defaultMode], libraryName, useConst));
    builder.add("typography.dart", generateTypographyFile(typography[modes.defaultMode], libraryName, useConst));
    builder.add("shadows.dart", generateShadowsFile(shadows[modes.defaultMode], libraryName, useConst));
    builder.add("radii.dart", generateRadiiFile(radii[modes.defaultMode], libraryName, useConst));

    if (generateThemeData) {
      builder.add(
        "theme_data.dart",
        generateThemeDataFile(
          libraryName,
          material3,
          supportDarkMode,
          colorRoleMappings,
          typographyRoleMappings,
          modes,
        ),
      );
    }

    if (generateThemeExtension) {
      builder.add(
        "theme_extension.dart",
        generateThemeExtensionFile(
          colors,
          typography,
          colorRoleMappings,
          typographyRoleMappings,
          modes,
          libraryName,
        ),
      );
    }

    // Generate barrel file
    builder.add(`${libraryName}.dart`, generateBarrelFile(libraryName, generateThemeData, generateThemeExtension));

    return builder.build();
  });
}

// ============================================================================
// Token Processing
// ============================================================================

function getTokenName(path: string, stripPrefixArray: string[] = []): string {
  // Apply prefix stripping first
  let simplifiedPath = path;
  if (stripPrefixArray.length > 0) {
    simplifiedPath = stripTokenPrefix(path, { prefixes: stripPrefixArray, separator: "." });
  }

  const parts = simplifiedPath.split(".");
  const filtered = parts.filter(
    (p) =>
      !["colors", "color", "spacing", "space", "typography", "shadows", "shadow", "radii", "radius"].includes(
        p.toLowerCase(),
      ),
  );
  return camelCase(filtered.join("-"));
}

function processColorToken(
  token: ProcessedToken,
  colors: Record<string, Record<string, string>>,
  defaultMode: string,
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);
  for (const mode of Object.keys(colors)) {
    const cssColor = token.toCSS(mode);
    colors[mode][name] = cssToFlutterColor(cssColor);
  }
}

function processSpacingToken(
  token: ProcessedToken,
  spacing: Record<string, Record<string, number>>,
  defaultMode: string,
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);
  for (const mode of Object.keys(spacing)) {
    spacing[mode][name] = cssToNumber(token.toCSS(mode));
  }
}

function processRadiusToken(
  token: ProcessedToken,
  radii: Record<string, Record<string, number>>,
  defaultMode: string,
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);
  for (const mode of Object.keys(radii)) {
    radii[mode][name] = cssToNumber(token.toCSS(mode));
  }
}

function processTypographyToken(
  token: ProcessedToken,
  typography: Record<string, Record<string, Record<string, unknown>>>,
  defaultMode: string,
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);

  for (const mode of Object.keys(typography)) {
    const value = token.getValue(mode);
    const style = typographyToCssStyle(value);

    if (isTokenAlias(style) || typeof style !== "object") continue;

    const dartStyle: Record<string, unknown> = {};
    const cssStyle = style as Record<string, unknown>;

    if (cssStyle.fontFamily) {
      dartStyle.fontFamily = String(cssStyle.fontFamily).split(",")[0].trim().replace(/['"]/g, "");
    }
    if (cssStyle.fontSize) {
      dartStyle.fontSize = cssToNumber(String(cssStyle.fontSize));
    }
    if (cssStyle.fontWeight) {
      dartStyle.fontWeight = cssToFlutterFontWeight(String(cssStyle.fontWeight));
    }
    if (cssStyle.lineHeight) {
      dartStyle.height = cssToNumber(String(cssStyle.lineHeight));
    }
    if (cssStyle.letterSpacing) {
      dartStyle.letterSpacing = cssToNumber(String(cssStyle.letterSpacing));
    }

    typography[mode][name] = dartStyle;
  }
}

function processShadowToken(
  token: ProcessedToken,
  shadows: Record<string, Record<string, string[]>>,
  defaultMode: string,
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);

  for (const mode of Object.keys(shadows)) {
    const cssValue = token.toCSS(mode);
    shadows[mode][name] = [cssToFlutterBoxShadow(cssValue)];
  }
}

// ============================================================================
// Dart Conversion Helpers
// ============================================================================

function cssToNumber(value: string): number {
  const match = value.match(/^(-?\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function cssToFlutterColor(cssColor: string): string {
  // Handle hex colors
  const hexMatch = cssColor.match(/^#([0-9a-fA-F]{3,8})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length === 6) {
      hex = "FF" + hex; // Add full alpha
    }
    if (hex.length === 8) {
      // Dart Color expects AARRGGBB, CSS is RRGGBBAA
      // Assuming hex is RRGGBBAA format, convert to AARRGGBB
      // Actually CSS hex is usually RRGGBB or RRGGBBAA
      // Let's assume it's RRGGBBAA and convert
      const r = hex.substring(0, 2);
      const g = hex.substring(2, 4);
      const b = hex.substring(4, 6);
      const a = hex.substring(6, 8);
      hex = a + r + g + b;
    }
    return `0x${hex.toUpperCase()}`;
  }

  // Handle rgba
  const rgbaMatch = cssColor.match(
    /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)/,
  );
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, "0");
    const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, "0");
    const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, "0");
    const a = rgbaMatch[4]
      ? Math.round(parseFloat(rgbaMatch[4]) * 255)
          .toString(16)
          .padStart(2, "0")
      : "FF";
    return `0x${a.toUpperCase()}${r.toUpperCase()}${g.toUpperCase()}${b.toUpperCase()}`;
  }

  // Default fallback
  return "0xFF000000";
}

function cssToFlutterFontWeight(weight: string): string {
  const weightMap: Record<string, string> = {
    "100": "FontWeight.w100",
    "200": "FontWeight.w200",
    "300": "FontWeight.w300",
    "400": "FontWeight.w400",
    "500": "FontWeight.w500",
    "600": "FontWeight.w600",
    "700": "FontWeight.w700",
    "800": "FontWeight.w800",
    "900": "FontWeight.w900",
    thin: "FontWeight.w100",
    extralight: "FontWeight.w200",
    light: "FontWeight.w300",
    normal: "FontWeight.w400",
    regular: "FontWeight.w400",
    medium: "FontWeight.w500",
    semibold: "FontWeight.w600",
    bold: "FontWeight.w700",
    extrabold: "FontWeight.w800",
    black: "FontWeight.w900",
  };
  return weightMap[weight.toLowerCase()] || "FontWeight.w400";
}

function cssToFlutterBoxShadow(cssShadow: string): string {
  // Parse: offsetX offsetY blurRadius spreadRadius color
  const match = cssShadow.match(
    /(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s*(?:(-?\d+(?:\.\d+)?(?:px)?)\s+)?(.+)/,
  );

  if (!match) {
    return "BoxShadow(color: Color(0x40000000), blurRadius: 4, offset: Offset(0, 2))";
  }

  const offsetX = cssToNumber(match[1]);
  const offsetY = cssToNumber(match[2]);
  const blur = cssToNumber(match[3]);
  const spread = match[4] ? cssToNumber(match[4]) : 0;
  const color = cssToFlutterColor(match[5].trim());

  return `BoxShadow(color: Color(${color}), blurRadius: ${blur}, spreadRadius: ${spread}, offset: Offset(${offsetX}, ${offsetY}))`;
}

// ============================================================================
// File Generation
// ============================================================================

function generateColorsFile(
  colors: Record<string, Record<string, string>>,
  modes: { defaultMode: string; requiredModes: readonly string[] },
  libraryName: string,
  useConst: boolean,
): string {
  const lines: string[] = [
    "// Auto-generated Flutter colors",
    "// Do not edit manually",
    "",
    "import 'package:flutter/material.dart';",
    "",
  ];

  // Generate color classes for each mode
  for (const mode of getModesToIterate(modes as any)) {
    const className = `AppColors${mode === modes.defaultMode ? "" : pascalCase(mode)}`;
    lines.push(`/// ${mode === modes.defaultMode ? "Default" : pascalCase(mode)} color palette`);
    lines.push(`class ${className} {`);
    lines.push(`  ${className}._();`);
    lines.push("");

    for (const [name, value] of Object.entries(colors[mode])) {
      const constKeyword = useConst ? "static const " : "static final ";
      lines.push(`  ${constKeyword}Color ${name} = Color(${value});`);
    }

    lines.push("}");
    lines.push("");
  }

  return lines.join("\n");
}

function generateSpacingFile(
  spacing: Record<string, number>,
  libraryName: string,
  useConst: boolean,
): string {
  const constKeyword = useConst ? "static const " : "static final ";

  const lines: string[] = [
    "// Auto-generated Flutter spacing",
    "// Do not edit manually",
    "",
    "/// Spacing constants for consistent layout",
    "class AppSpacing {",
    "  AppSpacing._();",
    "",
  ];

  for (const [name, value] of Object.entries(spacing)) {
    lines.push(`  ${constKeyword}double ${name} = ${value};`);
  }

  lines.push("}");

  return lines.join("\n");
}

function generateTypographyFile(
  typography: Record<string, Record<string, unknown>>,
  libraryName: string,
  useConst: boolean,
): string {
  const constKeyword = useConst ? "static const " : "static final ";

  const lines: string[] = [
    "// Auto-generated Flutter typography",
    "// Do not edit manually",
    "",
    "import 'package:flutter/material.dart';",
    "",
    "/// Typography styles for consistent text appearance",
    "class AppTypography {",
    "  AppTypography._();",
    "",
  ];

  for (const [name, style] of Object.entries(typography)) {
    const props: string[] = [];

    if (style.fontFamily) {
      props.push(`fontFamily: '${style.fontFamily}'`);
    }
    if (style.fontSize !== undefined) {
      props.push(`fontSize: ${style.fontSize}`);
    }
    if (style.fontWeight) {
      props.push(`fontWeight: ${style.fontWeight}`);
    }
    if (style.height !== undefined) {
      // Line height in Flutter is relative to font size
      const lineHeight =
        style.fontSize && typeof style.height === "number"
          ? (style.height as number) / (style.fontSize as number)
          : style.height;
      props.push(`height: ${typeof lineHeight === "number" ? lineHeight.toFixed(2) : lineHeight}`);
    }
    if (style.letterSpacing !== undefined) {
      props.push(`letterSpacing: ${style.letterSpacing}`);
    }

    lines.push(`  ${constKeyword}TextStyle ${name} = TextStyle(`);
    lines.push(`    ${props.join(",\n    ")},`);
    lines.push(`  );`);
    lines.push("");
  }

  lines.push("}");

  return lines.join("\n");
}

function generateShadowsFile(
  shadows: Record<string, string[]>,
  libraryName: string,
  useConst: boolean,
): string {
  const constKeyword = useConst ? "static const " : "static final ";

  const lines: string[] = [
    "// Auto-generated Flutter shadows",
    "// Do not edit manually",
    "",
    "import 'package:flutter/material.dart';",
    "",
    "/// Box shadow definitions",
    "class AppShadows {",
    "  AppShadows._();",
    "",
  ];

  for (const [name, shadowList] of Object.entries(shadows)) {
    lines.push(`  ${constKeyword}List<BoxShadow> ${name} = [`);
    for (const shadow of shadowList) {
      lines.push(`    ${shadow},`);
    }
    lines.push(`  ];`);
    lines.push("");
  }

  lines.push("}");

  return lines.join("\n");
}

function generateRadiiFile(
  radii: Record<string, number>,
  libraryName: string,
  useConst: boolean,
): string {
  const constKeyword = useConst ? "static const " : "static final ";

  const lines: string[] = [
    "// Auto-generated Flutter border radii",
    "// Do not edit manually",
    "",
    "import 'package:flutter/material.dart';",
    "",
    "/// Border radius constants",
    "class AppRadii {",
    "  AppRadii._();",
    "",
  ];

  for (const [name, value] of Object.entries(radii)) {
    lines.push(`  ${constKeyword}double ${name} = ${value};`);
    lines.push(`  ${constKeyword}BorderRadius ${name}Radius = BorderRadius.circular(${value});`);
  }

  lines.push("}");

  return lines.join("\n");
}

function generateThemeDataFile(
  libraryName: string,
  material3: boolean,
  supportDarkMode: boolean,
  colorRoleMappings: Record<string, Record<M3ColorRole, string>>,
  typographyRoleMappings: Record<M3TypographyRole, string>,
  modes: { defaultMode: string; requiredModes: readonly string[] },
): string {
  const defaultColorMappings = colorRoleMappings[modes.defaultMode] || {};
  const darkModeKey = modes.requiredModes.find((m) => m.toLowerCase().includes("dark")) || "dark";
  const darkColorMappings = colorRoleMappings[darkModeKey] || {};

  // Build color scheme properties from mappings
  const buildColorSchemeProps = (mappings: Record<M3ColorRole, string>, colorClass: string): string[] => {
    const props: string[] = [];
    const roleOrder: M3ColorRole[] = [
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
      "surface",
      "onSurface",
      "surfaceContainerLowest",
      "surfaceContainerLow",
      "surfaceContainer",
      "surfaceContainerHigh",
      "surfaceContainerHighest",
      "onSurfaceVariant",
      "outline",
      "outlineVariant",
      "inverseSurface",
      "onInverseSurface",
      "inversePrimary",
      "shadow",
      "scrim",
      "surfaceTint",
    ];

    for (const role of roleOrder) {
      if (mappings[role]) {
        props.push(`      ${role}: ${colorClass}.${mappings[role]},`);
      }
    }
    return props;
  };

  // Build text theme properties from mappings
  const buildTextThemeProps = (): string[] => {
    const props: string[] = [];
    const roleOrder: M3TypographyRole[] = [
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

    for (const role of roleOrder) {
      if (typographyRoleMappings[role]) {
        props.push(`      ${role}: AppTypography.${typographyRoleMappings[role]},`);
      }
    }
    return props;
  };

  const lightColorProps = buildColorSchemeProps(defaultColorMappings, "AppColors");
  const darkColorProps = buildColorSchemeProps(darkColorMappings, `AppColors${pascalCase(darkModeKey)}`);
  const textThemeProps = buildTextThemeProps();
  const hasTextTheme = textThemeProps.length > 0;

  const lines: string[] = [
    "// Auto-generated Flutter ThemeData",
    "// Do not edit manually",
    "",
    "import 'package:flutter/material.dart';",
    "import 'colors.dart';",
    "import 'typography.dart';",
    "",
    "/// App theme configuration with Material 3 ColorScheme mapping",
    "class AppThemeData {",
    "  AppThemeData._();",
    "",
    `  static final ThemeData lightTheme = ThemeData(`,
    `    useMaterial3: ${material3},`,
    `    brightness: Brightness.light,`,
  ];

  // Add ColorScheme
  if (lightColorProps.length > 0) {
    lines.push(`    colorScheme: ColorScheme.light(`);
    lines.push(...lightColorProps);
    lines.push(`    ),`);
  }

  // Add TextTheme
  if (hasTextTheme) {
    lines.push(`    textTheme: const TextTheme(`);
    lines.push(...textThemeProps);
    lines.push(`    ),`);
  }

  lines.push(`  );`);
  lines.push("");

  if (supportDarkMode) {
    lines.push(`  static final ThemeData darkTheme = ThemeData(`);
    lines.push(`    useMaterial3: ${material3},`);
    lines.push(`    brightness: Brightness.dark,`);

    // Add ColorScheme for dark mode
    if (darkColorProps.length > 0) {
      lines.push(`    colorScheme: ColorScheme.dark(`);
      lines.push(...darkColorProps);
      lines.push(`    ),`);
    }

    // Add TextTheme (same for both modes in M3)
    if (hasTextTheme) {
      lines.push(`    textTheme: const TextTheme(`);
      lines.push(...textThemeProps);
      lines.push(`    ),`);
    }

    lines.push(`  );`);
  }

  lines.push("}");

  return lines.join("\n");
}

/**
 * Generate ThemeExtension for custom tokens not mapped to M3
 */
function generateThemeExtensionFile(
  colors: Record<string, Record<string, string>>,
  typography: Record<string, Record<string, Record<string, unknown>>>,
  colorRoleMappings: Record<string, Record<M3ColorRole, string>>,
  typographyRoleMappings: Record<M3TypographyRole, string>,
  modes: { defaultMode: string; requiredModes: readonly string[] },
  libraryName: string,
): string {
  const defaultMode = modes.defaultMode;
  const darkModeKey = modes.requiredModes.find((m) => m.toLowerCase().includes("dark")) || "dark";

  // Find colors not mapped to M3 roles
  const mappedColorNames = new Set(Object.values(colorRoleMappings[defaultMode] || {}));
  const customColors = Object.keys(colors[defaultMode] || {}).filter((name) => !mappedColorNames.has(name));

  // Find typography not mapped to M3 roles
  const mappedTypoNames = new Set(Object.values(typographyRoleMappings));
  const customTypography = Object.keys(typography[defaultMode] || {}).filter((name) => !mappedTypoNames.has(name));

  const lines: string[] = [
    "// Auto-generated Flutter ThemeExtension for custom tokens",
    "// Do not edit manually",
    "",
    "import 'package:flutter/material.dart';",
    "import 'colors.dart';",
    "import 'typography.dart';",
    "",
  ];

  // Generate custom colors extension
  if (customColors.length > 0) {
    lines.push("/// Custom color tokens not mapped to Material 3 ColorScheme");
    lines.push("@immutable");
    lines.push("class AppColorsExtension extends ThemeExtension<AppColorsExtension> {");
    lines.push("  const AppColorsExtension({");
    for (const name of customColors) {
      lines.push(`    required this.${name},`);
    }
    lines.push("  });");
    lines.push("");

    for (const name of customColors) {
      lines.push(`  final Color ${name};`);
    }
    lines.push("");

    // Light theme instance
    lines.push("  static const light = AppColorsExtension(");
    for (const name of customColors) {
      lines.push(`    ${name}: AppColors.${name},`);
    }
    lines.push("  );");
    lines.push("");

    // Dark theme instance
    if (colors[darkModeKey]) {
      lines.push("  static const dark = AppColorsExtension(");
      for (const name of customColors) {
        lines.push(`    ${name}: AppColors${pascalCase(darkModeKey)}.${name},`);
      }
      lines.push("  );");
      lines.push("");
    }

    // copyWith
    lines.push("  @override");
    lines.push("  AppColorsExtension copyWith({");
    for (const name of customColors) {
      lines.push(`    Color? ${name},`);
    }
    lines.push("  }) {");
    lines.push("    return AppColorsExtension(");
    for (const name of customColors) {
      lines.push(`      ${name}: ${name} ?? this.${name},`);
    }
    lines.push("    );");
    lines.push("  }");
    lines.push("");

    // lerp
    lines.push("  @override");
    lines.push("  AppColorsExtension lerp(AppColorsExtension? other, double t) {");
    lines.push("    if (other is! AppColorsExtension) return this;");
    lines.push("    return AppColorsExtension(");
    for (const name of customColors) {
      lines.push(`      ${name}: Color.lerp(${name}, other.${name}, t)!,`);
    }
    lines.push("    );");
    lines.push("  }");
    lines.push("}");
    lines.push("");
  }

  // Generate custom typography extension
  if (customTypography.length > 0) {
    lines.push("/// Custom typography tokens not mapped to Material 3 TextTheme");
    lines.push("@immutable");
    lines.push("class AppTypographyExtension extends ThemeExtension<AppTypographyExtension> {");
    lines.push("  const AppTypographyExtension({");
    for (const name of customTypography) {
      lines.push(`    required this.${name},`);
    }
    lines.push("  });");
    lines.push("");

    for (const name of customTypography) {
      lines.push(`  final TextStyle ${name};`);
    }
    lines.push("");

    // Default instance
    lines.push("  static const instance = AppTypographyExtension(");
    for (const name of customTypography) {
      lines.push(`    ${name}: AppTypography.${name},`);
    }
    lines.push("  );");
    lines.push("");

    // copyWith
    lines.push("  @override");
    lines.push("  AppTypographyExtension copyWith({");
    for (const name of customTypography) {
      lines.push(`    TextStyle? ${name},`);
    }
    lines.push("  }) {");
    lines.push("    return AppTypographyExtension(");
    for (const name of customTypography) {
      lines.push(`      ${name}: ${name} ?? this.${name},`);
    }
    lines.push("    );");
    lines.push("  }");
    lines.push("");

    // lerp
    lines.push("  @override");
    lines.push("  AppTypographyExtension lerp(AppTypographyExtension? other, double t) {");
    lines.push("    if (other is! AppTypographyExtension) return this;");
    lines.push("    return AppTypographyExtension(");
    for (const name of customTypography) {
      lines.push(`      ${name}: TextStyle.lerp(${name}, other.${name}, t)!,`);
    }
    lines.push("    );");
    lines.push("  }");
    lines.push("}");
  }

  return lines.join("\n");
}

function generateBarrelFile(
  libraryName: string,
  includeThemeData: boolean,
  includeThemeExtension: boolean,
): string {
  const exports = [
    `export 'colors.dart';`,
    `export 'spacing.dart';`,
    `export 'typography.dart';`,
    `export 'shadows.dart';`,
    `export 'radii.dart';`,
  ];

  if (includeThemeData) {
    exports.push(`export 'theme_data.dart';`);
  }

  if (includeThemeExtension) {
    exports.push(`export 'theme_extension.dart';`);
  }

  return [
    "// Auto-generated Flutter design tokens barrel file",
    "// Do not edit manually",
    "",
    `library ${libraryName};`,
    "",
    ...exports,
  ].join("\n");
}
