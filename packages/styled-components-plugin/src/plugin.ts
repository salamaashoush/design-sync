import {
  buildNestedObject,
  createModeRecord,
  definePlugin,
  getModesToIterate,
  stripTokenPrefix,
  type PluginOutputFile,
} from "@design-sync/manager";
import { camelCase, deepMerge, set } from "@design-sync/utils";
import {
  isTokenAlias,
  pathToCssVarName,
  pathToStyleName,
  processCssVarRef,
  processPrimitiveValue,
  serializeObject,
  serializeObjectToCSS,
  typographyToCssStyle,
  type ProcessedToken,
  type ProcessorModes,
} from "@design-sync/w3c-dtfm";
import { join } from "node:path";

export interface StyledComponentsPluginConfig {
  /** Output directory for generated files (relative to main out dir) */
  outDir?: string;
  /** Use CSS variables for theming instead of JS objects */
  useCssVars?: boolean;
  /** Generate TypeScript files */
  useTs?: boolean;
  /**
   * Generate TypeScript theme type declaration (styled.d.ts)
   * Works with styled-components' DefaultTheme augmentation
   * @default false
   */
  generateTypes?: boolean;
  /**
   * Generate media query helpers based on breakpoints
   * Maps breakpoint names to media query strings
   * @example { sm: "(min-width: 640px)", md: "(min-width: 768px)" }
   */
  breakpoints?: Record<string, string>;
  /**
   * Generate global styles with CSS reset/normalize
   * @default false
   */
  generateGlobalStyles?: boolean | GlobalStylesConfig;
  /**
   * Prefix for CSS custom property names (when useCssVars is true)
   */
  prefix?: string;

  // NEW ERGONOMIC OPTIONS

  /**
   * Theme structure generation mode
   * - 'nested': Generates nested theme objects { colors: { primary: "#667eea" } }
   * - 'flat': Generates flat CSS variable objects (legacy behavior)
   * - 'hybrid': Generates both nested objects and CSS variable references
   * @default 'flat'
   */
  themeStructure?: "nested" | "flat" | "hybrid";

  /**
   * Generate ThemeProvider wrapper component
   * @default false
   */
  generateProvider?: boolean;

  /**
   * Group tokens by category (colors, spacing, typography, etc.)
   * @default true when themeStructure is 'nested'
   */
  categorizeTokens?: boolean;

  /**
   * Strip design system prefix from token paths
   * @example ['kda', 'foundation'] removes "kda.foundation." from paths
   */
  stripPrefix?: string | string[];
}

export interface GlobalStylesConfig {
  /** Include CSS reset styles */
  reset?: boolean;
  /** Include CSS custom properties for all tokens */
  includeTokens?: boolean;
  /** Custom CSS to inject */
  customCSS?: string;
}

// Token category types for organized theme structure
type TokenCategory =
  | "colors"
  | "spacing"
  | "fontSize"
  | "fontWeight"
  | "fontFamily"
  | "lineHeight"
  | "letterSpacing"
  | "borderRadius"
  | "borderWidth"
  | "shadows"
  | "durations"
  | "easings"
  | "zIndex"
  | "opacity";

/**
 * Styled Components Plugin - Exports design tokens for styled-components
 *
 * Creates:
 * - {mode}.{ts,js} - Theme values for each mode
 * - styles.{ts,js} - Typography styles using css helper
 * - styled.d.ts - TypeScript theme type declarations (optional)
 * - ThemeProvider.{tsx,jsx} - Theme provider wrapper (optional)
 *
 * @example
 * ```typescript
 * // design-sync.config.ts
 * import { styledComponentsPlugin } from '@design-sync/styled-components-plugin';
 *
 * export default {
 *   plugins: [styledComponentsPlugin({
 *     themeStructure: 'nested',
 *     categorizeTokens: true,
 *     generateProvider: true,
 *     generateTypes: true,
 *     useTs: true,
 *   })],
 * };
 * ```
 *
 * Usage with nested theme:
 * ```tsx
 * const Button = styled.button`
 *   background: ${({ theme }) => theme.colors.primary};
 *   padding: ${({ theme }) => theme.spacing.md};
 * `;
 * ```
 */
export function styledComponentsPlugin(
  config: StyledComponentsPluginConfig = {},
): ReturnType<typeof definePlugin> {
  const {
    outDir = "",
    useCssVars = false,
    useTs = false,
    generateTypes = false,
    breakpoints,
    generateGlobalStyles = false,
    prefix,
    // New options
    themeStructure = "flat",
    generateProvider = false,
    categorizeTokens = themeStructure === "nested",
    stripPrefix,
  } = config;

  const stripPrefixArray = stripPrefix
    ? Array.isArray(stripPrefix)
      ? stripPrefix
      : stripPrefix.split(".")
    : [];

  return definePlugin("styled-components", (context) => {
    const { modes } = context;
    const ext = useTs ? "ts" : "js";
    const extx = useTs ? "tsx" : "jsx";

    // Track tokens and styles
    const tokens = createModeRecord<Record<string, unknown>>(modes, () => ({}));
    const nestedTokens = createModeRecord<Array<[string, unknown]>>(modes, () => []);
    const styles: string[] = [];
    const docs = new Map<string, string>();

    // Process all tokens
    context.query().forEach((token) => {
      if (token.type === "typography") {
        processTypographyToken(token, styles, modes.defaultMode, useCssVars, prefix);
      } else {
        if (themeStructure === "nested" || themeStructure === "hybrid") {
          processNestedToken(token, nestedTokens, modes, stripPrefixArray, categorizeTokens);
        }
        if (themeStructure === "flat" || themeStructure === "hybrid") {
          processToken(token, tokens, docs, modes, useCssVars, prefix);
        }
      }
    });

    // Build files
    const files: PluginOutputFile[] = [createStylesFile(styles, outDir, ext)];

    // Add theme files for each mode
    for (const mode of getModesToIterate(modes)) {
      if (themeStructure === "nested") {
        files.push(createNestedThemeFile(mode, nestedTokens[mode], modes.defaultMode, outDir, ext));
      } else if (themeStructure === "hybrid") {
        files.push(
          createHybridThemeFile(
            mode,
            tokens[mode],
            nestedTokens[mode],
            modes.defaultMode,
            useCssVars,
            outDir,
            ext,
          ),
        );
      } else {
        files.push(createThemeFile(mode, tokens[mode], modes.defaultMode, useCssVars, outDir, ext));
      }
    }

    // Add index file that exports all themes
    files.push(createIndexFile(modes, themeStructure, outDir, ext));

    // Add TypeScript types file if configured
    if (generateTypes && useTs) {
      if (themeStructure === "nested" || themeStructure === "hybrid") {
        files.push(createNestedTypesFile(nestedTokens[modes.defaultMode], outDir));
      } else {
        files.push(createTypesFile(tokens[modes.defaultMode], outDir));
      }
    }

    // Add media query helpers if breakpoints configured
    if (breakpoints) {
      files.push(createMediaFile(breakpoints, outDir, ext));
    }

    // Add global styles if configured
    if (generateGlobalStyles) {
      const globalConfig =
        typeof generateGlobalStyles === "object" ? generateGlobalStyles : { includeTokens: true };
      files.push(
        createGlobalStylesFile(tokens[modes.defaultMode], globalConfig, useCssVars, outDir, ext),
      );
    }

    // Add ThemeProvider if configured
    if (generateProvider) {
      files.push(createThemeProviderFile(modes, themeStructure, outDir, extx));
    }

    return { files };
  });
}

// ============================================================================
// Category Detection
// ============================================================================

function getTokenCategory(token: ProcessedToken): TokenCategory {
  const { type, path } = token;
  const pathLower = path.toLowerCase();

  switch (type) {
    case "color":
      return "colors";
    case "dimension": {
      if (pathLower.includes("spacing") || pathLower.includes("space") || pathLower.includes("gap"))
        return "spacing";
      if (pathLower.includes("fontsize") || pathLower.includes("font-size")) return "fontSize";
      if (pathLower.includes("lineheight") || pathLower.includes("line-height"))
        return "lineHeight";
      if (pathLower.includes("letterspacing") || pathLower.includes("letter-spacing"))
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
      return "shadows";
    case "duration":
      return "durations";
    case "cubicBezier":
      return "easings";
    case "number": {
      if (pathLower.includes("opacity")) return "opacity";
      if (pathLower.includes("zindex") || pathLower.includes("z-index")) return "zIndex";
      return "opacity";
    }
    default:
      return "colors";
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function convertToCssValue(value: unknown): string | number {
  if (typeof value === "object" && value !== null && "value" in value && "unit" in value) {
    return `${(value as { value: number; unit: string }).value}${(value as { value: number; unit: string }).unit}`;
  }
  return value as string | number;
}

function processCssStyleObject(
  style: Record<string, unknown>,
  useCssVars: boolean,
  prefix?: string,
): Record<string, string | number> {
  const result: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(style)) {
    const converted = convertToCssValue(value);
    result[key] = useCssVars ? processCssVarRef(converted, prefix) : converted;
  }
  return result;
}

function addTokenDocs(
  token: ProcessedToken,
  docs: Map<string, string>,
  requiredModes: readonly string[],
) {
  const { path, description, isGenerated } = token;

  const docLines = [
    "/**",
    description ? ` * @description ${description}` : "",
    isGenerated ? ` * @generated` : "",
    ` * @default ${processPrimitiveValue(convertToCssValue(token.toCSS()))}`,
  ].filter(Boolean);

  for (const mode of requiredModes) {
    const modeValue = token.toCSS(mode);
    docLines.push(` * @${mode} ${processPrimitiveValue(convertToCssValue(modeValue))}`);
  }
  docLines.push(" */\n");
  docs.set(path, docLines.join("\n"));
}

function processToken(
  token: ProcessedToken,
  tokens: Record<string, Record<string, unknown>>,
  docs: Map<string, string>,
  modes: ProcessorModes,
  useCssVars: boolean,
  prefix?: string,
) {
  const { path, requiredModes } = token;
  const tokenPath = useCssVars ? pathToCssVarName(path, prefix) : path;

  // Add docs
  addTokenDocs(token, docs, modes.requiredModes);

  // Set default mode value
  const cssValue = convertToCssValue(token.toCSS());
  const defaultValue = useCssVars ? processCssVarRef(cssValue, prefix) : cssValue;
  set(tokens[modes.defaultMode], tokenPath, defaultValue);

  // Set values for each required mode
  for (const mode of requiredModes) {
    const modeCssValue = convertToCssValue(token.toCSS(mode));
    set(
      tokens[mode],
      tokenPath,
      useCssVars ? processCssVarRef(modeCssValue, prefix) : modeCssValue,
    );
  }
}

function processNestedToken(
  token: ProcessedToken,
  nestedTokens: Record<string, Array<[string, unknown]>>,
  modes: ProcessorModes,
  stripPrefixArray: string[],
  categorizeTokens: boolean,
) {
  const { path, requiredModes } = token;

  // Strip prefixes from path
  let simplifiedPath = path;
  if (stripPrefixArray.length > 0) {
    simplifiedPath = stripTokenPrefix(path, { prefixes: stripPrefixArray, separator: "." });
  }

  // Optionally categorize by token type
  let finalPath = simplifiedPath;
  if (categorizeTokens) {
    const category = getTokenCategory(token);
    // Only add category if not already in path
    if (!simplifiedPath.toLowerCase().startsWith(category.toLowerCase())) {
      finalPath = `${category}.${simplifiedPath}`;
    }
  }

  // Convert path to camelCase segments for JS object
  const pathParts = finalPath.split(".");
  const camelPath = pathParts.map((p, i) => (i === 0 ? p : camelCase(p))).join(".");

  // Add default mode value
  const defaultValue = convertToCssValue(token.toCSS());
  nestedTokens[modes.defaultMode].push([camelPath, defaultValue]);

  // Add values for each required mode
  for (const mode of requiredModes) {
    const modeValue = convertToCssValue(token.toCSS(mode));
    nestedTokens[mode].push([camelPath, modeValue]);
  }
}

function processTypographyToken(
  token: ProcessedToken,
  styles: string[],
  defaultMode: string,
  useCssVars: boolean,
  prefix?: string,
) {
  const { path } = token;
  const isResponsive = token.hasExtension("responsive");

  let finalStyle: Record<string, unknown> = {};

  if (isResponsive) {
    const modeValues = token.modeValues as Record<string, unknown>;
    const baseValue = modeValues["base"];

    if (baseValue) {
      const baseStyle = typographyToCssStyle(baseValue);
      if (!isTokenAlias(baseStyle) && typeof baseStyle === "object") {
        finalStyle = processCssStyleObject(
          baseStyle as Record<string, unknown>,
          useCssVars,
          prefix,
        );

        // Process breakpoint-specific styles
        for (const [breakpoint, value] of Object.entries(modeValues)) {
          if (breakpoint === "base") continue;

          const breakpointStyle = typographyToCssStyle(value);
          if (isTokenAlias(breakpointStyle) || typeof breakpointStyle !== "object") continue;

          const filteredEntries = Object.entries(breakpointStyle).filter(
            ([key, val]) => (baseStyle as Record<string, unknown>)[key] !== val,
          );

          if (filteredEntries.length > 0) {
            finalStyle = deepMerge(finalStyle, {
              "@media": {
                [breakpoint.replace("@media ", "")]: Object.fromEntries(filteredEntries),
              },
            });
          }
        }
      }
    }
  } else {
    const rawValue = token.getValue(defaultMode);
    const style = typographyToCssStyle(rawValue);
    if (!isTokenAlias(style) && typeof style === "object") {
      finalStyle = processCssStyleObject(style as Record<string, unknown>, useCssVars, prefix);
    }
  }

  const styleName = pathToStyleName(path);
  styles.push(
    `export const ${styleName} = css\`${serializeObject(finalStyle, {
      processKey: (k) => k.replace(/([A-Z])/g, "-$1").toLowerCase(),
      processValue: (v) => `${v}`,
      separator: ";\n",
      wrap: (s) => `\n${s}\n`,
    })}\`\n`,
  );
}

function createStylesFile(styles: string[], outDir: string, ext: string): PluginOutputFile {
  // Only include the import if there are styles that use it
  const hasStyles = styles.some((s) => s.includes("css`"));
  const importLine = hasStyles ? `import { css } from 'styled-components';\n` : "";
  const content = [importLine, styles.join("\n")].join("\n");

  return {
    path: join(outDir, `styles.${ext}`),
    content,
    type: ext as "ts" | "js",
  };
}

function createThemeFile(
  mode: string,
  tokens: Record<string, unknown>,
  defaultMode: string,
  useCssVars: boolean,
  outDir: string,
  ext: string,
): PluginOutputFile {
  const isGlobal = mode === defaultMode && useCssVars;

  const content = isGlobal
    ? [
        `import { createGlobalStyle } from 'styled-components';`,
        `export const GlobalThemeStyle = createGlobalStyle\`\n${serializeObjectToCSS(tokens, ":root")}\n\``,
      ].join("\n")
    : [`export const ${mode}ThemeValues = ${serializeObject(tokens)};`].join("\n");

  return {
    path: join(outDir, `${mode}.${ext}`),
    content,
    type: ext as "ts" | "js",
  };
}

function createNestedThemeFile(
  mode: string,
  entries: Array<[string, unknown]>,
  defaultMode: string,
  outDir: string,
  ext: string,
): PluginOutputFile {
  const nestedObj = buildNestedObject(entries);
  const themeName = `${mode}Theme`;

  const content = [
    `// Auto-generated ${mode} theme`,
    `// Do not edit manually\n`,
    `export const ${themeName} = ${serializeJsObject(nestedObj)} as const;`,
    ``,
    `export type ${mode.charAt(0).toUpperCase() + mode.slice(1)}Theme = typeof ${themeName};`,
  ].join("\n");

  return {
    path: join(outDir, `${mode}.${ext}`),
    content,
    type: ext as "ts" | "js",
  };
}

function createHybridThemeFile(
  mode: string,
  flatTokens: Record<string, unknown>,
  nestedEntries: Array<[string, unknown]>,
  defaultMode: string,
  useCssVars: boolean,
  outDir: string,
  ext: string,
): PluginOutputFile {
  const nestedObj = buildNestedObject(nestedEntries);
  const themeName = `${mode}Theme`;
  const varsName = `${mode}ThemeVars`;

  const parts = [
    `// Auto-generated ${mode} theme`,
    `// Do not edit manually\n`,
    `// Nested theme object for direct access`,
    `export const ${themeName} = ${serializeJsObject(nestedObj)} as const;`,
    ``,
    `// Flat CSS variable references`,
    `export const ${varsName} = ${serializeObject(flatTokens)};`,
    ``,
    `export type ${mode.charAt(0).toUpperCase() + mode.slice(1)}Theme = typeof ${themeName};`,
  ];

  return {
    path: join(outDir, `${mode}.${ext}`),
    content: parts.join("\n"),
    type: ext as "ts" | "js",
  };
}

function createIndexFile(
  modes: ProcessorModes,
  themeStructure: string,
  outDir: string,
  ext: string,
): PluginOutputFile {
  const modeList = getModesToIterate(modes);

  const imports = modeList.map((mode) => {
    if (themeStructure === "nested") {
      return `export { ${mode}Theme } from './${mode}';`;
    } else if (themeStructure === "hybrid") {
      return `export { ${mode}Theme, ${mode}ThemeVars } from './${mode}';`;
    }
    return `export { ${mode}ThemeValues } from './${mode}';`;
  });

  imports.push(`export * from './styles';`);

  const content = [`// Auto-generated theme exports`, `// Do not edit manually\n`, ...imports].join(
    "\n",
  );

  return {
    path: join(outDir, `index.${ext}`),
    content,
    type: ext as "ts" | "js",
  };
}

// ============================================================================
// TypeScript Types Generation
// ============================================================================

function createTypesFile(tokens: Record<string, unknown>, outDir: string): PluginOutputFile {
  const typeDefinition = generateTypeFromTokens(tokens);

  const content = [
    `// Auto-generated styled-components theme types`,
    `// This file augments DefaultTheme for type-safe theming\n`,
    `import 'styled-components';\n`,
    `declare module 'styled-components' {`,
    `  export interface DefaultTheme ${typeDefinition}`,
    `}\n`,
    `export interface Theme ${typeDefinition}`,
  ].join("\n");

  return {
    path: join(outDir, "styled.d.ts"),
    content,
    type: "ts",
  };
}

function createNestedTypesFile(
  entries: Array<[string, unknown]>,
  outDir: string,
): PluginOutputFile {
  const nestedObj = buildNestedObject(entries);
  const typeDefinition = generateTypeFromNestedObject(nestedObj);

  const content = [
    `// Auto-generated styled-components theme types`,
    `// This file augments DefaultTheme for type-safe theming\n`,
    `import 'styled-components';\n`,
    `declare module 'styled-components' {`,
    `  export interface DefaultTheme ${typeDefinition}`,
    `}\n`,
    `export interface Theme ${typeDefinition}`,
    ``,
    `// Helper type for theme access`,
    `export type ThemeKey = keyof Theme;`,
  ].join("\n");

  return {
    path: join(outDir, "styled.d.ts"),
    content,
    type: "ts",
  };
}

function generateTypeFromTokens(obj: Record<string, unknown>, indent = ""): string {
  const entries: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      entries.push(
        `${indent}  ${safeKey}: ${generateTypeFromTokens(value as Record<string, unknown>, indent + "  ")};`,
      );
    } else {
      entries.push(`${indent}  ${safeKey}: string;`);
    }
  }

  return `{\n${entries.join("\n")}\n${indent}}`;
}

function generateTypeFromNestedObject(obj: Record<string, unknown>, indent = ""): string {
  const entries: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      entries.push(
        `${indent}  ${safeKey}: ${generateTypeFromNestedObject(value as Record<string, unknown>, indent + "  ")};`,
      );
    } else {
      entries.push(`${indent}  ${safeKey}: string;`);
    }
  }

  return `{\n${entries.join("\n")}\n${indent}}`;
}

// ============================================================================
// ThemeProvider Generation
// ============================================================================

function createThemeProviderFile(
  modes: ProcessorModes,
  themeStructure: string,
  outDir: string,
  ext: string,
): PluginOutputFile {
  const modeList = getModesToIterate(modes);
  const defaultMode = modes.defaultMode;

  const themeImports = modeList
    .map((mode) => {
      const themeName =
        themeStructure === "nested" || themeStructure === "hybrid"
          ? `${mode}Theme`
          : `${mode}ThemeValues`;
      return themeName;
    })
    .join(", ");

  const themesObject = modeList
    .map((mode) => {
      const themeName =
        themeStructure === "nested" || themeStructure === "hybrid"
          ? `${mode}Theme`
          : `${mode}ThemeValues`;
      return `  ${mode}: ${themeName}`;
    })
    .join(",\n");

  const content = [
    `// Auto-generated ThemeProvider`,
    `// Do not edit manually\n`,
    `import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';`,
    `import { ThemeProvider as StyledThemeProvider } from 'styled-components';`,
    `import { ${themeImports} } from './index';\n`,
    `export type ThemeMode = ${modeList.map((m) => `'${m}'`).join(" | ")};`,
    ``,
    `const themes = {`,
    themesObject,
    `} as const;`,
    ``,
    `interface ThemeContextValue {`,
    `  mode: ThemeMode;`,
    `  setMode: (mode: ThemeMode) => void;`,
    `  toggleMode: () => void;`,
    `}`,
    ``,
    `const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);`,
    ``,
    `export interface ThemeProviderProps {`,
    `  children: ReactNode;`,
    `  defaultMode?: ThemeMode;`,
    `}`,
    ``,
    `export function ThemeProvider({ children, defaultMode = '${defaultMode}' }: ThemeProviderProps) {`,
    `  const [mode, setMode] = useState<ThemeMode>(defaultMode);`,
    ``,
    `  const toggleMode = () => {`,
    `    const modes: ThemeMode[] = ${JSON.stringify(modeList)};`,
    `    const currentIndex = modes.indexOf(mode);`,
    `    const nextIndex = (currentIndex + 1) % modes.length;`,
    `    setMode(modes[nextIndex]);`,
    `  };`,
    ``,
    `  const contextValue = useMemo(() => ({ mode, setMode, toggleMode }), [mode]);`,
    `  const theme = themes[mode];`,
    ``,
    `  return (`,
    `    <ThemeContext.Provider value={contextValue}>`,
    `      <StyledThemeProvider theme={theme}>`,
    `        {children}`,
    `      </StyledThemeProvider>`,
    `    </ThemeContext.Provider>`,
    `  );`,
    `}`,
    ``,
    `export function useThemeMode() {`,
    `  const context = useContext(ThemeContext);`,
    `  if (!context) {`,
    `    throw new Error('useThemeMode must be used within a ThemeProvider');`,
    `  }`,
    `  return context;`,
    `}`,
  ].join("\n");

  return {
    path: join(outDir, `ThemeProvider.${ext}`),
    content,
    type: ext as "ts" | "js",
  };
}

// ============================================================================
// Media Query Helpers
// ============================================================================

function createMediaFile(
  breakpoints: Record<string, string>,
  outDir: string,
  ext: string,
): PluginOutputFile {
  const breakpointEntries = Object.entries(breakpoints);

  const mediaHelpers = breakpointEntries
    .map(
      ([name, query]) =>
        `  ${name}: (styles: TemplateStringsArray | string) => \`@media ${query} { \${styles} }\`,`,
    )
    .join("\n");

  const breakpointValues = breakpointEntries
    .map(([name, query]) => `  ${name}: "${query}",`)
    .join("\n");

  const content = [
    `// Auto-generated media query helpers`,
    `// Use these helpers for responsive styles with styled-components\n`,
    `/**`,
    ` * Breakpoint values for direct usage`,
    ` * @example`,
    ` * \`\`\`tsx`,
    ` * const Box = styled.div\``,
    ` *   @media \${breakpoints.md} {`,
    ` *     padding: 2rem;`,
    ` *   }`,
    ` * \`;`,
    ` * \`\`\``,
    ` */`,
    `export const breakpoints = {\n${breakpointValues}\n};\n`,
    `/**`,
    ` * Media query template helpers`,
    ` * @example`,
    ` * \`\`\`tsx`,
    ` * const Box = styled.div\``,
    ` *   padding: 1rem;`,
    ` *   \${media.md\`padding: 2rem;\`}`,
    ` * \`;`,
    ` * \`\`\``,
    ` */`,
    `export const media = {\n${mediaHelpers}\n};\n`,
    `/**`,
    ` * Helper to create min-width media queries`,
    ` * @example media.up(768) => "@media (min-width: 768px)"`,
    ` */`,
    `export const up = (minWidth: number | string) =>`,
    `  \`@media (min-width: \${typeof minWidth === 'number' ? \`\${minWidth}px\` : minWidth})\`;\n`,
    `/**`,
    ` * Helper to create max-width media queries`,
    ` * @example media.down(768) => "@media (max-width: 767px)"`,
    ` */`,
    `export const down = (maxWidth: number | string) =>`,
    `  \`@media (max-width: \${typeof maxWidth === 'number' ? \`\${maxWidth - 1}px\` : maxWidth})\`;\n`,
    `/**`,
    ` * Helper to create range media queries`,
    ` * @example media.between(768, 1024) => "@media (min-width: 768px) and (max-width: 1023px)"`,
    ` */`,
    `export const between = (minWidth: number, maxWidth: number) =>`,
    `  \`@media (min-width: \${minWidth}px) and (max-width: \${maxWidth - 1}px)\`;`,
  ].join("\n");

  return {
    path: join(outDir, `media.${ext}`),
    content,
    type: ext as "ts" | "js",
  };
}

// ============================================================================
// Global Styles Generation
// ============================================================================

function createGlobalStylesFile(
  tokens: Record<string, unknown>,
  config: GlobalStylesConfig,
  useCssVars: boolean,
  outDir: string,
  ext: string,
): PluginOutputFile {
  const { reset = false, includeTokens = true, customCSS = "" } = config;

  const parts: string[] = [`import { createGlobalStyle } from 'styled-components';\n`];

  const cssBlocks: string[] = [];

  // Add CSS reset if requested
  if (reset) {
    cssBlocks.push(CSS_RESET);
  }

  // Add token variables if requested and using CSS vars
  if (includeTokens && useCssVars) {
    cssBlocks.push(serializeObjectToCSS(tokens, ":root"));
  }

  // Add custom CSS
  if (customCSS) {
    cssBlocks.push(customCSS);
  }

  parts.push(`export const GlobalStyles = createGlobalStyle\`\n${cssBlocks.join("\n\n")}\n\`;`);

  return {
    path: join(outDir, `globalStyles.${ext}`),
    content: parts.join("\n"),
    type: ext as "ts" | "js",
  };
}

// ============================================================================
// Serialization Helpers
// ============================================================================

function serializeJsObject(obj: unknown, indent = 0): string {
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
    const items = obj.map((item) => serializeJsObject(item, indent + 1)).join(", ");
    return `[${items}]`;
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "{}";

    const props = entries
      .map(([key, value]) => {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        return `${spaces}  ${safeKey}: ${serializeJsObject(value, indent + 1)}`;
      })
      .join(",\n");

    return `{\n${props}\n${spaces}}`;
  }

  return String(obj);
}

// Minimal CSS reset based on modern best practices
const CSS_RESET = `
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html {
    -webkit-text-size-adjust: 100%;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  input, button, textarea, select {
    font: inherit;
  }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }

  #root, #__next {
    isolation: isolate;
  }
`;
