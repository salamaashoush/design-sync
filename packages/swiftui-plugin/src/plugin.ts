import {
  createFileBuilder,
  createModeRecord,
  definePlugin,
  getModesToIterate,
  stripTokenPrefix,
} from "@design-sync/manager";
import { camelCase } from "@design-sync/utils";
import { type ProcessedToken, isTokenAlias, typographyToCssStyle } from "@design-sync/w3c-dtfm";

/**
 * iOS semantic color roles
 * Maps to UIKit/SwiftUI semantic color system
 */
export type SemanticColorRole =
  | "label"
  | "secondaryLabel"
  | "tertiaryLabel"
  | "quaternaryLabel"
  | "systemBackground"
  | "secondarySystemBackground"
  | "tertiarySystemBackground"
  | "systemGroupedBackground"
  | "secondarySystemGroupedBackground"
  | "tertiarySystemGroupedBackground"
  | "separator"
  | "opaqueSeparator"
  | "link"
  | "systemFill"
  | "secondarySystemFill"
  | "tertiarySystemFill"
  | "quaternarySystemFill"
  | "tintColor"
  | "accentColor";

/**
 * iOS text style roles
 * Maps to Apple's Dynamic Type text styles
 */
export type DynamicTypeStyle =
  | "largeTitle"
  | "title1"
  | "title2"
  | "title3"
  | "headline"
  | "subheadline"
  | "body"
  | "callout"
  | "footnote"
  | "caption1"
  | "caption2";

export interface SwiftUIPluginConfig {
  /** Output directory for generated files (relative to main out dir) */
  outDir?: string;
  /** Swift package/module name */
  packageName?: string;
  /**
   * Access level for generated code
   * @default 'public'
   */
  accessLevel?: "public" | "internal" | "package";
  /**
   * Generate Xcode asset catalog for colors
   * @default false
   */
  generateAssetCatalog?: boolean;
  /**
   * Color type to use
   * @default 'SwiftUI'
   */
  colorType?: "SwiftUI" | "UIKit";
  /**
   * Support dark mode
   * @default true
   */
  supportDarkMode?: boolean;
  /**
   * Strip design system prefix from token names
   * @example ['kda', 'foundation'] removes these from all token names
   */
  stripPrefix?: string | string[];
  /**
   * Map token names to iOS semantic color roles
   * Keys are semantic role names, values are token path patterns
   *
   * @example
   * ```typescript
   * semanticColorMapping: {
   *   label: 'text.primary',
   *   secondaryLabel: 'text.secondary',
   *   systemBackground: 'background.primary',
   *   tintColor: 'brand.primary',
   * }
   * ```
   */
  semanticColorMapping?: Partial<Record<SemanticColorRole, string>>;
  /**
   * Map token names to Dynamic Type text styles
   * Keys are Dynamic Type style names, values are token path patterns
   *
   * @example
   * ```typescript
   * dynamicTypeMapping: {
   *   largeTitle: 'heading.xl',
   *   title1: 'heading.lg',
   *   body: 'body.md',
   *   caption1: 'caption.sm',
   * }
   * ```
   */
  dynamicTypeMapping?: Partial<Record<DynamicTypeStyle, string>>;
  /**
   * Generate @Environment values for theme properties
   * @default false
   */
  generateEnvironmentValues?: boolean;
  /**
   * Support Dynamic Type scaling for typography
   * @default true
   */
  supportDynamicType?: boolean;
}

// ============================================================================
// Semantic Pattern Detection
// ============================================================================

/**
 * Patterns to auto-detect iOS semantic color roles from token paths
 */
const SEMANTIC_COLOR_PATTERNS: Record<SemanticColorRole, RegExp[]> = {
  label: [/text\.primary$/i, /label\.primary$/i, /foreground$/i],
  secondaryLabel: [/text\.secondary$/i, /label\.secondary$/i],
  tertiaryLabel: [/text\.tertiary$/i, /label\.tertiary$/i],
  quaternaryLabel: [/text\.quaternary$/i, /label\.quaternary$/i],
  systemBackground: [/background\.primary$/i, /background$/i, /surface$/i],
  secondarySystemBackground: [/background\.secondary$/i, /surface\.secondary$/i],
  tertiarySystemBackground: [/background\.tertiary$/i, /surface\.tertiary$/i],
  systemGroupedBackground: [/background\.grouped$/i, /grouped\.background$/i],
  secondarySystemGroupedBackground: [/background\.grouped\.secondary$/i],
  tertiarySystemGroupedBackground: [/background\.grouped\.tertiary$/i],
  separator: [/separator$/i, /divider$/i, /border$/i],
  opaqueSeparator: [/separator\.opaque$/i, /divider\.opaque$/i],
  link: [/link$/i, /text\.link$/i],
  systemFill: [/fill$/i, /fill\.primary$/i],
  secondarySystemFill: [/fill\.secondary$/i],
  tertiarySystemFill: [/fill\.tertiary$/i],
  quaternarySystemFill: [/fill\.quaternary$/i],
  tintColor: [/tint$/i, /accent$/i, /brand\.primary$/i, /primary$/i],
  accentColor: [/accent$/i, /brand$/i],
};

/**
 * Patterns to auto-detect Dynamic Type styles from token paths
 */
const DYNAMIC_TYPE_PATTERNS: Record<DynamicTypeStyle, RegExp[]> = {
  largeTitle: [/largetitle$/i, /large-title$/i, /display$/i, /heading\.xxxl$/i],
  title1: [/title1$/i, /title-1$/i, /heading\.xxl$/i, /h1$/i],
  title2: [/title2$/i, /title-2$/i, /heading\.xl$/i, /h2$/i],
  title3: [/title3$/i, /title-3$/i, /heading\.lg$/i, /h3$/i],
  headline: [/headline$/i, /heading\.md$/i, /h4$/i],
  subheadline: [/subheadline$/i, /subhead$/i, /heading\.sm$/i, /h5$/i],
  body: [/body$/i, /body\.md$/i, /paragraph$/i],
  callout: [/callout$/i, /body\.lg$/i],
  footnote: [/footnote$/i, /body\.sm$/i],
  caption1: [/caption1$/i, /caption-1$/i, /caption$/i, /label\.md$/i],
  caption2: [/caption2$/i, /caption-2$/i, /label\.sm$/i, /overline$/i],
};

/**
 * Find semantic color role using explicit mapping or auto-detection
 */
function findSemanticColorRole(
  path: string,
  tokenName: string,
  explicitMapping?: Partial<Record<SemanticColorRole, string>>,
): SemanticColorRole | null {
  // Check explicit mappings first
  if (explicitMapping) {
    for (const [role, pattern] of Object.entries(explicitMapping) as [SemanticColorRole, string][]) {
      if (path.includes(pattern) || tokenName === camelCase(pattern.split(".").join("-"))) {
        return role;
      }
    }
  }
  // Fall back to auto-detection
  for (const [role, patterns] of Object.entries(SEMANTIC_COLOR_PATTERNS) as [SemanticColorRole, RegExp[]][]) {
    if (patterns.some((p) => p.test(path))) {
      return role;
    }
  }
  return null;
}

/**
 * Find Dynamic Type style using explicit mapping or auto-detection
 */
function findDynamicTypeStyle(
  path: string,
  tokenName: string,
  explicitMapping?: Partial<Record<DynamicTypeStyle, string>>,
): DynamicTypeStyle | null {
  // Check explicit mappings first
  if (explicitMapping) {
    for (const [style, pattern] of Object.entries(explicitMapping) as [DynamicTypeStyle, string][]) {
      if (path.includes(pattern) || tokenName === camelCase(pattern.split(".").join("-"))) {
        return style;
      }
    }
  }
  // Fall back to auto-detection
  for (const [style, patterns] of Object.entries(DYNAMIC_TYPE_PATTERNS) as [DynamicTypeStyle, RegExp[]][]) {
    if (patterns.some((p) => p.test(path))) {
      return style;
    }
  }
  return null;
}

/**
 * SwiftUI Plugin - Exports design tokens as Swift code
 *
 * Creates Swift files with Color definitions, Font definitions,
 * and ViewModifiers for SwiftUI.
 *
 * @example
 * ```typescript
 * // design-sync.config.ts
 * import { swiftUIPlugin } from '@design-sync/swiftui-plugin';
 *
 * export default {
 *   plugins: [swiftUIPlugin({
 *     packageName: 'DesignTokens',
 *     accessLevel: 'public',
 *     supportDarkMode: true
 *   })],
 * };
 * ```
 *
 * Usage in SwiftUI:
 * ```swift
 * Text("Hello")
 *     .foregroundColor(.appPrimary)
 *     .textStyle(.heading)
 * ```
 */
export function swiftUIPlugin(config: SwiftUIPluginConfig = {}): ReturnType<typeof definePlugin> {
  const {
    outDir = "",
    packageName = "DesignTokens",
    accessLevel = "public",
    generateAssetCatalog = false,
    colorType = "SwiftUI",
    supportDarkMode = true,
    stripPrefix,
    semanticColorMapping,
    dynamicTypeMapping,
    generateEnvironmentValues = false,
    supportDynamicType = true,
  } = config;

  const stripPrefixArray = stripPrefix
    ? Array.isArray(stripPrefix)
      ? stripPrefix
      : stripPrefix.split(".")
    : [];

  return definePlugin("swiftui-plugin", (context) => {
    const { modes } = context;
    const builder = createFileBuilder(outDir);
    const access = accessLevel === "internal" ? "" : `${accessLevel} `;

    // Collect tokens
    const colors = createModeRecord<Record<string, string>>(modes, () => ({}));
    const typography = createModeRecord<Record<string, Record<string, unknown>>>(modes, () => ({}));
    const spacing = createModeRecord<Record<string, number>>(modes, () => ({}));
    const radii = createModeRecord<Record<string, number>>(modes, () => ({}));
    const shadows = createModeRecord<Record<string, ShadowStyle>>(modes, () => ({}));

    // Semantic color role mappings (role -> token name)
    const semanticColorMappings: Record<SemanticColorRole, string> = {} as Record<SemanticColorRole, string>;
    // Dynamic Type style mappings (style -> token name)
    const dynamicTypeMappings: Record<DynamicTypeStyle, string> = {} as Record<DynamicTypeStyle, string>;

    // Process all tokens
    context.query().forEach((token) => {
      const { type, path } = token;
      const pathLower = path.toLowerCase();
      const tokenName = getTokenName(path, stripPrefixArray);

      switch (type) {
        case "color":
          processColorToken(token, colors, modes.defaultMode, stripPrefixArray);
          // Detect semantic color role
          const semanticRole = findSemanticColorRole(path, tokenName, semanticColorMapping);
          if (semanticRole) {
            semanticColorMappings[semanticRole] = tokenName;
          }
          break;
        case "typography":
          processTypographyToken(token, typography, modes.defaultMode, stripPrefixArray);
          // Detect Dynamic Type style
          const dynamicStyle = findDynamicTypeStyle(path, tokenName, dynamicTypeMapping);
          if (dynamicStyle) {
            dynamicTypeMappings[dynamicStyle] = tokenName;
          }
          break;
        case "dimension":
          if (pathLower.includes("radius") || pathLower.includes("radii")) {
            processRadiusToken(token, radii, modes.defaultMode, stripPrefixArray);
          } else if (!pathLower.includes("font")) {
            processSpacingToken(token, spacing, modes.defaultMode, stripPrefixArray);
          }
          break;
        case "shadow":
          processShadowToken(token, shadows, modes.defaultMode, stripPrefixArray);
          break;
      }
    });

    // Generate Swift files
    builder.add("Colors.swift", generateColorsFile(colors, modes, access, colorType, supportDarkMode));
    builder.add(
      "Typography.swift",
      generateTypographyFile(typography[modes.defaultMode], access, supportDynamicType, dynamicTypeMappings),
    );
    builder.add("Spacing.swift", generateSpacingFile(spacing[modes.defaultMode], access));
    builder.add("Shadows.swift", generateShadowsFile(shadows[modes.defaultMode], access));
    builder.add("Theme.swift", generateThemeFile(access, packageName));

    // Generate semantic colors file if any mappings were found
    if (Object.keys(semanticColorMappings).length > 0) {
      builder.add(
        "SemanticColors.swift",
        generateSemanticColorsFile(semanticColorMappings, colors, modes, access, supportDarkMode),
      );
    }

    // Generate environment values if requested
    if (generateEnvironmentValues) {
      builder.add("EnvironmentValues.swift", generateEnvironmentValuesFile(access, packageName));
    }

    // Generate asset catalog if requested
    if (generateAssetCatalog) {
      const catalogContent = generateAssetCatalogContents(colors, modes, supportDarkMode);
      for (const [filename, content] of Object.entries(catalogContent)) {
        builder.add(`Assets.xcassets/${filename}`, content);
      }
    }

    return builder.build();
  });
}

// ============================================================================
// Types
// ============================================================================

interface ShadowStyle {
  color: string;
  radius: number;
  x: number;
  y: number;
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
      !["colors", "color", "spacing", "space", "typography", "radii", "radius", "shadows", "shadow"].includes(
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
    colors[mode][name] = cssColor;
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

    const swiftStyle: Record<string, unknown> = {};
    const cssStyle = style as Record<string, unknown>;

    if (cssStyle.fontFamily) {
      swiftStyle.fontFamily = String(cssStyle.fontFamily).split(",")[0].trim().replace(/['"]/g, "");
    }
    if (cssStyle.fontSize) {
      swiftStyle.fontSize = cssToNumber(String(cssStyle.fontSize));
    }
    if (cssStyle.fontWeight) {
      swiftStyle.fontWeight = cssToSwiftFontWeight(String(cssStyle.fontWeight));
    }
    if (cssStyle.lineHeight) {
      swiftStyle.lineHeight = cssToNumber(String(cssStyle.lineHeight));
    }
    if (cssStyle.letterSpacing) {
      swiftStyle.letterSpacing = cssToNumber(String(cssStyle.letterSpacing));
    }

    typography[mode][name] = swiftStyle;
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

function processShadowToken(
  token: ProcessedToken,
  shadows: Record<string, Record<string, ShadowStyle>>,
  defaultMode: string,
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);

  for (const mode of Object.keys(shadows)) {
    const cssValue = token.toCSS(mode);

    // Parse: offsetX offsetY blurRadius color
    const match = cssValue.match(
      /(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s*(?:(-?\d+(?:\.\d+)?(?:px)?)\s+)?(.+)/,
    );

    shadows[mode][name] = {
      color: match ? match[5].trim() : "rgba(0, 0, 0, 0.25)",
      radius: match ? cssToNumber(match[3]) : 4,
      x: match ? cssToNumber(match[1]) : 0,
      y: match ? cssToNumber(match[2]) : 2,
    };
  }
}

// ============================================================================
// Swift Conversion Helpers
// ============================================================================

function cssToNumber(value: string): number {
  const match = value.match(/^(-?\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function cssToSwiftColor(cssColor: string): string {
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
    return `0x${hex.toUpperCase()}`;
  }

  // Handle rgba
  const rgbaMatch = cssColor.match(
    /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)/,
  );
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1.0;
    return `red: ${(r / 255).toFixed(3)}, green: ${(g / 255).toFixed(3)}, blue: ${(b / 255).toFixed(3)}, opacity: ${a.toFixed(3)}`;
  }

  return "red: 0, green: 0, blue: 0, opacity: 1";
}

function cssToSwiftFontWeight(weight: string): string {
  const weightMap: Record<string, string> = {
    "100": ".ultraLight",
    "200": ".thin",
    "300": ".light",
    "400": ".regular",
    "500": ".medium",
    "600": ".semibold",
    "700": ".bold",
    "800": ".heavy",
    "900": ".black",
    thin: ".thin",
    extralight: ".ultraLight",
    light: ".light",
    normal: ".regular",
    regular: ".regular",
    medium: ".medium",
    semibold: ".semibold",
    bold: ".bold",
    extrabold: ".heavy",
    black: ".black",
  };
  return weightMap[weight.toLowerCase()] || ".regular";
}

// ============================================================================
// File Generation
// ============================================================================

function generateColorsFile(
  colors: Record<string, Record<string, string>>,
  modes: { defaultMode: string; requiredModes: readonly string[] },
  access: string,
  colorType: "SwiftUI" | "UIKit",
  supportDarkMode: boolean,
): string {
  const colorImport = colorType === "SwiftUI" ? "SwiftUI" : "UIKit";

  const lines: string[] = [
    "// Auto-generated SwiftUI colors",
    "// Do not edit manually",
    "",
    `import ${colorImport}`,
    "",
    "// MARK: - Color Extension for Hex",
    "",
    "extension Color {",
    "    init(hex: UInt, alpha: Double = 1) {",
    "        self.init(",
    "            .sRGB,",
    "            red: Double((hex >> 16) & 0xff) / 255,",
    "            green: Double((hex >> 08) & 0xff) / 255,",
    "            blue: Double((hex >> 00) & 0xff) / 255,",
    "            opacity: alpha",
    "        )",
    "    }",
    "}",
    "",
    "// MARK: - App Colors",
    "",
  ];

  // Generate color extension
  lines.push(`${access}extension Color {`);
  lines.push("");

  for (const [name, cssValue] of Object.entries(colors[modes.defaultMode])) {
    const hexMatch = cssValue.match(/^#([0-9a-fA-F]{6})$/);
    const hex = hexMatch ? hexMatch[1].toUpperCase() : "000000";

    if (supportDarkMode && colors["dark"] && colors["dark"][name]) {
      const darkHexMatch = colors["dark"][name].match(/^#([0-9a-fA-F]{6})$/);
      const darkHex = darkHexMatch ? darkHexMatch[1].toUpperCase() : hex;

      lines.push(`    ${access}static var ${name}: Color {`);
      lines.push(`        Color(light: Color(hex: 0x${hex}), dark: Color(hex: 0x${darkHex}))`);
      lines.push(`    }`);
    } else {
      lines.push(`    ${access}static let ${name} = Color(hex: 0x${hex})`);
    }
    lines.push("");
  }

  lines.push("}");
  lines.push("");

  // Add helper for dynamic colors
  if (supportDarkMode) {
    lines.push("// MARK: - Dynamic Color Helper");
    lines.push("");
    lines.push("extension Color {");
    lines.push("    init(light: Color, dark: Color) {");
    lines.push("        #if os(iOS)");
    lines.push("        self.init(UIColor { traitCollection in");
    lines.push("            traitCollection.userInterfaceStyle == .dark");
    lines.push("                ? UIColor(dark)");
    lines.push("                : UIColor(light)");
    lines.push("        })");
    lines.push("        #else");
    lines.push("        self = light");
    lines.push("        #endif");
    lines.push("    }");
    lines.push("}");
  }

  return lines.join("\n");
}

function generateTypographyFile(
  typography: Record<string, Record<string, unknown>>,
  access: string,
  supportDynamicType: boolean,
  dynamicTypeMappings: Record<DynamicTypeStyle, string>,
): string {
  const lines: string[] = [
    "// Auto-generated SwiftUI typography",
    "// Do not edit manually",
    "",
    "import SwiftUI",
    "",
  ];

  // Generate Dynamic Type scaled modifier if enabled
  if (supportDynamicType) {
    lines.push("// MARK: - Dynamic Type Scaled Text Style Modifier");
    lines.push("");
    lines.push(`${access}struct ScaledTextStyleModifier: ViewModifier {`);
    lines.push("    @ScaledMetric var scaleFactor: CGFloat = 1");
    lines.push("    let baseFontSize: CGFloat");
    lines.push("    let fontWeight: Font.Weight");
    lines.push("    let lineSpacing: CGFloat");
    lines.push("    let letterSpacing: CGFloat");
    lines.push("");
    lines.push(`    ${access}func body(content: Content) -> some View {`);
    lines.push("        content");
    lines.push("            .font(.system(size: baseFontSize * scaleFactor, weight: fontWeight))");
    lines.push("            .lineSpacing(lineSpacing * scaleFactor)");
    lines.push("            .tracking(letterSpacing)");
    lines.push("    }");
    lines.push("}");
    lines.push("");
  }

  // Generate standard modifier
  lines.push("// MARK: - Text Style Modifier");
  lines.push("");
  lines.push(`${access}struct TextStyleModifier: ViewModifier {`);
  lines.push("    let fontSize: CGFloat");
  lines.push("    let fontWeight: Font.Weight");
  lines.push("    let lineSpacing: CGFloat");
  lines.push("    let letterSpacing: CGFloat");
  lines.push("");
  lines.push(`    ${access}func body(content: Content) -> some View {`);
  lines.push("        content");
  lines.push("            .font(.system(size: fontSize, weight: fontWeight))");
  lines.push("            .lineSpacing(lineSpacing)");
  lines.push("            .tracking(letterSpacing)");
  lines.push("    }");
  lines.push("}");
  lines.push("");
  lines.push("// MARK: - Text Styles");
  lines.push("");
  lines.push(`${access}extension View {`);
  lines.push("");

  for (const [name, style] of Object.entries(typography)) {
    const fontSize = (style.fontSize as number) || 16;
    const fontWeight = (style.fontWeight as string) || ".regular";
    const lineHeight = (style.lineHeight as number) || fontSize * 1.5;
    const letterSpacing = (style.letterSpacing as number) || 0;
    const lineSpacing = lineHeight - fontSize;

    if (supportDynamicType) {
      lines.push(`    /// Applies ${name} text style with Dynamic Type scaling`);
      lines.push(`    ${access}func ${name}TextStyle(scaled: Bool = true) -> some View {`);
      lines.push(`        Group {`);
      lines.push(`            if scaled {`);
      lines.push(`                modifier(ScaledTextStyleModifier(`);
      lines.push(`                    baseFontSize: ${fontSize},`);
      lines.push(`                    fontWeight: ${fontWeight},`);
      lines.push(`                    lineSpacing: ${lineSpacing.toFixed(1)},`);
      lines.push(`                    letterSpacing: ${letterSpacing}`);
      lines.push(`                ))`);
      lines.push(`            } else {`);
      lines.push(`                modifier(TextStyleModifier(`);
      lines.push(`                    fontSize: ${fontSize},`);
      lines.push(`                    fontWeight: ${fontWeight},`);
      lines.push(`                    lineSpacing: ${lineSpacing.toFixed(1)},`);
      lines.push(`                    letterSpacing: ${letterSpacing}`);
      lines.push(`                ))`);
      lines.push(`            }`);
      lines.push(`        }`);
      lines.push(`    }`);
    } else {
      lines.push(`    ${access}func ${name}TextStyle() -> some View {`);
      lines.push(`        modifier(TextStyleModifier(`);
      lines.push(`            fontSize: ${fontSize},`);
      lines.push(`            fontWeight: ${fontWeight},`);
      lines.push(`            lineSpacing: ${lineSpacing.toFixed(1)},`);
      lines.push(`            letterSpacing: ${letterSpacing}`);
      lines.push(`        ))`);
      lines.push(`    }`);
    }
    lines.push("");
  }

  lines.push("}");
  lines.push("");

  // Generate Dynamic Type style mapping if we have any
  if (Object.keys(dynamicTypeMappings).length > 0) {
    lines.push("// MARK: - Dynamic Type Style Mapping");
    lines.push("");
    lines.push("/// Maps design tokens to Apple's Dynamic Type text styles");
    lines.push(`${access}extension Font.TextStyle {`);
    for (const [dynamicStyle, tokenName] of Object.entries(dynamicTypeMappings)) {
      const styleValue = dynamicStyle === "title1" ? ".title" :
                         dynamicStyle === "title2" ? ".title2" :
                         dynamicStyle === "title3" ? ".title3" :
                         dynamicStyle === "caption1" ? ".caption" :
                         dynamicStyle === "caption2" ? ".caption2" :
                         `.${dynamicStyle}`;
      lines.push(`    /// Maps to ${tokenName} design token`);
      lines.push(`    ${access}static var app${tokenName.charAt(0).toUpperCase() + tokenName.slice(1)}: Font.TextStyle { ${styleValue} }`);
    }
    lines.push("}");
    lines.push("");
  }

  // Also export raw values
  lines.push("// MARK: - Typography Values");
  lines.push("");
  lines.push(`${access}enum AppTypography {`);

  for (const [name, style] of Object.entries(typography)) {
    const fontSize = (style.fontSize as number) || 16;
    const fontWeight = (style.fontWeight as string) || ".regular";
    const lineHeight = (style.lineHeight as number) || fontSize * 1.5;
    const letterSpacing = (style.letterSpacing as number) || 0;

    lines.push(`    ${access}enum ${name.charAt(0).toUpperCase() + name.slice(1)} {`);
    lines.push(`        ${access}static let fontSize: CGFloat = ${fontSize}`);
    lines.push(`        ${access}static let fontWeight: Font.Weight = ${fontWeight}`);
    lines.push(`        ${access}static let lineHeight: CGFloat = ${lineHeight}`);
    lines.push(`        ${access}static let letterSpacing: CGFloat = ${letterSpacing}`);
    lines.push(`    }`);
    lines.push("");
  }

  lines.push("}");

  return lines.join("\n");
}

function generateSpacingFile(spacing: Record<string, number>, access: string): string {
  const lines: string[] = [
    "// Auto-generated SwiftUI spacing",
    "// Do not edit manually",
    "",
    "import SwiftUI",
    "",
    "// MARK: - Spacing Constants",
    "",
    `${access}enum AppSpacing {`,
    "",
  ];

  for (const [name, value] of Object.entries(spacing)) {
    lines.push(`    ${access}static let ${name}: CGFloat = ${value}`);
  }

  lines.push("}");

  return lines.join("\n");
}

function generateShadowsFile(shadows: Record<string, ShadowStyle>, access: string): string {
  const lines: string[] = [
    "// Auto-generated SwiftUI shadows",
    "// Do not edit manually",
    "",
    "import SwiftUI",
    "",
    "// MARK: - Shadow Modifier",
    "",
    `${access}struct ShadowStyleModifier: ViewModifier {`,
    "    let color: Color",
    "    let radius: CGFloat",
    "    let x: CGFloat",
    "    let y: CGFloat",
    "",
    `    ${access}func body(content: Content) -> some View {`,
    "        content.shadow(color: color, radius: radius, x: x, y: y)",
    "    }",
    "}",
    "",
    "// MARK: - Shadow Styles",
    "",
    `${access}extension View {`,
    "",
  ];

  for (const [name, style] of Object.entries(shadows)) {
    // Convert CSS color to Swift color
    const colorValue = cssToSwiftColor(style.color);

    lines.push(`    ${access}func ${name}Shadow() -> some View {`);
    lines.push(`        modifier(ShadowStyleModifier(`);
    lines.push(`            color: Color(${colorValue}),`);
    lines.push(`            radius: ${style.radius},`);
    lines.push(`            x: ${style.x},`);
    lines.push(`            y: ${style.y}`);
    lines.push(`        ))`);
    lines.push(`    }`);
    lines.push("");
  }

  lines.push("}");

  return lines.join("\n");
}

function generateThemeFile(access: string, packageName: string): string {
  return [
    "// Auto-generated SwiftUI theme",
    "// Do not edit manually",
    "",
    "import SwiftUI",
    "",
    "// MARK: - Theme",
    "",
    `/// ${packageName} design system theme`,
    `${access}enum Theme {`,
    "    /// Color palette",
    `    ${access}typealias Colors = Color`,
    "",
    "    /// Typography styles",
    `    ${access}typealias Typography = AppTypography`,
    "",
    "    /// Spacing constants",
    `    ${access}typealias Spacing = AppSpacing`,
    "}",
  ].join("\n");
}

function generateAssetCatalogContents(
  colors: Record<string, Record<string, string>>,
  modes: { defaultMode: string; requiredModes: readonly string[] },
  supportDarkMode: boolean,
): Record<string, string> {
  const files: Record<string, string> = {};

  // Root Contents.json
  files["Contents.json"] = JSON.stringify(
    {
      info: {
        author: "design-sync",
        version: 1,
      },
    },
    null,
    2,
  );

  // Generate color sets
  for (const [name, cssValue] of Object.entries(colors[modes.defaultMode])) {
    const colorSetPath = `Colors/${name}.colorset`;

    const appearances: unknown[] = [];

    // Light mode color
    const lightHex = cssValue.match(/^#([0-9a-fA-F]{6})$/)?.[1] || "000000";
    const lightRgb = hexToRgb(lightHex);

    appearances.push({
      color: {
        "color-space": "srgb",
        components: {
          red: `0x${lightHex.substring(0, 2)}`,
          green: `0x${lightHex.substring(2, 4)}`,
          blue: `0x${lightHex.substring(4, 6)}`,
          alpha: "1.000",
        },
      },
      idiom: "universal",
    });

    // Dark mode color
    if (supportDarkMode && colors["dark"] && colors["dark"][name]) {
      const darkHex = colors["dark"][name].match(/^#([0-9a-fA-F]{6})$/)?.[1] || lightHex;

      appearances.push({
        appearances: [
          {
            appearance: "luminosity",
            value: "dark",
          },
        ],
        color: {
          "color-space": "srgb",
          components: {
            red: `0x${darkHex.substring(0, 2)}`,
            green: `0x${darkHex.substring(2, 4)}`,
            blue: `0x${darkHex.substring(4, 6)}`,
            alpha: "1.000",
          },
        },
        idiom: "universal",
      });
    }

    files[`${colorSetPath}/Contents.json`] = JSON.stringify(
      {
        colors: appearances,
        info: {
          author: "design-sync",
          version: 1,
        },
      },
      null,
      2,
    );
  }

  return files;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

/**
 * Generate semantic colors file mapping design tokens to iOS semantic roles
 */
function generateSemanticColorsFile(
  semanticMappings: Record<SemanticColorRole, string>,
  colors: Record<string, Record<string, string>>,
  modes: { defaultMode: string; requiredModes: readonly string[] },
  access: string,
  supportDarkMode: boolean,
): string {
  const lines: string[] = [
    "// Auto-generated SwiftUI semantic colors",
    "// Do not edit manually",
    "",
    "import SwiftUI",
    "",
    "// MARK: - Semantic Colors",
    "",
    "/// Maps design tokens to iOS semantic color roles",
    `${access}extension Color {`,
    "",
  ];

  // Group roles by category for better organization
  const labelRoles: SemanticColorRole[] = ["label", "secondaryLabel", "tertiaryLabel", "quaternaryLabel"];
  const backgroundRoles: SemanticColorRole[] = [
    "systemBackground",
    "secondarySystemBackground",
    "tertiarySystemBackground",
    "systemGroupedBackground",
    "secondarySystemGroupedBackground",
    "tertiarySystemGroupedBackground",
  ];
  const fillRoles: SemanticColorRole[] = ["systemFill", "secondarySystemFill", "tertiarySystemFill", "quaternarySystemFill"];
  const otherRoles: SemanticColorRole[] = ["separator", "opaqueSeparator", "link", "tintColor", "accentColor"];

  const generateColorAccessor = (role: SemanticColorRole, tokenName: string) => {
    const lightValue = colors[modes.defaultMode]?.[tokenName];
    if (!lightValue) return;

    const hexMatch = lightValue.match(/^#([0-9a-fA-F]{6})$/);
    const lightHex = hexMatch ? hexMatch[1].toUpperCase() : "000000";

    if (supportDarkMode && colors["dark"]?.[tokenName]) {
      const darkHexMatch = colors["dark"][tokenName].match(/^#([0-9a-fA-F]{6})$/);
      const darkHex = darkHexMatch ? darkHexMatch[1].toUpperCase() : lightHex;

      lines.push(`    /// Maps to ${tokenName} token (semantic: ${role})`);
      lines.push(`    ${access}static var semantic${role.charAt(0).toUpperCase() + role.slice(1)}: Color {`);
      lines.push(`        Color(light: Color(hex: 0x${lightHex}), dark: Color(hex: 0x${darkHex}))`);
      lines.push(`    }`);
    } else {
      lines.push(`    /// Maps to ${tokenName} token (semantic: ${role})`);
      lines.push(`    ${access}static let semantic${role.charAt(0).toUpperCase() + role.slice(1)} = Color(hex: 0x${lightHex})`);
    }
    lines.push("");
  };

  // Generate label colors
  lines.push("    // MARK: Label Colors");
  lines.push("");
  for (const role of labelRoles) {
    if (semanticMappings[role]) {
      generateColorAccessor(role, semanticMappings[role]);
    }
  }

  // Generate background colors
  lines.push("    // MARK: Background Colors");
  lines.push("");
  for (const role of backgroundRoles) {
    if (semanticMappings[role]) {
      generateColorAccessor(role, semanticMappings[role]);
    }
  }

  // Generate fill colors
  lines.push("    // MARK: Fill Colors");
  lines.push("");
  for (const role of fillRoles) {
    if (semanticMappings[role]) {
      generateColorAccessor(role, semanticMappings[role]);
    }
  }

  // Generate other colors
  lines.push("    // MARK: Other Colors");
  lines.push("");
  for (const role of otherRoles) {
    if (semanticMappings[role]) {
      generateColorAccessor(role, semanticMappings[role]);
    }
  }

  lines.push("}");
  lines.push("");

  // Generate a convenient SemanticColors enum
  lines.push("// MARK: - Semantic Color Aliases");
  lines.push("");
  lines.push(`${access}enum SemanticColors {`);

  for (const [role, tokenName] of Object.entries(semanticMappings)) {
    const propName = `semantic${role.charAt(0).toUpperCase() + role.slice(1)}`;
    lines.push(`    ${access}static var ${role}: Color { .${propName} }`);
  }

  lines.push("}");

  return lines.join("\n");
}

/**
 * Generate EnvironmentValues extension for custom theme properties
 */
function generateEnvironmentValuesFile(access: string, packageName: string): string {
  const lines: string[] = [
    "// Auto-generated SwiftUI EnvironmentValues",
    "// Do not edit manually",
    "",
    "import SwiftUI",
    "",
    "// MARK: - Theme Environment Keys",
    "",
    "private struct ThemeColorsKey: EnvironmentKey {",
    "    static let defaultValue = ThemeColors()",
    "}",
    "",
    "private struct ThemeTypographyKey: EnvironmentKey {",
    "    static let defaultValue = ThemeTypography()",
    "}",
    "",
    "private struct ThemeSpacingKey: EnvironmentKey {",
    "    static let defaultValue = ThemeSpacing()",
    "}",
    "",
    "// MARK: - Theme Container Types",
    "",
    `${access}struct ThemeColors {`,
    "    // Access design token colors through this container",
    "    // Example: @Environment(\\.themeColors) var colors",
    "}",
    "",
    `${access}struct ThemeTypography {`,
    "    // Access design token typography through this container",
    "    // Example: @Environment(\\.themeTypography) var typography",
    "}",
    "",
    `${access}struct ThemeSpacing {`,
    "    // Access design token spacing through this container",
    "    // Example: @Environment(\\.themeSpacing) var spacing",
    "}",
    "",
    "// MARK: - EnvironmentValues Extension",
    "",
    `${access}extension EnvironmentValues {`,
    "    /// Access theme colors through environment",
    "    var themeColors: ThemeColors {",
    "        get { self[ThemeColorsKey.self] }",
    "        set { self[ThemeColorsKey.self] = newValue }",
    "    }",
    "",
    "    /// Access theme typography through environment",
    "    var themeTypography: ThemeTypography {",
    "        get { self[ThemeTypographyKey.self] }",
    "        set { self[ThemeTypographyKey.self] = newValue }",
    "    }",
    "",
    "    /// Access theme spacing through environment",
    "    var themeSpacing: ThemeSpacing {",
    "        get { self[ThemeSpacingKey.self] }",
    "        set { self[ThemeSpacingKey.self] = newValue }",
    "    }",
    "}",
    "",
    "// MARK: - View Extension",
    "",
    `${access}extension View {`,
    `    /// Apply ${packageName} theme to this view hierarchy`,
    "    func applyTheme() -> some View {",
    "        self",
    "            .environment(\\.themeColors, ThemeColors())",
    "            .environment(\\.themeTypography, ThemeTypography())",
    "            .environment(\\.themeSpacing, ThemeSpacing())",
    "    }",
    "}",
    "",
    "// MARK: - Preview Helpers",
    "",
    "#if DEBUG",
    `${access}extension PreviewProvider {`,
    `    static var themed: some View {`,
    "        EmptyView()",
    "            .applyTheme()",
    "    }",
    "}",
    "#endif",
  ];

  return lines.join("\n");
}
