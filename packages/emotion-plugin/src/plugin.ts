import {
  createFileBuilder,
  createModeRecord,
  definePlugin,
  getModesToIterate,
} from "@design-sync/manager";
import { deepMerge, set } from "@design-sync/utils";
import {
  type ProcessedToken,
  type ProcessorModes,
  isTokenAlias,
  pathToCssVarName,
  pathToStyleName,
  processCssVarRef,
  serializeObject,
  serializeObjectToCSS,
  typographyToCssStyle,
} from "@design-sync/w3c-dtfm";

export interface EmotionPluginConfig {
  /** Output directory for generated files (relative to main out dir) */
  outDir?: string;
  /** Generate TypeScript files */
  useTs?: boolean;
  /**
   * Use CSS variables for theming
   * @default false
   */
  useCssVars?: boolean;
  /** Prefix for CSS custom property names */
  prefix?: string;
  /**
   * Generate global styles component
   * @default false
   */
  generateGlobalStyles?: boolean;
  /**
   * Generate ThemeProvider wrapper
   * @default false
   */
  generateProvider?: boolean;
  /**
   * Media query breakpoints
   * @example { sm: "(min-width: 640px)", md: "(min-width: 768px)" }
   */
  breakpoints?: Record<string, string>;
}

/**
 * Emotion Plugin - Exports design tokens for @emotion/react
 *
 * Creates:
 * - {mode}.{ts,js} - Theme values for each mode
 * - styles.{ts,js} - Typography styles using css helper
 * - types.ts - TypeScript type augmentation for Emotion's Theme
 *
 * @example
 * ```typescript
 * // design-sync.config.ts
 * import { emotionPlugin } from '@design-sync/emotion-plugin';
 *
 * export default {
 *   plugins: [emotionPlugin({
 *     useCssVars: true,
 *     useTs: true,
 *     generateGlobalStyles: true,
 *     generateProvider: true
 *   })],
 * };
 * ```
 *
 * Usage:
 * ```tsx
 * import { ThemeProvider } from '@emotion/react';
 * import { lightTheme, darkTheme } from './tokens/theme';
 *
 * <ThemeProvider theme={lightTheme}>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function emotionPlugin(config: EmotionPluginConfig = {}): ReturnType<typeof definePlugin> {
  const {
    outDir = "",
    useTs = true,
    useCssVars = false,
    prefix,
    generateGlobalStyles = false,
    generateProvider = false,
    breakpoints,
  } = config;

  return definePlugin("emotion-plugin", (context) => {
    const { modes } = context;
    const builder = createFileBuilder(outDir);
    const ext = useTs ? "ts" : "js";

    // Collect tokens by mode
    const tokens = createModeRecord<Record<string, unknown>>(modes, () => ({}));
    const cssVars = createModeRecord<Record<string, string>>(modes, () => ({}));
    const styles: string[] = [];

    // Process all tokens
    context.query().forEach((token) => {
      if (token.type === "typography") {
        processTypographyToken(token, styles, modes.defaultMode, useCssVars, prefix);
      } else {
        processToken(token, tokens, cssVars, modes, useCssVars, prefix);
      }
    });

    // Generate theme files for each mode
    for (const mode of getModesToIterate(modes)) {
      builder.add(
        `${mode}.${ext}`,
        generateThemeFile(mode, tokens[mode], modes.defaultMode, useCssVars, useTs),
        ext as "ts" | "js",
      );
    }

    // Generate styles file
    builder.add(`styles.${ext}`, generateStylesFile(styles, useTs), ext as "ts" | "js");

    // Generate TypeScript types
    if (useTs) {
      builder.addTs("types.ts", generateTypesFile(tokens[modes.defaultMode]));
    }

    // Generate CSS variables if using CSS vars
    if (useCssVars) {
      for (const mode of getModesToIterate(modes)) {
        const selector = mode === modes.defaultMode ? ":root" : `[data-theme="${mode}"]`;
        builder.add(`${mode}.css`, serializeObjectToCSS(cssVars[mode], selector), "css");
      }
    }

    // Generate global styles if requested
    if (generateGlobalStyles) {
      builder.add(
        `globalStyles.${ext}`,
        generateGlobalStylesFile(tokens[modes.defaultMode], useCssVars, useTs),
        ext as "ts" | "js",
      );
    }

    // Generate provider if requested
    if (generateProvider) {
      const providerExt = useTs ? "tsx" : "jsx";
      builder.add(`ThemeProvider.${providerExt}`, generateProviderFile(modes, useTs), "ts");
    }

    // Generate media helpers if breakpoints provided
    if (breakpoints) {
      builder.add(`media.${ext}`, generateMediaFile(breakpoints, useTs), ext as "ts" | "js");
    }

    return builder.build();
  });
}

// ============================================================================
// Token Processing
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

function processToken(
  token: ProcessedToken,
  tokens: Record<string, Record<string, unknown>>,
  cssVars: Record<string, Record<string, string>>,
  modes: ProcessorModes,
  useCssVars: boolean,
  prefix?: string,
) {
  const { path } = token;
  const tokenPath = useCssVars ? pathToCssVarName(path, prefix) : path;

  // Set values for each mode
  for (const mode of getModesToIterate(modes)) {
    const cssValue = convertToCssValue(token.toCSS(mode));
    const value = useCssVars ? `var(${pathToCssVarName(path, prefix)})` : cssValue;
    set(tokens[mode], tokenPath, value);

    if (useCssVars) {
      cssVars[mode][pathToCssVarName(path, prefix)] = String(cssValue);
    }
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

// ============================================================================
// File Generation
// ============================================================================

function generateThemeFile(
  mode: string,
  tokens: Record<string, unknown>,
  defaultMode: string,
  useCssVars: boolean,
  useTs: boolean,
): string {
  const parts: string[] = ["// Auto-generated Emotion theme", "// Do not edit manually\n"];

  const themeName = `${mode}Theme`;
  const typeAnnotation = useTs ? ": Theme" : "";

  if (useTs) {
    parts.push('import type { Theme } from "./types";\n');
  }

  parts.push(`export const ${themeName}${typeAnnotation} = ${serializeObjectLiteral(tokens)};\n`);
  parts.push(`export default ${themeName};`);

  return parts.join("\n");
}

function generateStylesFile(styles: string[], _useTs: boolean): string {
  const parts: string[] = [
    "// Auto-generated Emotion styles",
    "// Do not edit manually\n",
    'import { css } from "@emotion/react";\n',
  ];

  parts.push(styles.join("\n"));

  return parts.join("\n");
}

function generateTypesFile(tokens: Record<string, unknown>): string {
  const typeDefinition = generateTypeFromTokens(tokens);

  return [
    "// Auto-generated Emotion theme types",
    "// This file augments @emotion/react's Theme interface\n",
    'import "@emotion/react";\n',
    'declare module "@emotion/react" {',
    `  export interface Theme ${typeDefinition}`,
    "}\n",
    `export interface Theme ${typeDefinition}`,
  ].join("\n");
}

function generateGlobalStylesFile(
  tokens: Record<string, unknown>,
  useCssVars: boolean,
  useTs: boolean,
): string {
  const parts: string[] = [
    "// Auto-generated Emotion global styles",
    "// Do not edit manually\n",
    'import { Global, css } from "@emotion/react";\n',
  ];

  const cssContent = useCssVars ? serializeObjectToCSS(tokens, ":root") : CSS_RESET;

  if (useTs) {
    parts.push("export const GlobalStyles = () => (");
  } else {
    parts.push("export const GlobalStyles = () => (");
  }

  parts.push("  <Global");
  parts.push("    styles={css`");
  parts.push(cssContent);
  parts.push("    `}");
  parts.push("  />");
  parts.push(");");

  return parts.join("\n");
}

function generateProviderFile(modes: ProcessorModes, useTs: boolean): string {
  const parts: string[] = [
    "// Auto-generated Emotion ThemeProvider",
    "// Do not edit manually\n",
    'import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";',
  ];

  if (useTs) {
    parts.push('import type { ReactNode } from "react";');
  }

  // Import all themes
  for (const mode of getModesToIterate(modes)) {
    parts.push(`import { ${mode}Theme } from "./${mode}";`);
  }

  parts.push("");

  const propsType = useTs
    ? `{ children: ReactNode; mode?: ${getModesToIterate(modes)
        .map((m) => `"${m}"`)
        .join(" | ")} }`
    : "";

  parts.push(`export const themes = {`);
  for (const mode of getModesToIterate(modes)) {
    parts.push(`  ${mode}: ${mode}Theme,`);
  }
  parts.push(`};\n`);

  if (useTs) {
    parts.push(`interface ThemeProviderProps ${propsType}\n`);
    parts.push(
      `export function ThemeProvider({ children, mode = "${modes.defaultMode}" }: ThemeProviderProps) {`,
    );
  } else {
    parts.push(`export function ThemeProvider({ children, mode = "${modes.defaultMode}" }) {`);
  }

  parts.push("  const theme = themes[mode];");
  parts.push("  return (");
  parts.push("    <EmotionThemeProvider theme={theme}>");
  parts.push("      {children}");
  parts.push("    </EmotionThemeProvider>");
  parts.push("  );");
  parts.push("}");

  return parts.join("\n");
}

function generateMediaFile(breakpoints: Record<string, string>, useTs: boolean): string {
  const breakpointEntries = Object.entries(breakpoints);

  const parts: string[] = ["// Auto-generated media query helpers", "// Do not edit manually\n"];

  // Breakpoint values
  parts.push("export const breakpoints = {");
  for (const [name, query] of breakpointEntries) {
    parts.push(`  ${name}: "${query}",`);
  }
  parts.push("} as const;\n");

  // Media query helpers
  if (useTs) {
    parts.push("type BreakpointKey = keyof typeof breakpoints;\n");
    parts.push("export const mq = (key: BreakpointKey) => `@media ${breakpoints[key]}`;\n");
  } else {
    parts.push("export const mq = (key) => `@media ${breakpoints[key]}`;\n");
  }

  // Individual exports
  parts.push("// Individual media query exports");
  for (const [name, query] of breakpointEntries) {
    parts.push(`export const ${name} = "@media ${query}";`);
  }

  return parts.join("\n");
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

function serializeObjectLiteral(obj: unknown, indent = 0): string {
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
    const items = obj.map((item) => serializeObjectLiteral(item, indent + 1)).join(", ");
    return `[${items}]`;
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "{}";

    const props = entries
      .map(([key, value]) => {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        return `${spaces}  ${safeKey}: ${serializeObjectLiteral(value, indent + 1)}`;
      })
      .join(",\n");

    return `{\n${props}\n${spaces}}`;
  }

  return String(obj);
}

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
`;
