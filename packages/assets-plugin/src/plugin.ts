/**
 * Assets Plugin for Design Sync
 *
 * Generates various outputs from icon and asset tokens:
 * - SVG sprite sheets
 * - React/Vue/Solid icon components
 * - CSS with data URLs
 * - TypeScript types and exports
 * - JSON manifests
 */

import { createFileBuilder, definePlugin } from "@design-sync/manager";
import { kebabCase, pascalCase } from "@design-sync/utils";
import { normalizeIconValue, isNormalizedIconValue, svgToDataUrl } from "@design-sync/w3c-dtfm";

// ============================================================================
// Types
// ============================================================================

export type IconFramework = "react" | "vue" | "solid" | "svelte" | "web-component";
export type SpriteFormat = "svg" | "symbol";

export interface AssetsPluginConfig {
  /** Output directory for assets (relative to main out dir) */
  outDir?: string;

  /**
   * Generate SVG sprite sheet
   * @default true
   */
  sprite?: boolean | SpriteConfig;

  /**
   * Generate framework components
   */
  components?: false | ComponentsConfig;

  /**
   * Generate CSS with icons as data URLs or sprite references
   * @default true
   */
  css?: boolean | CssConfig;

  /**
   * Generate TypeScript types and index
   * @default true
   */
  typescript?: boolean | TypeScriptConfig;

  /**
   * Generate JSON manifest of all icons
   * @default false
   */
  manifest?: boolean;

  /**
   * Filter icons by style
   */
  filterByStyle?: string[];

  /**
   * Custom icon name transformer
   */
  nameTransform?: (name: string, style?: string) => string;
}

export interface SpriteConfig {
  /** Sprite filename */
  filename?: string;
  /** Sprite format */
  format?: SpriteFormat;
  /** Add aria-hidden to symbols */
  ariaHidden?: boolean;
  /** Optimize SVG */
  optimize?: boolean;
}

export interface ComponentsConfig {
  /** Target framework */
  framework: IconFramework;
  /** Output directory for components */
  outDir?: string;
  /** Generate index file */
  generateIndex?: boolean;
  /** Component name prefix */
  prefix?: string;
  /** Component name suffix */
  suffix?: string;
  /** Add displayName for React */
  displayName?: boolean;
  /** Export as default or named */
  exportStyle?: "default" | "named";
  /** Generate props interface */
  generateProps?: boolean;
  /** Base size for icons */
  baseSize?: number;
}

export interface CssConfig {
  /** CSS filename */
  filename?: string;
  /** Use sprite references instead of data URLs */
  useSprite?: boolean;
  /** CSS custom property prefix */
  prefix?: string;
  /** Generate utility classes */
  utilityClasses?: boolean;
}

export interface TypeScriptConfig {
  /** Generate const enum for icon names */
  enumStyle?: "const-enum" | "enum" | "union" | "object";
  /** Export name for the icon names type/enum */
  exportName?: string;
}

// ============================================================================
// Icon Data
// ============================================================================

interface IconData {
  name: string;
  path: string;
  svg: string;
  width: number;
  height: number;
  style?: string;
  viewBox: string;
}

function extractViewBox(svg: string, width: number, height: number): string {
  const match = svg.match(/viewBox=["']([^"']+)["']/);
  if (match) {
    return match[1];
  }
  return `0 0 ${width} ${height}`;
}

function extractSvgContent(svg: string): string {
  // Remove XML declaration
  let content = svg.replace(/<\?xml[^>]*\?>/gi, "").trim();
  // Extract inner content from <svg> tag
  const innerMatch = content.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  if (innerMatch) {
    return innerMatch[1].trim();
  }
  return content;
}

function sanitizeSvg(svg: string): string {
  return svg
    .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/>\s+</g, "><") // Remove whitespace between tags
    .trim();
}

// ============================================================================
// Generators
// ============================================================================

function generateSprite(icons: IconData[], config: SpriteConfig): string {
  const symbols = icons
    .map((icon) => {
      const content = extractSvgContent(icon.svg);
      const ariaHidden = config.ariaHidden ? ' aria-hidden="true"' : "";
      return `  <symbol id="${icon.name}" viewBox="${icon.viewBox}"${ariaHidden}>\n    ${content}\n  </symbol>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:none">
${symbols}
</svg>
`;
}

function generateCss(icons: IconData[], config: CssConfig, spriteFilename?: string): string {
  const prefix = config.prefix || "icon";
  const lines: string[] = [];

  lines.push("/* Auto-generated icon CSS by Design Sync */");
  lines.push("");

  // CSS custom properties for each icon
  lines.push(":root {");
  for (const icon of icons) {
    if (config.useSprite && spriteFilename) {
      // Use sprite reference
      lines.push(`  --${prefix}-${icon.name}: url("${spriteFilename}#${icon.name}");`);
    } else {
      // Use data URL
      const dataUrl = svgToDataUrl(sanitizeSvg(icon.svg));
      lines.push(`  --${prefix}-${icon.name}: url("${dataUrl}");`);
    }
  }
  lines.push("}");
  lines.push("");

  // Utility classes
  if (config.utilityClasses) {
    lines.push("/* Icon utility classes */");
    lines.push(`.${prefix} {`);
    lines.push("  display: inline-block;");
    lines.push("  width: 1em;");
    lines.push("  height: 1em;");
    lines.push("  background-size: contain;");
    lines.push("  background-repeat: no-repeat;");
    lines.push("  background-position: center;");
    lines.push("}");
    lines.push("");

    for (const icon of icons) {
      lines.push(`.${prefix}-${icon.name} {`);
      lines.push(`  background-image: var(--${prefix}-${icon.name});`);
      lines.push("}");
    }
    lines.push("");

    // Size variants
    const sizes = [16, 20, 24, 32, 48, 64];
    for (const size of sizes) {
      lines.push(`.${prefix}-${size} { width: ${size}px; height: ${size}px; }`);
    }
  }

  return lines.join("\n");
}

function generateReactComponent(icon: IconData, config: ComponentsConfig): string {
  const componentName = `${config.prefix || ""}${pascalCase(icon.name)}${config.suffix || "Icon"}`;
  const content = extractSvgContent(icon.svg);
  const baseSize = config.baseSize || 24;

  return `import * as React from "react";

export interface ${componentName}Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  title?: string;
}

export const ${componentName} = React.forwardRef<SVGSVGElement, ${componentName}Props>(
  ({ size = ${baseSize}, color = "currentColor", title, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="${icon.viewBox}"
      fill={color}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title && <title>{title}</title>}
      ${content}
    </svg>
  )
);

${componentName}.displayName = "${componentName}";
`;
}

function generateVueComponent(icon: IconData, config: ComponentsConfig): string {
  const _componentName = `${config.prefix || ""}${pascalCase(icon.name)}${config.suffix || "Icon"}`;
  const content = extractSvgContent(icon.svg);
  const baseSize = config.baseSize || 24;

  return `<script setup lang="ts">
defineProps<{
  size?: number | string;
  color?: string;
  title?: string;
}>();
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size ?? ${baseSize}"
    :height="size ?? ${baseSize}"
    viewBox="${icon.viewBox}"
    :fill="color ?? 'currentColor'"
    :role="title ? 'img' : undefined"
    :aria-hidden="title ? undefined : true"
  >
    <title v-if="title">{{ title }}</title>
    ${content}
  </svg>
</template>
`;
}

function generateSolidComponent(icon: IconData, config: ComponentsConfig): string {
  const componentName = `${config.prefix || ""}${pascalCase(icon.name)}${config.suffix || "Icon"}`;
  const content = extractSvgContent(icon.svg);
  const baseSize = config.baseSize || 24;

  return `import { Component, JSX, splitProps, Show } from "solid-js";

export interface ${componentName}Props extends JSX.SvgSVGAttributes<SVGSVGElement> {
  size?: number | string;
  color?: string;
  title?: string;
}

export const ${componentName}: Component<${componentName}Props> = (props) => {
  const [local, others] = splitProps(props, ["size", "color", "title"]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={local.size ?? ${baseSize}}
      height={local.size ?? ${baseSize}}
      viewBox="${icon.viewBox}"
      fill={local.color ?? "currentColor"}
      role={local.title ? "img" : undefined}
      aria-hidden={local.title ? undefined : true}
      {...others}
    >
      <Show when={local.title}>
        <title>{local.title}</title>
      </Show>
      ${content}
    </svg>
  );
};
`;
}

function generateSvelteComponent(icon: IconData, config: ComponentsConfig): string {
  const content = extractSvgContent(icon.svg);
  const baseSize = config.baseSize || 24;

  return `<script lang="ts">
  export let size: number | string = ${baseSize};
  export let color: string = "currentColor";
  export let title: string | undefined = undefined;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="${icon.viewBox}"
  fill={color}
  role={title ? "img" : undefined}
  aria-hidden={title ? undefined : true}
  {...$$restProps}
>
  {#if title}
    <title>{title}</title>
  {/if}
  ${content}
</svg>
`;
}

function generateWebComponent(icon: IconData, config: ComponentsConfig): string {
  const componentName = `${config.prefix || ""}${kebabCase(icon.name)}${config.suffix ? `-${kebabCase(config.suffix)}` : "-icon"}`;
  const content = extractSvgContent(icon.svg);
  const baseSize = config.baseSize || 24;

  return `class ${pascalCase(componentName)} extends HTMLElement {
  static get observedAttributes() {
    return ["size", "color", "title"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const size = this.getAttribute("size") ?? "${baseSize}";
    const color = this.getAttribute("color") ?? "currentColor";
    const title = this.getAttribute("title");

    this.shadowRoot.innerHTML = \`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="\${size}"
        height="\${size}"
        viewBox="${icon.viewBox}"
        fill="\${color}"
        \${title ? 'role="img"' : 'aria-hidden="true"'}
      >
        \${title ? \`<title>\${title}</title>\` : ""}
        ${content}
      </svg>
    \`;
  }
}

customElements.define("${componentName}", ${pascalCase(componentName)});

export { ${pascalCase(componentName)} };
`;
}

function generateComponentIndex(icons: IconData[], config: ComponentsConfig): string {
  const lines: string[] = [];
  lines.push("/* Auto-generated icon index by Design Sync */");
  lines.push("");

  const ext = config.framework === "vue" ? ".vue" : config.framework === "svelte" ? ".svelte" : "";

  for (const icon of icons) {
    const componentName = `${config.prefix || ""}${pascalCase(icon.name)}${config.suffix || "Icon"}`;
    const filename = kebabCase(icon.name);

    if (config.exportStyle === "default") {
      lines.push(`export { default as ${componentName} } from "./${filename}${ext}";`);
    } else {
      lines.push(`export { ${componentName} } from "./${filename}${ext}";`);
    }
  }

  lines.push("");

  // Export icon names type
  lines.push("// Icon names");
  lines.push(`export type IconName = ${icons.map((i) => `"${i.name}"`).join(" | ")};`);
  lines.push("");
  lines.push("export const iconNames = [");
  for (const icon of icons) {
    lines.push(`  "${icon.name}",`);
  }
  lines.push("] as const;");

  return lines.join("\n");
}

function generateTypeScript(icons: IconData[], config: TypeScriptConfig): string {
  const lines: string[] = [];
  const exportName = config.exportName || "IconName";

  lines.push("/* Auto-generated icon types by Design Sync */");
  lines.push("");

  switch (config.enumStyle) {
    case "const-enum":
      lines.push(`export const enum ${exportName} {`);
      for (const icon of icons) {
        lines.push(`  ${pascalCase(icon.name)} = "${icon.name}",`);
      }
      lines.push("}");
      break;

    case "enum":
      lines.push(`export enum ${exportName} {`);
      for (const icon of icons) {
        lines.push(`  ${pascalCase(icon.name)} = "${icon.name}",`);
      }
      lines.push("}");
      break;

    case "object":
      lines.push(`export const ${exportName} = {`);
      for (const icon of icons) {
        lines.push(`  ${pascalCase(icon.name)}: "${icon.name}",`);
      }
      lines.push("} as const;");
      lines.push("");
      lines.push(`export type ${exportName} = (typeof ${exportName})[keyof typeof ${exportName}];`);
      break;

    case "union":
    default:
      lines.push(`export type ${exportName} = ${icons.map((i) => `"${i.name}"`).join(" | ")};`);
      break;
  }

  lines.push("");

  // Icon metadata
  lines.push("export interface IconMetadata {");
  lines.push("  name: string;");
  lines.push("  width: number;");
  lines.push("  height: number;");
  lines.push("  viewBox: string;");
  lines.push("  style?: string;");
  lines.push("}");
  lines.push("");

  lines.push(`export const iconMetadata: Record<${exportName}, IconMetadata> = {`);
  for (const icon of icons) {
    lines.push(`  "${icon.name}": {`);
    lines.push(`    name: "${icon.name}",`);
    lines.push(`    width: ${icon.width},`);
    lines.push(`    height: ${icon.height},`);
    lines.push(`    viewBox: "${icon.viewBox}",`);
    if (icon.style) {
      lines.push(`    style: "${icon.style}",`);
    }
    lines.push("  },");
  }
  lines.push("};");

  return lines.join("\n");
}

function generateManifest(icons: IconData[]): string {
  const manifest = {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    count: icons.length,
    icons: icons.map((icon) => ({
      name: icon.name,
      path: icon.path,
      width: icon.width,
      height: icon.height,
      viewBox: icon.viewBox,
      style: icon.style,
    })),
  };

  return JSON.stringify(manifest, null, 2);
}

// ============================================================================
// Plugin
// ============================================================================

/**
 * Assets Plugin - Generates icon sprites, components, and utilities from design tokens
 *
 * @example
 * ```typescript
 * import { assetsPlugin } from '@design-sync/assets-plugin';
 *
 * export default {
 *   plugins: [
 *     assetsPlugin({
 *       sprite: true,
 *       components: { framework: 'react' },
 *       css: { utilityClasses: true },
 *       typescript: { enumStyle: 'union' },
 *     }),
 *   ],
 * };
 * ```
 */
export function assetsPlugin(config: AssetsPluginConfig = {}): ReturnType<typeof definePlugin> {
  const {
    outDir = "assets",
    sprite = true,
    components = false,
    css = true,
    typescript = true,
    manifest = false,
    filterByStyle,
    nameTransform,
  } = config;

  return definePlugin("assets-plugin", (context) => {
    const builder = createFileBuilder(outDir);

    // Collect all icon tokens
    const icons: IconData[] = [];

    context.query().forEach((token) => {
      if (token.type !== "icon") return;

      const normalized = normalizeIconValue(token.value, token.path);
      if (!isNormalizedIconValue(normalized)) return;

      // Filter by style if specified
      if (filterByStyle && normalized.style && !filterByStyle.includes(normalized.style)) {
        return;
      }

      // Transform name if provided
      const name = nameTransform
        ? nameTransform(normalized.name, normalized.style)
        : kebabCase(normalized.name);

      icons.push({
        name,
        path: token.path,
        svg: normalized.svg,
        width: normalized.width,
        height: normalized.height,
        style: normalized.style,
        viewBox: extractViewBox(normalized.svg, normalized.width, normalized.height),
      });
    });

    if (icons.length === 0) {
      console.warn("[assets-plugin] No icon tokens found");
      return builder.build();
    }

    // Sort icons by name
    icons.sort((a, b) => a.name.localeCompare(b.name));

    // Generate sprite
    const spriteConfig: SpriteConfig = typeof sprite === "object" ? sprite : {};
    const spriteFilename = spriteConfig.filename || "icons.svg";

    if (sprite) {
      builder.add(spriteFilename, generateSprite(icons, spriteConfig));
    }

    // Generate CSS
    if (css) {
      const cssConfig: CssConfig = typeof css === "object" ? css : {};
      const cssFilename = cssConfig.filename || "icons.css";
      builder.add(cssFilename, generateCss(icons, cssConfig, sprite ? spriteFilename : undefined));
    }

    // Generate TypeScript types
    if (typescript) {
      const tsConfig: TypeScriptConfig = typeof typescript === "object" ? typescript : {};
      builder.add("icons.ts", generateTypeScript(icons, tsConfig));
    }

    // Generate framework components
    if (components) {
      const compsConfig: ComponentsConfig = {
        framework: "react",
        generateIndex: true,
        ...(typeof components === "object" ? components : {}),
      };
      const compsDir = compsConfig.outDir || "components";

      for (const icon of icons) {
        const filename = kebabCase(icon.name);

        switch (compsConfig.framework) {
          case "react":
            builder.add(`${compsDir}/${filename}.tsx`, generateReactComponent(icon, compsConfig));
            break;
          case "vue":
            builder.add(`${compsDir}/${filename}.vue`, generateVueComponent(icon, compsConfig));
            break;
          case "solid":
            builder.add(`${compsDir}/${filename}.tsx`, generateSolidComponent(icon, compsConfig));
            break;
          case "svelte":
            builder.add(
              `${compsDir}/${filename}.svelte`,
              generateSvelteComponent(icon, compsConfig),
            );
            break;
          case "web-component":
            builder.add(`${compsDir}/${filename}.ts`, generateWebComponent(icon, compsConfig));
            break;
        }
      }

      // Generate index
      if (compsConfig.generateIndex) {
        const ext =
          compsConfig.framework === "vue" || compsConfig.framework === "svelte" ? "" : ".ts";
        builder.add(`${compsDir}/index${ext}`, generateComponentIndex(icons, compsConfig));
      }
    }

    // Generate manifest
    if (manifest) {
      builder.addJson("icons.json", JSON.parse(generateManifest(icons)));
    }

    return builder.build();
  });
}

export default assetsPlugin;
