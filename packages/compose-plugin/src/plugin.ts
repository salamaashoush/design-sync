import {
  createFileBuilder,
  createModeRecord,
  definePlugin,
  getModesToIterate,
  stripTokenPrefix,
} from "@design-sync/manager";
import { pascalCase } from "@design-sync/utils";
import { type ProcessedToken, isTokenAlias, typographyToCssStyle } from "@design-sync/w3c-dtfm";

export interface ComposePluginConfig {
  /** Output directory for generated files (relative to main out dir) */
  outDir?: string;
  /** Kotlin package name */
  packageName?: string;
  /**
   * Use Material 3 theming
   * @default true
   */
  material3?: boolean;
  /**
   * Generate MaterialTheme composable
   * @default true
   */
  generateTheme?: boolean;
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
   * Map semantic color token names to Material 3 color scheme roles
   * Keys are M3 role names, values are token name patterns to match
   * @example { primary: 'brand.primary', surface: 'background.surface' }
   */
  colorSchemeMapping?: Partial<Record<M3ColorRole, string>>;
  /**
   * Map typography token names to Material 3 typography roles
   * @example { displayLarge: 'display.xl', bodyMedium: 'body.md' }
   */
  typographyMapping?: Partial<Record<M3TypographyRole, string>>;
  /**
   * Support Android 12+ Dynamic Colors (Material You)
   * @default false
   */
  dynamicColors?: boolean;
}

/**
 * Material 3 Color Scheme roles
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
  | "scrim";

/**
 * Material 3 Typography roles
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

/**
 * Jetpack Compose Plugin - Exports design tokens as Kotlin code
 *
 * Creates Kotlin files with Color definitions, TextStyle definitions,
 * and MaterialTheme composable for Jetpack Compose.
 *
 * @example
 * ```typescript
 * // design-sync.config.ts
 * import { composePlugin } from '@design-sync/compose-plugin';
 *
 * export default {
 *   plugins: [composePlugin({
 *     packageName: 'com.example.app.theme',
 *     material3: true,
 *     generateTheme: true
 *   })],
 * };
 * ```
 *
 * Usage in Compose:
 * ```kotlin
 * @Composable
 * fun App() {
 *     AppTheme(darkTheme = isSystemInDarkTheme()) {
 *         // Your app content
 *     }
 * }
 * ```
 */
export function composePlugin(config: ComposePluginConfig = {}): ReturnType<typeof definePlugin> {
  const {
    outDir = "",
    packageName = "com.example.theme",
    material3 = true,
    generateTheme = true,
    supportDarkMode = true,
    stripPrefix,
    colorSchemeMapping,
    typographyMapping,
    dynamicColors = false,
  } = config;

  const stripPrefixArray = stripPrefix
    ? Array.isArray(stripPrefix)
      ? stripPrefix
      : stripPrefix.split(".")
    : [];

  return definePlugin("compose-plugin", (context) => {
    const { modes } = context;
    const builder = createFileBuilder(outDir);

    // Collect tokens with original paths for mapping
    const colors = createModeRecord<Record<string, string>>(modes, () => ({}));
    const colorPaths = createModeRecord<Record<string, string>>(modes, () => ({})); // name -> original path
    const typography = createModeRecord<Record<string, Record<string, unknown>>>(modes, () => ({}));
    const typographyPaths = createModeRecord<Record<string, string>>(modes, () => ({}));
    const spacing = createModeRecord<Record<string, number>>(modes, () => ({}));
    const radii = createModeRecord<Record<string, number>>(modes, () => ({}));

    // Process all tokens
    context.query().forEach((token) => {
      const { type, path } = token;
      const pathLower = path.toLowerCase();

      switch (type) {
        case "color":
          processColorToken(token, colors, colorPaths, modes.defaultMode, stripPrefixArray);
          break;
        case "typography":
          processTypographyToken(
            token,
            typography,
            typographyPaths,
            modes.defaultMode,
            stripPrefixArray,
          );
          break;
        case "dimension":
          if (pathLower.includes("radius") || pathLower.includes("radii")) {
            processRadiusToken(token, radii, modes.defaultMode, stripPrefixArray);
          } else if (!pathLower.includes("font")) {
            processSpacingToken(token, spacing, modes.defaultMode, stripPrefixArray);
          }
          break;
      }
    });

    // Build color scheme mapping (auto-detect or use provided)
    const resolvedColorMapping = resolveColorSchemeMapping(
      colors[modes.defaultMode],
      colorPaths[modes.defaultMode],
      colorSchemeMapping,
    );

    // Build typography mapping (auto-detect or use provided)
    const resolvedTypographyMapping = resolveTypographyMapping(
      typography[modes.defaultMode],
      typographyPaths[modes.defaultMode],
      typographyMapping,
    );

    // Generate Kotlin files
    builder.add("Color.kt", generateColorFile(colors, modes, packageName, supportDarkMode));
    builder.add(
      "Typography.kt",
      generateTypographyFile(
        typography[modes.defaultMode],
        packageName,
        material3,
        resolvedTypographyMapping,
      ),
    );
    builder.add("Spacing.kt", generateSpacingFile(spacing[modes.defaultMode], packageName));
    builder.add("Shape.kt", generateShapeFile(radii[modes.defaultMode], packageName));

    if (generateTheme) {
      builder.add(
        "Theme.kt",
        generateThemeFile(
          packageName,
          material3,
          supportDarkMode,
          dynamicColors,
          resolvedColorMapping,
        ),
      );
    }

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
      !["colors", "color", "spacing", "space", "typography", "radii", "radius", "shapes"].includes(
        p.toLowerCase(),
      ),
  );
  return pascalCase(filtered.join("-"));
}

function processColorToken(
  token: ProcessedToken,
  colors: Record<string, Record<string, string>>,
  colorPaths: Record<string, Record<string, string>>,
  defaultMode: string,
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);
  for (const mode of Object.keys(colors)) {
    const cssColor = token.toCSS(mode);
    colors[mode][name] = cssToKotlinColor(cssColor);
    colorPaths[mode][name] = token.path; // Store original path for mapping
  }
}

function processTypographyToken(
  token: ProcessedToken,
  typography: Record<string, Record<string, Record<string, unknown>>>,
  typographyPaths: Record<string, Record<string, string>>,
  defaultMode: string,
  stripPrefixArray: string[] = [],
) {
  const name = getTokenName(token.path, stripPrefixArray);
  typographyPaths[defaultMode] = typographyPaths[defaultMode] || {};
  typographyPaths[defaultMode][name] = token.path; // Store original path

  for (const mode of Object.keys(typography)) {
    const value = token.getValue(mode);
    const style = typographyToCssStyle(value);

    if (isTokenAlias(style) || typeof style !== "object") continue;

    const kotlinStyle: Record<string, unknown> = {};
    const cssStyle = style as Record<string, unknown>;

    if (cssStyle.fontFamily) {
      kotlinStyle.fontFamily = String(cssStyle.fontFamily)
        .split(",")[0]
        .trim()
        .replace(/['"]/g, "");
    }
    if (cssStyle.fontSize) {
      kotlinStyle.fontSize = cssToNumber(String(cssStyle.fontSize));
    }
    if (cssStyle.fontWeight) {
      kotlinStyle.fontWeight = cssToKotlinFontWeight(String(cssStyle.fontWeight));
    }
    if (cssStyle.lineHeight) {
      kotlinStyle.lineHeight = cssToNumber(String(cssStyle.lineHeight));
    }
    if (cssStyle.letterSpacing) {
      kotlinStyle.letterSpacing = cssToNumber(String(cssStyle.letterSpacing));
    }

    typography[mode][name] = kotlinStyle;
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

// ============================================================================
// M3 Mapping Resolution
// ============================================================================

/**
 * Auto-detect patterns for M3 color roles based on common naming conventions
 */
const COLOR_ROLE_PATTERNS: Record<M3ColorRole, RegExp[]> = {
  primary: [/primary$/i, /brand\.primary/i, /color\.primary/i],
  onPrimary: [/onprimary$/i, /on-primary$/i, /primary\.on/i, /text\.on.*primary/i],
  primaryContainer: [/primarycontainer$/i, /primary\.container/i],
  onPrimaryContainer: [/onprimarycontainer$/i, /primary\.container\.on/i],
  secondary: [/secondary$/i, /brand\.secondary/i, /color\.secondary/i],
  onSecondary: [/onsecondary$/i, /on-secondary$/i, /secondary\.on/i],
  secondaryContainer: [/secondarycontainer$/i, /secondary\.container/i],
  onSecondaryContainer: [/onsecondarycontainer$/i],
  tertiary: [/tertiary$/i, /brand\.tertiary/i, /accent/i],
  onTertiary: [/ontertiary$/i, /on-tertiary$/i],
  tertiaryContainer: [/tertiarycontainer$/i],
  onTertiaryContainer: [/ontertiarycontainer$/i],
  error: [/error$/i, /danger$/i, /destructive$/i],
  onError: [/onerror$/i, /on-error$/i, /error\.on/i],
  errorContainer: [/errorcontainer$/i, /error\.container/i],
  onErrorContainer: [/onerrorcontainer$/i],
  background: [/background$/i, /bg$/i, /surface\.background/i],
  onBackground: [/onbackground$/i, /on-background$/i, /text\.default/i],
  surface: [/surface$/i, /card$/i, /layer/i],
  onSurface: [/onsurface$/i, /on-surface$/i, /text\.primary/i],
  surfaceVariant: [/surfacevariant$/i, /surface\.variant/i],
  onSurfaceVariant: [/onsurfacevariant$/i, /text\.secondary/i],
  outline: [/outline$/i, /border$/i, /divider/i],
  outlineVariant: [/outlinevariant$/i, /border\.subtle/i],
  inverseSurface: [/inversesurface$/i, /inverse\.surface/i],
  inverseOnSurface: [/inverseonsurface$/i],
  inversePrimary: [/inverseprimary$/i],
  scrim: [/scrim$/i, /overlay$/i, /backdrop/i],
};

/**
 * Auto-detect patterns for M3 typography roles
 */
const TYPOGRAPHY_ROLE_PATTERNS: Record<M3TypographyRole, RegExp[]> = {
  displayLarge: [/display.*large/i, /display.*xl/i, /hero/i],
  displayMedium: [/display.*medium/i, /display.*md/i],
  displaySmall: [/display.*small/i, /display.*sm/i],
  headlineLarge: [/headline.*large/i, /heading.*xl/i, /h1/i],
  headlineMedium: [/headline.*medium/i, /heading.*lg/i, /h2/i],
  headlineSmall: [/headline.*small/i, /heading.*md/i, /h3/i],
  titleLarge: [/title.*large/i, /title.*xl/i, /h4/i],
  titleMedium: [/title.*medium/i, /title.*md/i, /h5/i],
  titleSmall: [/title.*small/i, /title.*sm/i, /h6/i],
  bodyLarge: [/body.*large/i, /body.*lg/i, /paragraph.*large/i],
  bodyMedium: [/body.*medium/i, /body.*md/i, /paragraph/i, /body$/i],
  bodySmall: [/body.*small/i, /body.*sm/i, /caption/i],
  labelLarge: [/label.*large/i, /button/i],
  labelMedium: [/label.*medium/i, /label$/i],
  labelSmall: [/label.*small/i, /overline/i],
};

/**
 * Resolve color scheme mapping by matching token names to M3 roles
 */
function resolveColorSchemeMapping(
  colors: Record<string, string>,
  colorPaths: Record<string, string>,
  providedMapping?: Partial<Record<M3ColorRole, string>>,
): Record<M3ColorRole, string | null> {
  const result: Record<M3ColorRole, string | null> = {} as Record<M3ColorRole, string | null>;

  for (const role of Object.keys(COLOR_ROLE_PATTERNS) as M3ColorRole[]) {
    // Use provided mapping if available
    if (providedMapping?.[role]) {
      const pattern = providedMapping[role];
      const matchedName = Object.entries(colorPaths).find(([, path]) =>
        path.toLowerCase().includes(pattern.toLowerCase()),
      )?.[0];
      result[role] = matchedName || null;
      continue;
    }

    // Auto-detect based on patterns
    const patterns = COLOR_ROLE_PATTERNS[role];
    let matched: string | null = null;

    for (const [name, path] of Object.entries(colorPaths)) {
      for (const pattern of patterns) {
        if (pattern.test(path) || pattern.test(name)) {
          matched = name;
          break;
        }
      }
      if (matched) break;
    }

    result[role] = matched;
  }

  return result;
}

/**
 * Resolve typography mapping by matching token names to M3 roles
 */
function resolveTypographyMapping(
  typography: Record<string, Record<string, unknown>>,
  typographyPaths: Record<string, string>,
  providedMapping?: Partial<Record<M3TypographyRole, string>>,
): Record<M3TypographyRole, string | null> {
  const result: Record<M3TypographyRole, string | null> = {} as Record<
    M3TypographyRole,
    string | null
  >;

  for (const role of Object.keys(TYPOGRAPHY_ROLE_PATTERNS) as M3TypographyRole[]) {
    // Use provided mapping if available
    if (providedMapping?.[role]) {
      const pattern = providedMapping[role];
      const matchedName = Object.entries(typographyPaths).find(([, path]) =>
        path.toLowerCase().includes(pattern.toLowerCase()),
      )?.[0];
      result[role] = matchedName || null;
      continue;
    }

    // Auto-detect based on patterns
    const patterns = TYPOGRAPHY_ROLE_PATTERNS[role];
    let matched: string | null = null;

    for (const [name, path] of Object.entries(typographyPaths)) {
      for (const pattern of patterns) {
        if (pattern.test(path) || pattern.test(name)) {
          matched = name;
          break;
        }
      }
      if (matched) break;
    }

    result[role] = matched;
  }

  return result;
}

// ============================================================================
// Kotlin Conversion Helpers
// ============================================================================

function cssToNumber(value: string): number {
  const match = value.match(/^(-?\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function cssToKotlinColor(cssColor: string): string {
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
      hex = "FF" + hex;
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

  return "0xFF000000";
}

function cssToKotlinFontWeight(weight: string): string {
  const weightMap: Record<string, string> = {
    "100": "FontWeight.Thin",
    "200": "FontWeight.ExtraLight",
    "300": "FontWeight.Light",
    "400": "FontWeight.Normal",
    "500": "FontWeight.Medium",
    "600": "FontWeight.SemiBold",
    "700": "FontWeight.Bold",
    "800": "FontWeight.ExtraBold",
    "900": "FontWeight.Black",
    thin: "FontWeight.Thin",
    extralight: "FontWeight.ExtraLight",
    light: "FontWeight.Light",
    normal: "FontWeight.Normal",
    regular: "FontWeight.Normal",
    medium: "FontWeight.Medium",
    semibold: "FontWeight.SemiBold",
    bold: "FontWeight.Bold",
    extrabold: "FontWeight.ExtraBold",
    black: "FontWeight.Black",
  };
  return weightMap[weight.toLowerCase()] || "FontWeight.Normal";
}

// ============================================================================
// File Generation
// ============================================================================

function generateColorFile(
  colors: Record<string, Record<string, string>>,
  modes: { defaultMode: string; requiredModes: readonly string[] },
  packageName: string,
  _supportDarkMode: boolean,
): string {
  const lines: string[] = [
    `package ${packageName}`,
    "",
    "import androidx.compose.ui.graphics.Color",
    "",
  ];

  // Generate color objects for each mode
  for (const mode of getModesToIterate(modes as any)) {
    const objectName = mode === modes.defaultMode ? "LightColors" : `${pascalCase(mode)}Colors`;

    lines.push(`/**`);
    lines.push(` * ${mode === modes.defaultMode ? "Light" : pascalCase(mode)} color palette`);
    lines.push(` */`);
    lines.push(`object ${objectName} {`);

    for (const [name, value] of Object.entries(colors[mode])) {
      lines.push(`    val ${name} = Color(${value})`);
    }

    lines.push("}");
    lines.push("");
  }

  return lines.join("\n");
}

function generateTypographyFile(
  typography: Record<string, Record<string, unknown>>,
  packageName: string,
  material3: boolean,
  typographyMapping: Record<M3TypographyRole, string | null>,
): string {
  const lines: string[] = [
    `package ${packageName}`,
    "",
    "import androidx.compose.material3.Typography",
    "import androidx.compose.ui.text.TextStyle",
    "import androidx.compose.ui.text.font.FontFamily",
    "import androidx.compose.ui.text.font.FontWeight",
    "import androidx.compose.ui.unit.sp",
    "",
    "/**",
    " * Typography styles",
    " */",
    "object AppTypography {",
    "",
  ];

  // Generate individual text styles
  for (const [name, style] of Object.entries(typography)) {
    const props: string[] = [];

    if (style.fontFamily) {
      props.push("fontFamily = FontFamily.Default");
    }
    if (style.fontSize !== undefined) {
      props.push(`fontSize = ${style.fontSize}.sp`);
    }
    if (style.fontWeight) {
      props.push(`fontWeight = ${style.fontWeight}`);
    }
    if (style.lineHeight !== undefined) {
      props.push(`lineHeight = ${style.lineHeight}.sp`);
    }
    if (style.letterSpacing !== undefined) {
      props.push(`letterSpacing = ${style.letterSpacing}.sp`);
    }

    lines.push(`    val ${name} = TextStyle(`);
    lines.push(`        ${props.join(",\n        ")}`);
    lines.push(`    )`);
    lines.push("");
  }

  // Generate Material 3 Typography instance if mappings exist
  const hasMappings = Object.values(typographyMapping).some((v) => v !== null);
  if (hasMappings && material3) {
    lines.push("    /**");
    lines.push("     * Material 3 Typography configuration");
    lines.push("     */");
    lines.push("    val typography = Typography(");

    const m3Roles: M3TypographyRole[] = [
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

    const mappedRoles = m3Roles
      .filter((role) => typographyMapping[role])
      .map((role) => `        ${role} = ${typographyMapping[role]}`);

    if (mappedRoles.length > 0) {
      lines.push(mappedRoles.join(",\n"));
    }

    lines.push("    )");
  }

  lines.push("}");

  return lines.join("\n");
}

function generateSpacingFile(spacing: Record<string, number>, packageName: string): string {
  const lines: string[] = [
    `package ${packageName}`,
    "",
    "import androidx.compose.ui.unit.Dp",
    "import androidx.compose.ui.unit.dp",
    "",
    "/**",
    " * Spacing constants",
    " */",
    "object AppSpacing {",
    "",
  ];

  for (const [name, value] of Object.entries(spacing)) {
    lines.push(`    val ${name}: Dp = ${value}.dp`);
  }

  lines.push("}");

  return lines.join("\n");
}

function generateShapeFile(radii: Record<string, number>, packageName: string): string {
  const lines: string[] = [
    `package ${packageName}`,
    "",
    "import androidx.compose.foundation.shape.RoundedCornerShape",
    "import androidx.compose.material3.Shapes",
    "import androidx.compose.ui.unit.dp",
    "",
    "/**",
    " * Shape definitions",
    " */",
    "object AppShapes {",
    "",
  ];

  for (const [name, value] of Object.entries(radii)) {
    lines.push(`    val ${name} = RoundedCornerShape(${value}.dp)`);
  }

  lines.push("");
  lines.push("    val shapes = Shapes(");

  // Map to Material 3 shape names if possible
  const shapeMapping: string[] = [];
  if (radii["small"] !== undefined || radii["sm"] !== undefined) {
    const smallRadius = radii["small"] ?? radii["sm"];
    shapeMapping.push(`        small = RoundedCornerShape(${smallRadius}.dp)`);
  }
  if (radii["medium"] !== undefined || radii["md"] !== undefined) {
    const mediumRadius = radii["medium"] ?? radii["md"];
    shapeMapping.push(`        medium = RoundedCornerShape(${mediumRadius}.dp)`);
  }
  if (radii["large"] !== undefined || radii["lg"] !== undefined) {
    const largeRadius = radii["large"] ?? radii["lg"];
    shapeMapping.push(`        large = RoundedCornerShape(${largeRadius}.dp)`);
  }

  if (shapeMapping.length > 0) {
    lines.push(shapeMapping.join(",\n"));
  }

  lines.push("    )");
  lines.push("}");

  return lines.join("\n");
}

function generateThemeFile(
  packageName: string,
  material3: boolean,
  supportDarkMode: boolean,
  dynamicColors: boolean,
  colorMapping: Record<M3ColorRole, string | null>,
): string {
  const lines: string[] = [
    `package ${packageName}`,
    "",
    "import android.os.Build",
    "import androidx.compose.foundation.isSystemInDarkTheme",
    "import androidx.compose.material3.darkColorScheme",
    "import androidx.compose.material3.lightColorScheme",
    "import androidx.compose.material3.MaterialTheme",
    "import androidx.compose.runtime.Composable",
  ];

  // Add dynamic color imports if enabled
  if (dynamicColors) {
    lines.push("import androidx.compose.material3.dynamicDarkColorScheme");
    lines.push("import androidx.compose.material3.dynamicLightColorScheme");
    lines.push("import androidx.compose.ui.platform.LocalContext");
  }

  lines.push("");

  // Helper to get color reference
  const getColorRef = (role: M3ColorRole, colorSource: string): string | null => {
    const tokenName = colorMapping[role];
    if (tokenName) {
      return `${colorSource}.${tokenName}`;
    }
    return null;
  };

  // Build color scheme assignments only for mapped colors
  const buildColorSchemeAssignments = (colorSource: string): string[] => {
    const assignments: string[] = [];
    const roles: M3ColorRole[] = [
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
      "scrim",
    ];

    for (const role of roles) {
      const ref = getColorRef(role, colorSource);
      if (ref) {
        assignments.push(`    ${role} = ${ref}`);
      }
    }

    return assignments;
  };

  // Light color scheme
  const lightAssignments = buildColorSchemeAssignments("LightColors");
  lines.push("private val LightColorScheme = lightColorScheme(");
  if (lightAssignments.length > 0) {
    lines.push(lightAssignments.join(",\n"));
  }
  lines.push(")");
  lines.push("");

  // Dark color scheme
  if (supportDarkMode) {
    const darkAssignments = buildColorSchemeAssignments("DarkColors");
    lines.push("private val DarkColorScheme = darkColorScheme(");
    if (darkAssignments.length > 0) {
      lines.push(darkAssignments.join(",\n"));
    }
    lines.push(")");
    lines.push("");
  }

  // Theme composable
  lines.push("/**");
  lines.push(" * App theme composable");
  if (dynamicColors) {
    lines.push(" *");
    lines.push(" * @param dynamicColor Enable Android 12+ dynamic colors (Material You)");
  }
  lines.push(" */");
  lines.push("@Composable");
  lines.push("fun AppTheme(");
  lines.push("    darkTheme: Boolean = isSystemInDarkTheme(),");
  if (dynamicColors) {
    lines.push("    dynamicColor: Boolean = true,");
  }
  lines.push("    content: @Composable () -> Unit");
  lines.push(") {");

  if (dynamicColors) {
    lines.push("    val colorScheme = when {");
    lines.push("        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {");
    lines.push("            val context = LocalContext.current");
    lines.push(
      "            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)",
    );
    lines.push("        }");
    if (supportDarkMode) {
      lines.push("        darkTheme -> DarkColorScheme");
    }
    lines.push("        else -> LightColorScheme");
    lines.push("    }");
  } else if (supportDarkMode) {
    lines.push("    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme");
  } else {
    lines.push("    val colorScheme = LightColorScheme");
  }

  lines.push("");
  lines.push("    MaterialTheme(");
  lines.push("        colorScheme = colorScheme,");
  lines.push("        typography = AppTypography.typography,");
  lines.push("        shapes = AppShapes.shapes,");
  lines.push("        content = content");
  lines.push("    )");
  lines.push("}");

  return lines.join("\n");
}
