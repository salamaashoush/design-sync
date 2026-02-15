import {
  createModeRecord,
  definePlugin,
  getModesToIterate,
  stripTokenPrefix,
  type PluginOutputFile,
} from "@design-sync/manager";
import { deepMerge, set } from "@design-sync/utils";
import {
  isTokenAlias,
  pathToStyleName,
  processPrimitiveValue,
  serializeObject,
  typographyToCssStyle,
  type ProcessedToken,
  type ProcessorModes,
} from "@design-sync/w3c-dtfm";
import { join } from "node:path";

export interface VanillaExtractPluginConfig {
  /** Name of the contract variable */
  contractName?: string;
  /** Output directory for generated files (relative to main out dir) */
  outDir?: string;
  /** Only export theme values without createTheme calls */
  onlyValues?: boolean;
  /** Theme selector for global themes */
  themeSelector?: string | Record<string, string>;
  /** Which themes to create as global themes */
  globalThemes?: boolean | "default" | string[];
  /** Use createGlobalThemeContract instead of createThemeContract */
  createGlobalContract?: boolean;
  /** Custom style name generator */
  styleName?: (token: ProcessedToken, modes: ProcessorModes) => string;
  /**
   * Generate sprinkles (utility-first CSS atoms) for specified token types
   * @example ["colors", "space", "fontSize"] generates color, spacing, and font size utilities
   */
  sprinkles?: SprinklesConfig;
  /**
   * Generate TypeScript types file for theme contract
   * @default false
   */
  generateTypes?: boolean;

  // NEW ERGONOMIC OPTIONS

  /**
   * Strip design system prefix from token paths
   * @example ['kda', 'foundation'] removes "kda.foundation." from paths
   */
  stripPrefix?: string | string[];
}

export interface SprinklesConfig {
  /** Token types to include in sprinkles */
  include?: string[];
  /** Responsive breakpoints for responsive sprinkles */
  breakpoints?: Record<string, string>;
  /** CSS properties to map tokens to */
  properties?: SprinklesPropertyConfig[];
  /**
   * Enable responsive variants for properties
   * @default true when breakpoints are provided
   */
  responsive?: boolean;
  /**
   * Property shorthands
   * @example { p: ['padding'], m: ['margin'], px: ['paddingLeft', 'paddingRight'] }
   */
  shorthands?: Record<string, string[]>;
  /**
   * Generate atoms helper function
   * @default false
   */
  generateAtoms?: boolean;
  /**
   * Generate Box component
   * @default false
   */
  generateBox?: boolean;
}

export interface SprinklesPropertyConfig {
  /** CSS property name (e.g., "color", "backgroundColor") */
  property: string;
  /** Token type to use (e.g., "color", "dimension") */
  tokenType: string;
  /** Filter tokens by path pattern (e.g., "colors.") */
  filter?: string;
}

// Default shorthands commonly used
const DEFAULT_SHORTHANDS: Record<string, string[]> = {
  p: ["padding"],
  pt: ["paddingTop"],
  pr: ["paddingRight"],
  pb: ["paddingBottom"],
  pl: ["paddingLeft"],
  px: ["paddingLeft", "paddingRight"],
  py: ["paddingTop", "paddingBottom"],
  m: ["margin"],
  mt: ["marginTop"],
  mr: ["marginRight"],
  mb: ["marginBottom"],
  ml: ["marginLeft"],
  mx: ["marginLeft", "marginRight"],
  my: ["marginTop", "marginBottom"],
};

/**
 * Vanilla Extract Plugin - Exports design tokens as vanilla-extract theme contracts
 *
 * Creates:
 * - contract.css.ts - Theme contract with all token paths
 * - {mode}.css.ts - Theme files with values for each mode
 * - styles.css.ts - Typography styles
 * - sprinkles.css.ts - Sprinkles (atomic CSS utilities)
 * - atoms.css.ts - Atoms helper (optional)
 * - Box.tsx - Box component (optional)
 *
 * @example
 * ```typescript
 * // design-sync.config.ts
 * import { vanillaExtractPlugin } from '@design-sync/vanilla-extract-plugin';
 *
 * export default {
 *   plugins: [vanillaExtractPlugin({
 *     contractName: 'tokens',
 *     globalThemes: 'default',
 *     sprinkles: {
 *       enabled: true,
 *       responsive: true,
 *       breakpoints: {
 *         mobile: {},
 *         tablet: '(min-width: 768px)',
 *         desktop: '(min-width: 1024px)',
 *       },
 *       shorthands: { p: ['padding'], m: ['margin'] },
 *       generateAtoms: true,
 *       generateBox: true,
 *     },
 *   })],
 * };
 * ```
 */
export function vanillaExtractPlugin(
  config: VanillaExtractPluginConfig = {},
): ReturnType<typeof definePlugin> {
  const {
    contractName = "vars",
    outDir = "",
    onlyValues = false,
    themeSelector = ":root",
    globalThemes = false,
    createGlobalContract = false,
    styleName: customStyleName,
    sprinkles,
    generateTypes = false,
    stripPrefix,
  } = config;

  const stripPrefixArray = stripPrefix
    ? Array.isArray(stripPrefix)
      ? stripPrefix
      : stripPrefix.split(".")
    : [];

  return definePlugin("vanilla-extract", (context) => {
    const { modes } = context;

    // Track tokens, contract, styles, and docs
    const tokens = createModeRecord<Record<string, unknown>>(modes, () => ({}));
    const tokensContract: Record<string, unknown> = {};
    const docs = new Map<string, string>();
    const styles: string[] = [];
    const sprinklesTokens: Map<string, Map<string, string>> = new Map();

    const wrapWithThemeVar = (path: string, isSinglePath: boolean) =>
      isSinglePath ? `${contractName}.${path}` : "${" + contractName + "." + path + "}";

    const wrapWithThemeContract = (path: string) => `${contractName}.${path}`;

    // Process all tokens
    context.query().forEach((token) => {
      // Apply prefix stripping
      const simplifiedPath =
        stripPrefixArray.length > 0
          ? stripTokenPrefix(token.path, { prefixes: stripPrefixArray, separator: "." })
          : token.path;

      if (token.type === "typography") {
        processTypographyToken(token, styles, modes, wrapWithThemeVar, customStyleName);
      } else {
        processToken(
          token,
          simplifiedPath,
          tokens,
          tokensContract,
          docs,
          modes,
          wrapWithThemeVar,
          wrapWithThemeContract,
        );

        // Collect tokens for sprinkles
        if (sprinkles) {
          collectSprinklesToken(token, simplifiedPath, sprinklesTokens, sprinkles, contractName);
        }
      }
    });

    // Build files
    const files: PluginOutputFile[] = [
      createContractFile(tokensContract, contractName, createGlobalContract, docs, outDir),
      createStylesFile(styles, contractName, outDir),
    ];

    // Add theme files for each mode
    for (const mode of getModesToIterate(modes)) {
      files.push(
        createThemeFile(
          mode,
          tokens[mode],
          contractName,
          modes.defaultMode,
          themeSelector,
          globalThemes,
          onlyValues,
          outDir,
        ),
      );
    }

    // Add sprinkles file if configured
    if (sprinkles && sprinklesTokens.size > 0) {
      files.push(createSprinklesFile(sprinklesTokens, sprinkles, contractName, outDir));

      // Add atoms helper if configured
      if (sprinkles.generateAtoms) {
        files.push(createAtomsFile(outDir));
      }

      // Add Box component if configured
      if (sprinkles.generateBox) {
        files.push(createBoxFile(outDir));
      }
    }

    // Add TypeScript types file if configured
    if (generateTypes) {
      files.push(createTypesFile(tokensContract, contractName, outDir));
    }

    return { files };
  });
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
  wrapFn: (path: string, isSinglePath: boolean) => string,
): Record<string, string | number> {
  const result: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(style)) {
    const processed =
      typeof value === "object" && value !== null && "value" in value && "unit" in value
        ? `${(value as { value: number; unit: string }).value}${(value as { value: number; unit: string }).unit}`
        : value;
    result[key] = processPrimitiveValue(processed as string | number, wrapFn);
  }
  return result;
}

function processToken(
  token: ProcessedToken,
  simplifiedPath: string,
  tokens: Record<string, Record<string, unknown>>,
  tokensContract: Record<string, unknown>,
  docs: Map<string, string>,
  modes: ProcessorModes,
  wrapWithThemeVar: (path: string, isSinglePath: boolean) => string,
  wrapWithThemeContract: (path: string) => string,
) {
  const { requiredModes } = token;

  // Add to contract using simplified path
  set(tokensContract, simplifiedPath, "");

  // Add docs
  addTokenDocs(token, simplifiedPath, docs, modes.requiredModes, wrapWithThemeContract);

  // Set values for each mode using simplified path
  const defaultValue = processPrimitiveValue(convertToCssValue(token.toCSS()), wrapWithThemeVar);
  set(tokens[modes.defaultMode], simplifiedPath, defaultValue);

  for (const mode of requiredModes) {
    const modeValue = token.toCSS(mode);
    set(
      tokens[mode],
      simplifiedPath,
      processPrimitiveValue(convertToCssValue(modeValue), wrapWithThemeVar),
    );
  }
}

function addTokenDocs(
  token: ProcessedToken,
  simplifiedPath: string,
  docs: Map<string, string>,
  requiredModes: readonly string[],
  wrapWithThemeContract: (path: string) => string,
) {
  const { description, isGenerated } = token;

  const docLines = [
    "/**",
    description ? ` * ${description}` : "",
    isGenerated ? ` * [generated] ` : "",
  ].filter(Boolean);

  for (const mode of requiredModes) {
    const raw = token.getRawValue(mode);
    const value = processPrimitiveValue(
      convertToCssValue(token.toCSS(mode)),
      wrapWithThemeContract,
    );
    if (typeof value === "string" && isTokenAlias(raw)) {
      docLines.push(` * @${mode} {@link ${value}}`);
    } else {
      docLines.push(` * @${mode}  \`"${value}"\``);
    }
  }
  docLines.push(" */\n");
  docs.set(simplifiedPath, docLines.join("\n"));
}

function processTypographyToken(
  token: ProcessedToken,
  styles: string[],
  modes: ProcessorModes,
  wrapWithThemeVar: (path: string, isSinglePath: boolean) => string,
  customStyleName?: (token: ProcessedToken, modes: ProcessorModes) => string,
) {
  const { path, description } = token;
  const isResponsive = token.hasExtension("responsive");

  let finalStyle: Record<string, unknown> = {};

  if (isResponsive) {
    const modeValues = token.modeValues as Record<string, unknown>;
    const baseValue = modeValues["base"];

    if (baseValue) {
      const baseStyle = typographyToCssStyle(baseValue);
      if (!isTokenAlias(baseStyle) && typeof baseStyle === "object") {
        finalStyle = processCssStyleObject(baseStyle as Record<string, unknown>, wrapWithThemeVar);

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
    const rawValue = token.getValue(modes.defaultMode);
    const style = typographyToCssStyle(rawValue);
    if (!isTokenAlias(style) && typeof style === "object") {
      finalStyle = processCssStyleObject(style as Record<string, unknown>, wrapWithThemeVar);
    }
  }

  const styleName = customStyleName ? customStyleName(token, modes) : pathToStyleName(path);
  const docComment = description ? `/**\n * ${description}\n */\n` : "";
  styles.push(`${docComment}export const ${styleName} = style(${serializeObject(finalStyle)})\n`);
}

function createContractFile(
  tokensContract: Record<string, unknown>,
  contractName: string,
  createGlobalContract: boolean,
  docs: Map<string, string>,
  outDir: string,
): PluginOutputFile {
  const themeContractFactory = createGlobalContract
    ? "createGlobalThemeContract"
    : "createThemeContract";
  const content = [
    `import { ${themeContractFactory} } from '@vanilla-extract/css';\n`,
    `export const ${contractName} = ${themeContractFactory}(${serializeObject(tokensContract, {
      docsComment: (path) => docs.get(path) || "",
    })});`,
  ].join("\n");

  return {
    path: join(outDir, "contract.css.ts"),
    content,
    type: "ts",
  };
}

function createStylesFile(
  styles: string[],
  contractName: string,
  outDir: string,
): PluginOutputFile {
  // Only include imports if there are styles that use them
  const hasStyles = styles.some((s) => s.includes("style("));
  const imports = hasStyles
    ? `import { style } from '@vanilla-extract/css';\n\nimport { ${contractName} } from './contract.css';\n`
    : "";
  const content = [imports, styles.join("\n")].join("\n");

  return {
    path: join(outDir, "styles.css.ts"),
    content,
    type: "ts",
  };
}

function createThemeFile(
  mode: string,
  tokens: Record<string, unknown>,
  contractName: string,
  defaultMode: string,
  themeSelector: string | Record<string, string>,
  globalThemes: boolean | "default" | string[],
  onlyValues: boolean,
  outDir: string,
): PluginOutputFile {
  const isGlobal =
    globalThemes === true ||
    (globalThemes === "default" && mode === defaultMode) ||
    (Array.isArray(globalThemes) && globalThemes.includes(mode));

  const themeFactory = isGlobal ? "createGlobalTheme" : "createTheme";
  const selector =
    typeof themeSelector === "object" ? (themeSelector[mode] ?? ":root") : themeSelector;
  const selectorArg = isGlobal ? `"${selector}"` : undefined;
  const themeValues = serializeObject(tokens);
  const factoryArgs = [selectorArg, contractName, `${mode}ThemeValues`].filter(Boolean).join(", ");
  const factoryCall = `${themeFactory}(${factoryArgs});`;

  const content = [
    onlyValues ? undefined : `import { ${themeFactory} } from '@vanilla-extract/css';\n`,
    `import { ${contractName} } from './contract.css';\n`,
    `export const ${mode}ThemeValues = ${themeValues};\n`,
    onlyValues ? undefined : isGlobal ? factoryCall : `export const ${mode}Theme = ${factoryCall}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    path: join(outDir, `${mode}.css.ts`),
    content,
    type: "ts",
  };
}

// ============================================================================
// Sprinkles Generation
// ============================================================================

function collectSprinklesToken(
  token: ProcessedToken,
  simplifiedPath: string,
  sprinklesTokens: Map<string, Map<string, string>>,
  config: SprinklesConfig,
  contractName: string,
) {
  const { include = [], properties = [] } = config;

  // Check if token type should be included
  if (include.length > 0 && !include.includes(token.type)) {
    return;
  }

  // Add to general token type collection
  let typeTokens = sprinklesTokens.get(token.type);
  if (!typeTokens) {
    typeTokens = new Map();
    sprinklesTokens.set(token.type, typeTokens);
  }

  // Create a short name from the simplified path for CSS class generation
  const shortName = simplifiedPath.split(".").pop() || simplifiedPath;
  typeTokens.set(shortName, `${contractName}.${simplifiedPath}`);

  // Also check property-specific filters
  for (const prop of properties) {
    if (prop.tokenType !== token.type) continue;
    if (prop.filter && !simplifiedPath.startsWith(prop.filter)) continue;

    let propTokens = sprinklesTokens.get(`prop:${prop.property}`);
    if (!propTokens) {
      propTokens = new Map();
      sprinklesTokens.set(`prop:${prop.property}`, propTokens);
    }
    propTokens.set(shortName, `${contractName}.${simplifiedPath}`);
  }
}

function createSprinklesFile(
  sprinklesTokens: Map<string, Map<string, string>>,
  config: SprinklesConfig,
  contractName: string,
  outDir: string,
): PluginOutputFile {
  const {
    breakpoints,
    properties = [],
    responsive = !!breakpoints,
    shorthands = DEFAULT_SHORTHANDS,
  } = config;

  const imports = new Set<string>(["defineProperties", "createSprinkles"]);
  const propertyDefinitions: string[] = [];
  const propertyNames: string[] = [];

  // Generate conditions object if we have breakpoints
  const conditionsStr = breakpoints && responsive ? generateConditionsObject(breakpoints) : "";

  // Default property mappings
  const defaultPropertyMappings: Record<string, string[]> = {
    color: ["color", "backgroundColor", "borderColor"],
    dimension: [
      "padding",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "margin",
      "marginTop",
      "marginRight",
      "marginBottom",
      "marginLeft",
      "gap",
      "width",
      "height",
      "minWidth",
      "minHeight",
      "maxWidth",
      "maxHeight",
    ],
    number: ["opacity", "zIndex"],
  };

  // Process each token type
  for (const [key, tokens] of sprinklesTokens) {
    if (key.startsWith("prop:")) continue; // Handle these separately

    const tokenValues = Object.fromEntries(tokens);
    const cssProperties = defaultPropertyMappings[key] || [];

    if (cssProperties.length > 0 && Object.keys(tokenValues).length > 0) {
      const propName = `${key}Properties`;
      propertyNames.push(propName);

      const propertiesContent = cssProperties
        .map((p) => `    ${p}: ${serializeSimpleObject(tokenValues)}`)
        .join(",\n");

      let shorthandsContent = "";
      if (key === "dimension") {
        // Add relevant shorthands for dimension properties
        const relevantShorthands = Object.entries(shorthands)
          .filter(([, props]) => props.some((p) => cssProperties.includes(p)))
          .map(([name, props]) => `    ${name}: ${JSON.stringify(props)}`)
          .join(",\n");

        if (relevantShorthands) {
          shorthandsContent = `,\n  shorthands: {\n${relevantShorthands}\n  }`;
        }
      }

      propertyDefinitions.push(`
const ${propName} = defineProperties({
${conditionsStr}  properties: {
${propertiesContent}
  }${shorthandsContent}
});`);
    }
  }

  // Process custom property mappings
  for (const prop of properties) {
    const propKey = `prop:${prop.property}`;
    const tokens = sprinklesTokens.get(propKey);
    if (!tokens || tokens.size === 0) continue;

    const tokenValues = Object.fromEntries(tokens);
    const propName = `${prop.property}Properties`;
    propertyNames.push(propName);

    propertyDefinitions.push(`
const ${propName} = defineProperties({
${conditionsStr}  properties: {
    ${prop.property}: ${serializeSimpleObject(tokenValues)}
  }
});`);
  }

  const content = [
    `import { ${Array.from(imports).join(", ")} } from '@vanilla-extract/sprinkles';`,
    `import { ${contractName} } from './contract.css';\n`,
    propertyDefinitions.join("\n"),
    `\nexport const sprinkles = createSprinkles(${propertyNames.join(", ")});`,
    `export type Sprinkles = Parameters<typeof sprinkles>[0];`,
  ].join("\n");

  return {
    path: join(outDir, "sprinkles.css.ts"),
    content,
    type: "ts",
  };
}

function generateConditionsObject(breakpoints: Record<string, string>): string {
  const conditions: string[] = [];
  const breakpointNames = Object.keys(breakpoints);

  for (const [name, query] of Object.entries(breakpoints)) {
    if (query === "" || query === "{}") {
      conditions.push(`    ${name}: {}`);
    } else {
      conditions.push(`    ${name}: { "@media": "${query}" }`);
    }
  }

  return `  conditions: {
${conditions.join(",\n")}
  },
  defaultCondition: "${breakpointNames[0]}",
  responsiveArray: ${JSON.stringify(breakpointNames)},
`;
}

function createAtomsFile(outDir: string): PluginOutputFile {
  const content = `import { sprinkles, type Sprinkles } from './sprinkles.css';

/**
 * Atoms helper for applying sprinkles with type safety
 *
 * @example
 * \`\`\`tsx
 * import { atoms } from './tokens/atoms.css';
 *
 * const className = atoms({
 *   p: '4',
 *   bg: 'primary',
 *   color: 'white',
 * });
 * \`\`\`
 */
export const atoms = sprinkles;

export type Atoms = Sprinkles;

/**
 * Combine atoms with other class names
 */
export function composeAtoms(...classes: (string | Sprinkles | undefined | null | false)[]): string {
  return classes
    .filter(Boolean)
    .map((c) => {
      if (typeof c === 'string') return c;
      return sprinkles(c as Sprinkles);
    })
    .join(' ');
}
`;

  return {
    path: join(outDir, "atoms.css.ts"),
    content,
    type: "ts",
  };
}

function createBoxFile(outDir: string): PluginOutputFile {
  const content = `import React, { forwardRef, type ComponentPropsWithRef, type ElementType } from 'react';
import { sprinkles, type Sprinkles } from './sprinkles.css';

type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref'];

type BoxProps<C extends ElementType = 'div'> = {
  as?: C;
  className?: string;
} & Sprinkles &
  Omit<ComponentPropsWithRef<C>, keyof Sprinkles | 'as' | 'className'>;

type BoxComponent = <C extends ElementType = 'div'>(
  props: BoxProps<C> & { ref?: PolymorphicRef<C> }
) => React.ReactElement | null;

/**
 * Box component with sprinkles support
 *
 * @example
 * \`\`\`tsx
 * import { Box } from './tokens/Box';
 *
 * <Box p="4" bg="primary" color="white">
 *   Content
 * </Box>
 *
 * <Box as="button" p="2" onClick={handleClick}>
 *   Click me
 * </Box>
 * \`\`\`
 */
export const Box: BoxComponent = forwardRef(function Box<C extends ElementType = 'div'>(
  { as, className, ...props }: BoxProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = as || 'div';

  // Separate sprinkles props from other props
  const sprinklesProps: Record<string, unknown> = {};
  const otherProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (isSprinklesProp(key)) {
      sprinklesProps[key] = value;
    } else {
      otherProps[key] = value;
    }
  }

  const sprinklesClassName = sprinkles(sprinklesProps as Sprinkles);
  const combinedClassName = className
    ? \`\${sprinklesClassName} \${className}\`
    : sprinklesClassName;

  return <Component ref={ref} className={combinedClassName} {...otherProps} />;
}) as BoxComponent;

// List of known sprinkles properties
const sprinklesProperties = new Set([
  'p', 'pt', 'pr', 'pb', 'pl', 'px', 'py',
  'm', 'mt', 'mr', 'mb', 'ml', 'mx', 'my',
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'gap', 'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'color', 'backgroundColor', 'borderColor',
  'opacity', 'zIndex',
]);

function isSprinklesProp(key: string): boolean {
  return sprinklesProperties.has(key);
}
`;

  return {
    path: join(outDir, "Box.tsx"),
    content,
    type: "ts",
  };
}

// ============================================================================
// TypeScript Types Generation
// ============================================================================

function createTypesFile(
  tokensContract: Record<string, unknown>,
  contractName: string,
  outDir: string,
): PluginOutputFile {
  const typeDefinition = generateTypeFromContract(tokensContract);

  const content = [
    `// Auto-generated theme contract types`,
    `// This file provides TypeScript types for theme values\n`,
    `export interface ThemeContract ${typeDefinition}`,
    `\nexport type ThemeTokenPath = ${generateTokenPathUnion(tokensContract)};`,
    `\n/** Helper type to get the value type at a given path */`,
    `export type ThemeValue<P extends ThemeTokenPath> = string;`,
  ].join("\n");

  return {
    path: join(outDir, "types.ts"),
    content,
    type: "ts",
  };
}

function generateTypeFromContract(obj: Record<string, unknown>, indent = ""): string {
  const entries: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      entries.push(
        `${indent}  ${safeKey}: ${generateTypeFromContract(value as Record<string, unknown>, indent + "  ")};`,
      );
    } else {
      entries.push(`${indent}  ${safeKey}: string;`);
    }
  }

  return `{\n${entries.join("\n")}\n${indent}}`;
}

function generateTokenPathUnion(obj: Record<string, unknown>, prefix = ""): string {
  const paths: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      paths.push(
        ...generateTokenPathUnion(value as Record<string, unknown>, currentPath).split(" | "),
      );
    } else {
      paths.push(`"${currentPath}"`);
    }
  }

  return paths.join(" | ");
}

function serializeSimpleObject(obj: Record<string, string>): string {
  const entries = Object.entries(obj)
    .map(([key, value]) => {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
      return `${safeKey}: ${value}`;
    })
    .join(", ");
  return `{ ${entries} }`;
}
