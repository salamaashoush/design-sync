import { createFileBuilder, definePlugin, getModesToIterate } from "@design-sync/manager";
import { kebabCase } from "@design-sync/utils";
import {
  type ColorBlindnessType,
  type DocsData,
  type TokenDocEntry,
  type TokenDocGroup,
  buildTokenGroups,
  calculateStats,
  colorBlindnessMatrices,
  getContrastRatio,
  getTextColorForBackground,
  getWCAGLevel,
  groupTokensByType,
  parseColor,
  simulateColorBlindness,
  tokenToDocEntry,
} from "./types";

export interface DocsPluginConfig {
  /** Output directory for documentation files (relative to main out dir) */
  outDir?: string;
  /** Project name for documentation title */
  projectName?: string;
  /**
   * Generate Markdown documentation
   * @default true
   */
  markdown?: boolean | MarkdownOptions;
  /**
   * Generate interactive HTML documentation
   * @default true
   */
  html?: boolean | HtmlOptions;
  /**
   * Generate JSON data file for external tools
   * @default false
   */
  json?: boolean;
  /**
   * Include deprecated tokens
   * @default true
   */
  includeDeprecated?: boolean;
  /**
   * Include generated tokens
   * @default true
   */
  includeGenerated?: boolean;
  /**
   * Custom logo URL for HTML docs
   */
  logoUrl?: string;
  /**
   * Custom CSS for HTML docs
   */
  customCss?: string;
}

export interface MarkdownOptions {
  /** Single file or split by type */
  splitByType?: boolean;
  /** Include table of contents */
  includeToc?: boolean;
  /** Include token previews as HTML in markdown */
  includePreviews?: boolean;
}

export interface HtmlOptions {
  /** Page title */
  title?: string;
  /** Enable search functionality */
  enableSearch?: boolean;
  /** Enable mode switching */
  enableModeSwitch?: boolean;
  /** Enable copy to clipboard */
  enableCopy?: boolean;
  /** Show code examples */
  showExamples?: boolean;
  /** Primary color for the UI */
  primaryColor?: string;
  /** Show WCAG contrast ratios for colors */
  showContrastRatios?: boolean;
  /** Show color blindness simulation */
  showColorBlindness?: boolean;
  /** Show token hierarchy tree view */
  showHierarchyView?: boolean;
  /** Show side-by-side mode comparison for tokens with different values */
  showCompareMode?: boolean;
  /** Show Figma-style color palettes */
  showColorPalettes?: boolean;
  /** Show spacing visualization ruler */
  showSpacingRuler?: boolean;
  /** Enhanced typography preview */
  enhancedTypography?: boolean;
}

/**
 * Documentation Plugin - Generates interactive documentation for design tokens
 *
 * Creates:
 * - Markdown documentation with token tables and descriptions
 * - Interactive HTML page with live previews, search, and filtering
 * - JSON data file for integration with other tools
 *
 * @example
 * ```typescript
 * // design-sync.config.ts
 * import { docsPlugin } from '@design-sync/docs-plugin';
 *
 * export default {
 *   plugins: [docsPlugin({
 *     projectName: 'My Design System',
 *     markdown: { splitByType: true, includeToc: true },
 *     html: { enableSearch: true, enableModeSwitch: true },
 *     json: true
 *   })],
 * };
 * ```
 */
export function docsPlugin(config: DocsPluginConfig = {}): ReturnType<typeof definePlugin> {
  const {
    outDir = "docs",
    projectName = "Design Tokens",
    markdown = true,
    html = true,
    json = false,
    includeDeprecated = true,
    includeGenerated = true,
    logoUrl,
    customCss,
  } = config;

  return definePlugin("docs-plugin", (context) => {
    const { modes } = context;
    const builder = createFileBuilder(outDir);
    const allModes = getModesToIterate(modes);

    // Collect all tokens
    const tokens: TokenDocEntry[] = [];
    context.query().forEach((token) => {
      if (!includeDeprecated && token.isDeprecated) return;
      if (!includeGenerated && token.isGenerated) return;
      tokens.push(tokenToDocEntry(token, allModes));
    });

    // Build documentation data
    const docsData: DocsData = {
      projectName,
      generatedAt: new Date().toISOString(),
      modes: allModes,
      defaultMode: modes.defaultMode,
      tokens,
      tokensByType: groupTokensByType(tokens),
      groups: buildTokenGroups(tokens),
      stats: calculateStats(tokens),
    };

    // Generate Markdown
    if (markdown) {
      const mdOptions: MarkdownOptions =
        typeof markdown === "object" ? markdown : { splitByType: false, includeToc: true };

      if (mdOptions.splitByType) {
        // Generate separate files per type
        for (const [type, typeTokens] of Object.entries(docsData.tokensByType)) {
          builder.add(
            `${kebabCase(type)}.md`,
            generateMarkdownForType(type, typeTokens, docsData, mdOptions),
          );
        }
        // Generate index
        builder.add("README.md", generateMarkdownIndex(docsData, mdOptions));
      } else {
        // Generate single file
        builder.add("tokens.md", generateMarkdown(docsData, mdOptions));
      }
    }

    // Generate HTML
    if (html) {
      const htmlOptions: HtmlOptions =
        typeof html === "object"
          ? {
              title: projectName,
              enableSearch: true,
              enableModeSwitch: true,
              enableCopy: true,
              showExamples: true,
              showContrastRatios: true,
              showColorBlindness: true,
              showHierarchyView: true,
              showCompareMode: true,
              showColorPalettes: true,
              showSpacingRuler: true,
              enhancedTypography: true,
              ...html,
            }
          : {
              title: projectName,
              enableSearch: true,
              enableModeSwitch: true,
              enableCopy: true,
              showExamples: true,
              showContrastRatios: true,
              showColorBlindness: true,
              showHierarchyView: true,
              showCompareMode: true,
              showColorPalettes: true,
              showSpacingRuler: true,
              enhancedTypography: true,
            };

      builder.add("index.html", generateHtml(docsData, htmlOptions, logoUrl, customCss));
    }

    // Generate JSON
    if (json) {
      builder.addJson("tokens.json", docsData);
    }

    return builder.build();
  });
}

// ============================================================================
// Markdown Generation
// ============================================================================

function generateMarkdown(data: DocsData, options: MarkdownOptions): string {
  const lines: string[] = [];

  // Header
  lines.push(`# ${data.projectName}`);
  lines.push("");
  lines.push(`> Generated on ${new Date(data.generatedAt).toLocaleDateString()}`);
  lines.push("");

  // Stats
  lines.push("## Overview");
  lines.push("");
  lines.push(`- **Total Tokens:** ${data.stats.total}`);
  lines.push(`- **Token Types:** ${Object.keys(data.stats.byType).length}`);
  lines.push(`- **Available Modes:** ${data.modes.join(", ")}`);
  if (data.stats.deprecated > 0) {
    lines.push(`- **Deprecated:** ${data.stats.deprecated}`);
  }
  lines.push("");

  // Table of contents
  if (options.includeToc) {
    lines.push("## Table of Contents");
    lines.push("");
    for (const type of Object.keys(data.tokensByType).sort()) {
      const count = data.tokensByType[type].length;
      lines.push(`- [${formatTypeName(type)}](#${kebabCase(type)}) (${count})`);
    }
    lines.push("");
  }

  // Tokens by type
  for (const [type, tokens] of Object.entries(data.tokensByType).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    lines.push(`## ${formatTypeName(type)}`);
    lines.push("");
    lines.push(...generateTokenTable(tokens, data.modes, type, options));
    lines.push("");
  }

  return lines.join("\n");
}

function generateMarkdownIndex(data: DocsData, _options: MarkdownOptions): string {
  const lines: string[] = [];

  lines.push(`# ${data.projectName}`);
  lines.push("");
  lines.push(`> Generated on ${new Date(data.generatedAt).toLocaleDateString()}`);
  lines.push("");

  // Stats
  lines.push("## Overview");
  lines.push("");
  lines.push(`- **Total Tokens:** ${data.stats.total}`);
  lines.push(`- **Token Types:** ${Object.keys(data.stats.byType).length}`);
  lines.push(`- **Available Modes:** ${data.modes.join(", ")}`);
  lines.push("");

  // Links to type files
  lines.push("## Token Categories");
  lines.push("");
  for (const [type, tokens] of Object.entries(data.tokensByType).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    lines.push(`- [${formatTypeName(type)}](./${kebabCase(type)}.md) (${tokens.length} tokens)`);
  }
  lines.push("");

  return lines.join("\n");
}

function generateMarkdownForType(
  type: string,
  tokens: TokenDocEntry[],
  data: DocsData,
  options: MarkdownOptions,
): string {
  const lines: string[] = [];

  lines.push(`# ${formatTypeName(type)}`);
  lines.push("");
  lines.push(`[← Back to Index](./README.md)`);
  lines.push("");
  lines.push(`> ${tokens.length} tokens`);
  lines.push("");
  lines.push(...generateTokenTable(tokens, data.modes, type, options));

  return lines.join("\n");
}

function generateTokenTable(
  tokens: TokenDocEntry[],
  modes: string[],
  type: string,
  options: MarkdownOptions,
): string[] {
  const lines: string[] = [];

  // Add preview column for color tokens
  const showPreview = options.includePreviews && type === "color";

  // Table header
  const headers = showPreview
    ? ["Token", "Preview", "Value", ...modes.slice(1)]
    : ["Token", "Value", ...modes.slice(1)];

  lines.push(`| ${headers.join(" | ")} |`);
  lines.push(`| ${headers.map(() => "---").join(" | ")} |`);

  // Table rows
  for (const token of tokens.sort((a, b) => a.path.localeCompare(b.path))) {
    const name = token.isDeprecated ? `~~\`${token.path}\`~~` : `\`${token.path}\``;
    const description = token.description ? ` <br><small>${token.description}</small>` : "";
    const defaultValue = `\`${token.modeValues[modes[0]]}\``;

    const cells = [name + description];

    if (showPreview) {
      cells.push(
        `<span style="display:inline-block;width:20px;height:20px;background:${token.modeValues[modes[0]]};border-radius:4px;border:1px solid #ccc"></span>`,
      );
    }

    cells.push(defaultValue);

    // Mode values
    for (let i = 1; i < modes.length; i++) {
      const modeValue = token.modeValues[modes[i]];
      cells.push(modeValue !== token.modeValues[modes[0]] ? `\`${modeValue}\`` : "-");
    }

    lines.push(`| ${cells.join(" | ")} |`);
  }

  return lines;
}

function formatTypeName(type: string): string {
  const names: Record<string, string> = {
    color: "Colors",
    dimension: "Dimensions",
    fontFamily: "Font Families",
    fontWeight: "Font Weights",
    duration: "Durations",
    cubicBezier: "Easing Functions",
    shadow: "Shadows",
    border: "Borders",
    gradient: "Gradients",
    typography: "Typography",
    transition: "Transitions",
    number: "Numbers",
    strokeStyle: "Stroke Styles",
  };
  return names[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

// ============================================================================
// HTML Generation
// ============================================================================

function generateHtml(
  data: DocsData,
  options: HtmlOptions,
  logoUrl?: string,
  customCss?: string,
): string {
  const title = options.title || data.projectName;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
${getBaseStyles(options.primaryColor)}
${getEnhancedStyles(options)}
${customCss || ""}
  </style>
</head>
<body>
  <div class="app">
    <header class="header">
      <div class="header-left">
        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="logo">` : ""}
        <h1>${title}</h1>
      </div>
      <div class="header-right">
        ${options.showCompareMode && data.modes.length > 1 ? generateCompareToggle() : ""}
        ${options.showColorBlindness ? generateColorBlindnessSelector() : ""}
        ${options.enableModeSwitch ? generateModeSwitch(data.modes, data.defaultMode) : ""}
        ${generateThemeToggle()}
      </div>
    </header>

    <nav class="sidebar">
      ${options.enableSearch ? generateSearchBox() : ""}
      <div class="stats">
        <div class="stat">
          <span class="stat-value">${data.stats.total}</span>
          <span class="stat-label">Tokens</span>
        </div>
        <div class="stat">
          <span class="stat-value">${Object.keys(data.stats.byType).length}</span>
          <span class="stat-label">Types</span>
        </div>
      </div>

      ${options.showHierarchyView ? generateViewToggle() : ""}

      <nav class="type-nav" id="type-nav">
        ${Object.entries(data.tokensByType)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(
            ([type, tokens]) => `
          <a href="#${kebabCase(type)}" class="type-link" data-type="${type}">
            <span class="type-icon">${getTypeIcon(type)}</span>
            <span class="type-name">${formatTypeName(type)}</span>
            <span class="type-count">${tokens.length}</span>
          </a>
        `,
          )
          .join("")}
      </nav>

      ${options.showHierarchyView ? generateHierarchyNav(data.groups) : ""}
    </nav>

    <main class="content" id="main-content">
      ${options.showColorPalettes && data.tokensByType.color ? generateColorPalettes(data.tokensByType.color, data.modes, options) : ""}
      ${generateTokenSections(data, options)}
    </main>
  </div>

  <script>
${getInteractiveScript(options, data)}
${getEnhancedScript(options, data)}
  </script>
</body>
</html>`;
}

function generateModeSwitch(modes: string[], defaultMode: string): string {
  return `
    <div class="mode-switch">
      <label>Mode:</label>
      <select id="mode-select">
        ${modes.map((mode) => `<option value="${mode}" ${mode === defaultMode ? "selected" : ""}>${mode}</option>`).join("")}
      </select>
    </div>
  `;
}

function generateSearchBox(): string {
  return `
    <div class="search-box">
      <input type="text" id="search-input" placeholder="Search tokens..." />
      <span class="search-icon">🔍</span>
    </div>
  `;
}

function generateTokenSections(data: DocsData, options: HtmlOptions): string {
  return Object.entries(data.tokensByType)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([type, tokens]) => `
      <section id="${kebabCase(type)}" class="token-section" data-type="${type}">
        <h2 class="section-title">
          <span class="section-icon">${getTypeIcon(type)}</span>
          ${formatTypeName(type)}
          <span class="section-count">${tokens.length}</span>
        </h2>
        <div class="token-grid ${type === "color" ? "color-grid" : ""}">
          ${tokens
            .sort((a, b) => a.path.localeCompare(b.path))
            .map((token) => generateTokenCard(token, type, data.modes, options))
            .join("")}
        </div>
      </section>
    `,
    )
    .join("");
}

function generateTokenCard(
  token: TokenDocEntry,
  type: string,
  modes: string[],
  options: HtmlOptions,
): string {
  const preview = getTokenPreview(token, type);
  const deprecatedClass = token.isDeprecated ? "deprecated" : "";
  const generatedBadge = token.isGenerated ? `<span class="badge generated">Generated</span>` : "";
  const deprecatedBadge = token.isDeprecated
    ? `<span class="badge deprecated">Deprecated</span>`
    : "";

  const modeValuesData = JSON.stringify(token.modeValues).replace(/"/g, "&quot;");
  const displayValue = formatDisplayValue(token.cssValue, type);
  // Escape HTML attributes for the raw value (used for copy button)
  const rawValueAttr = token.cssValue.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Check if values differ between modes (for compare mode)
  const hasDifferentModeValues = modes.length > 1 &&
    Object.values(token.modeValues).some((v, _, arr) => v !== arr[0]);

  // Generate comparison preview HTML if values differ
  const comparisonPreview = hasDifferentModeValues && modes.length >= 2
    ? generateComparisonPreview(token, type, modes)
    : "";

  return `
    <div class="token-card ${deprecatedClass}${hasDifferentModeValues ? " has-mode-diff" : ""}" data-path="${token.path}" data-mode-values="${modeValuesData}" data-type="${type}">
      ${preview ? `<div class="token-preview token-preview-single" data-type="${type}">${preview}</div>` : ""}
      ${comparisonPreview}
      <div class="token-info">
        <div class="token-header">
          <code class="token-path">${token.path}</code>
          ${options.enableCopy ? `<button class="copy-btn" data-value="${token.path}" title="Copy path">📋</button>` : ""}
        </div>
        <div class="token-badges">
          ${generatedBadge}
          ${deprecatedBadge}
        </div>
        ${token.description ? `<p class="token-description">${token.description}</p>` : ""}
        <div class="token-value">
          <span class="value-label">Value:</span>
          <code class="value-code" data-default="${rawValueAttr}">${displayValue}</code>
          ${options.enableCopy ? `<button class="copy-btn" data-value="${rawValueAttr}" title="Copy value">📋</button>` : ""}
        </div>
        ${
          options.showExamples
            ? `
        <details class="token-examples">
          <summary>Usage Examples</summary>
          <div class="example-code">
            <div class="example">
              <span class="example-label">CSS Variable:</span>
              <code>var(--${token.path.replace(/\./g, "-")})</code>
            </div>
            <div class="example">
              <span class="example-label">JavaScript:</span>
              <code>tokens.${token.path}</code>
            </div>
          </div>
        </details>
        `
            : ""
        }
      </div>
    </div>
  `;
}

function generateComparisonPreview(token: TokenDocEntry, type: string, modes: string[]): string {
  const lightMode = modes[0];
  const darkMode = modes.find(m => m.toLowerCase().includes('dark')) || modes[1];

  const lightValue = token.modeValues[lightMode];
  const darkValue = token.modeValues[darkMode];

  const lightPreview = getPreviewForValue(type, lightValue);
  const darkPreview = getPreviewForValue(type, darkValue);

  return `
    <div class="token-preview-compare" data-type="${type}">
      <div class="compare-side compare-light">
        <span class="compare-label">☀️ ${lightMode}</span>
        <div class="compare-preview">${lightPreview}</div>
      </div>
      <div class="compare-side compare-dark">
        <span class="compare-label">🌙 ${darkMode}</span>
        <div class="compare-preview">${darkPreview}</div>
      </div>
    </div>
  `;
}

function getPreviewForValue(type: string, value: string): string {
  switch (type) {
    case "color":
      return `<div class="color-preview" style="background: ${value}"></div>`;
    case "shadow":
      return `<div class="shadow-preview" style="box-shadow: ${value}"></div>`;
    case "gradient":
      return `<div class="gradient-preview" style="background: ${value}"></div>`;
    case "dimension":
      return `<div class="dimension-value">${value}</div>`;
    default:
      return `<span class="preview-value">${value}</span>`;
  }
}

function getTokenPreview(token: TokenDocEntry, type: string): string {
  switch (type) {
    case "color":
      return `<div class="color-preview" style="background: ${token.cssValue}"></div>`;
    case "shadow":
      return `<div class="shadow-preview" style="box-shadow: ${token.cssValue}"></div>`;
    case "gradient":
      return `<div class="gradient-preview" style="background: ${token.cssValue}"></div>`;
    case "border":
      return `<div class="border-preview" style="border: ${token.cssValue}"></div>`;
    case "dimension": {
      const dimInfo = parseDimensionValue(token.cssValue);
      // For small values, show actual size visualization
      if (dimInfo.unit === 'px' && dimInfo.numeric <= 20) {
        return `<div class="dimension-preview dimension-small">
          <div class="dimension-thickness" style="height: ${Math.max(1, dimInfo.numeric)}px"></div>
          <div class="dimension-value">${token.cssValue}</div>
        </div>`;
      }
      // For larger values, just show the value prominently
      return `<div class="dimension-preview dimension-large">
        <div class="dimension-value">${token.cssValue}</div>
      </div>`;
    }
    case "fontFamily":
      return `<div class="font-preview" style="font-family: ${token.cssValue}">Aa</div>`;
    case "fontWeight":
      return `<div class="fontweight-preview" style="font-weight: ${token.cssValue}">Aa</div>`;
    case "typography":
      return `<div class="typography-preview">The quick brown fox</div>`;
    case "duration":
      return `<div class="duration-preview" data-duration="${token.cssValue}"><div class="duration-dot"></div></div>`;
    case "cubicBezier":
      return `<div class="easing-preview" data-easing="${token.cssValue}"><div class="easing-dot"></div></div>`;
    case "icon": {
      // Try to get the SVG from extensions first
      if (token.extensions?.svg && typeof token.extensions.svg === "string") {
        return `<div class="icon-preview icon-preview-svg">${token.extensions.svg}</div>`;
      }
      // Extract SVG from data URL if available
      const svgContent = extractSvgFromDataUrl(token.cssValue);
      if (svgContent) {
        return `<div class="icon-preview icon-preview-svg">${svgContent}</div>`;
      }
      return `<div class="icon-preview icon-preview-empty">🖼️</div>`;
    }
    case "asset":
      if (token.cssValue && token.cssValue.startsWith('url(')) {
        return `<div class="asset-preview" style="background-image: ${token.cssValue}"></div>`;
      }
      return `<div class="asset-preview">📎</div>`;
    default:
      return "";
  }
}

/**
 * Extract SVG content from a data URL
 */
function extractSvgFromDataUrl(cssValue: string): string | null {
  if (!cssValue || !cssValue.startsWith('url(')) return null;

  // Extract the data URL from url("...")
  const match = cssValue.match(/url\(["']?(data:image\/svg\+xml[^"')]+)["']?\)/);
  if (!match) return null;

  const dataUrl = match[1];

  // Handle URL-encoded SVG
  if (dataUrl.startsWith('data:image/svg+xml,')) {
    const encoded = dataUrl.replace('data:image/svg+xml,', '');
    try {
      return decodeURIComponent(encoded);
    } catch {
      return null;
    }
  }

  // Handle base64-encoded SVG
  if (dataUrl.startsWith('data:image/svg+xml;base64,')) {
    const base64 = dataUrl.replace('data:image/svg+xml;base64,', '');
    try {
      // Use Buffer for Node.js compatibility
      return Buffer.from(base64, 'base64').toString('utf-8');
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Parse a dimension value and return info for visualization
 */
function parseDimensionValue(value: string): { numeric: number; unit: string; percentage: number } {
  const match = value.match(/^(-?[\d.]+)(px|rem|em|%|vw|vh|ch|ex|pt|cm|mm|in)?$/);
  if (!match) {
    return { numeric: 0, unit: '', percentage: 0 };
  }

  const numeric = parseFloat(match[1]);
  const unit = match[2] || '';

  // Convert to a reasonable percentage for display (0-100%)
  // Use different scales for different units/ranges
  let percentage: number;

  if (unit === 'px') {
    // For pixels: 0-20px maps to 0-100% (small values like border-width)
    // Clamp at 100% for values > 20px
    if (numeric <= 20) {
      percentage = (numeric / 20) * 100;
    } else {
      // For larger px values, use logarithmic scale
      percentage = Math.min(100, 50 + Math.log10(numeric / 20) * 30);
    }
  } else if (unit === 'rem' || unit === 'em') {
    // For rem/em: use logarithmic scale
    // 0.25rem = ~10%, 1rem = ~30%, 4rem = ~60%, 16rem = ~80%, 64rem+ = ~100%
    if (numeric <= 0) {
      percentage = 0;
    } else {
      percentage = Math.min(100, Math.max(5, 20 + Math.log2(numeric + 1) * 15));
    }
  } else if (unit === '%' || unit === 'vw' || unit === 'vh') {
    // For percentages and viewport units, use directly (capped at 100)
    percentage = Math.min(100, Math.max(0, numeric));
  } else {
    // Default: assume small value, scale linearly up to 100
    percentage = Math.min(100, Math.max(5, numeric * 10));
  }

  return { numeric, unit, percentage };
}

/**
 * Format display value for tokens (truncate for icons/assets)
 */
function formatDisplayValue(value: string, type: string): string {
  if (type === "icon" || type === "asset") {
    if (value.startsWith('url(')) {
      // Show a shortened indicator instead of the full data URL
      return `[${type} data URL]`;
    }
  }
  // Truncate very long values
  if (value.length > 100) {
    return value.slice(0, 97) + "...";
  }
  return value;
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    color: "🎨",
    dimension: "📏",
    fontFamily: "🔤",
    fontWeight: "💪",
    duration: "⏱️",
    cubicBezier: "📈",
    shadow: "🌑",
    border: "🔲",
    gradient: "🌈",
    typography: "📝",
    transition: "🔄",
    number: "🔢",
    strokeStyle: "✏️",
    icon: "🖼️",
    asset: "📎",
  };
  return icons[type] || "📦";
}

function getBaseStyles(primaryColor = "#6366f1"): string {
  return `
    :root {
      --primary: ${primaryColor};
      --primary-light: ${primaryColor}20;
      --bg: #f8fafc;
      --bg-secondary: #f1f5f9;
      --text: #1e293b;
      --text-secondary: #64748b;
      --border: #e2e8f0;
      --shadow: 0 1px 3px rgba(0,0,0,0.1);
      --radius: 8px;
    }

    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        --bg: #0f172a;
        --bg-secondary: #1e293b;
        --text: #f1f5f9;
        --text-secondary: #94a3b8;
        --border: #334155;
      }
    }

    [data-theme="dark"] {
      --bg: #0f172a;
      --bg-secondary: #1e293b;
      --text: #f1f5f9;
      --text-secondary: #94a3b8;
      --border: #334155;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }

    .app {
      display: grid;
      grid-template-columns: 280px 1fr;
      grid-template-rows: auto 1fr;
      min-height: 100vh;
    }

    .header {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo {
      height: 40px;
    }

    .header h1 {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .mode-switch {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .mode-switch select {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg);
      color: var(--text);
      font-size: 0.875rem;
    }

    .sidebar {
      background: var(--bg-secondary);
      border-right: 1px solid var(--border);
      padding: 1rem;
      overflow-y: auto;
      position: sticky;
      top: 65px;
      height: calc(100vh - 65px);
    }

    .search-box {
      position: relative;
      margin-bottom: 1rem;
    }

    .search-box input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg);
      color: var(--text);
      font-size: 0.875rem;
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.5;
    }

    .stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 1rem;
      background: var(--bg);
      border-radius: var(--radius);
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary);
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .type-nav {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .type-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border-radius: var(--radius);
      text-decoration: none;
      color: var(--text);
      transition: background 0.15s;
    }

    .type-link:hover {
      background: var(--primary-light);
    }

    .type-link.active {
      background: var(--primary);
      color: white;
    }

    .type-count {
      margin-left: auto;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .content {
      padding: 2rem;
      overflow-y: auto;
    }

    .token-section {
      margin-bottom: 3rem;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--border);
    }

    .section-count {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 400;
    }

    .token-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1rem;
    }

    .token-grid.color-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }

    .token-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      transition: box-shadow 0.15s;
    }

    .token-card:hover {
      box-shadow: var(--shadow);
    }

    .token-card.deprecated {
      opacity: 0.6;
    }

    .token-preview {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
    }

    .color-preview {
      width: 100%;
      height: 100%;
      border-radius: 0;
    }

    .shadow-preview {
      width: 60px;
      height: 60px;
      background: var(--bg);
      border-radius: var(--radius);
    }

    .gradient-preview {
      width: 100%;
      height: 100%;
    }

    .border-preview {
      width: 60px;
      height: 60px;
      background: transparent;
      border-radius: var(--radius);
    }

    .dimension-preview {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
    }

    .dimension-value {
      font-family: ui-monospace, monospace;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text);
    }

    .dimension-small .dimension-thickness {
      width: 80%;
      background: var(--primary);
      border-radius: 1px;
      min-height: 1px;
    }

    .dimension-large .dimension-value {
      font-size: 1.5rem;
    }

    .font-preview, .fontweight-preview {
      font-size: 2rem;
    }

    .typography-preview {
      font-size: 0.875rem;
      padding: 0.5rem;
    }

    .icon-preview {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      /* Set a color context for currentColor SVGs */
      color: var(--text);
      /* Checkerboard background for transparency */
      background-image:
        linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(-45deg, #ccc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(-45deg, transparent 75%, #ccc 75%);
      background-size: 8px 8px;
      background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
      background-color: #fff;
      border-radius: 4px;
    }

    .icon-preview-svg {
      background: none;
      background-color: transparent;
    }

    .icon-preview-svg svg {
      width: 100%;
      height: 100%;
      max-width: 48px;
      max-height: 48px;
    }

    .icon-preview-empty {
      font-size: 24px;
      opacity: 0.5;
      background: none;
    }

    /* Icon grid layout for icon type */
    .token-grid[class*="icon"] .token-card,
    .token-section[data-type="icon"] .token-card {
      min-height: auto;
    }

    .token-section[data-type="icon"] .token-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }

    .token-section[data-type="icon"] .token-preview {
      height: 64px;
      padding: 8px;
    }

    .asset-preview {
      width: 60px;
      height: 60px;
      background-size: cover;
      background-position: center;
      border-radius: var(--radius);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .duration-preview, .easing-preview {
      width: 100%;
      height: 40px;
      position: relative;
    }

    .duration-dot, .easing-dot {
      width: 12px;
      height: 12px;
      background: var(--primary);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }

    .token-info {
      padding: 1rem;
    }

    .token-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .token-path {
      font-size: 0.75rem;
      font-weight: 600;
      word-break: break-all;
    }

    .copy-btn {
      background: none;
      border: none;
      cursor: pointer;
      opacity: 0.5;
      transition: opacity 0.15s;
      font-size: 0.875rem;
    }

    .copy-btn:hover {
      opacity: 1;
    }

    .token-badges {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .badge {
      font-size: 0.625rem;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      text-transform: uppercase;
      font-weight: 600;
    }

    .badge.generated {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge.deprecated {
      background: #fef3c7;
      color: #92400e;
    }

    .token-description {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .token-value {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .value-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .value-code {
      font-size: 0.75rem;
      background: var(--bg);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      word-break: break-all;
    }

    .token-examples {
      margin-top: 0.75rem;
    }

    .token-examples summary {
      font-size: 0.75rem;
      color: var(--text-secondary);
      cursor: pointer;
    }

    .example-code {
      margin-top: 0.5rem;
      background: var(--bg);
      padding: 0.75rem;
      border-radius: var(--radius);
    }

    .example {
      margin-bottom: 0.5rem;
    }

    .example:last-child {
      margin-bottom: 0;
    }

    .example-label {
      font-size: 0.625rem;
      color: var(--text-secondary);
      display: block;
      margin-bottom: 0.25rem;
    }

    .example code {
      font-size: 0.75rem;
      word-break: break-all;
    }

    .hidden {
      display: none !important;
    }

    @media (max-width: 768px) {
      .app {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: relative;
        top: 0;
        height: auto;
        border-right: none;
        border-bottom: 1px solid var(--border);
      }

      .type-nav {
        flex-direction: row;
        flex-wrap: wrap;
      }

      .type-link {
        padding: 0.5rem 0.75rem;
      }
    }
  `;
}

function getInteractiveScript(options: HtmlOptions, data: DocsData): string {
  return `
    (function() {
      const modes = ${JSON.stringify(data.modes)};
      const defaultMode = "${data.defaultMode}";
      let currentMode = defaultMode;

      // Theme toggle (docs UI dark/light)
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) {
        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem('docs-theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', initialTheme);

        themeToggle.addEventListener('click', () => {
          const current = document.documentElement.getAttribute('data-theme');
          const next = current === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', next);
          localStorage.setItem('docs-theme', next);
        });
      }

      // Compare mode toggle
      const compareToggle = document.getElementById('compare-toggle');
      if (compareToggle) {
        compareToggle.addEventListener('click', () => {
          compareToggle.classList.toggle('active');
          document.body.classList.toggle('compare-mode');
        });
      }

      // Mode switching
      ${
        options.enableModeSwitch
          ? `
      const modeSelect = document.getElementById('mode-select');
      if (modeSelect) {
        modeSelect.addEventListener('change', (e) => {
          currentMode = e.target.value;
          updateTokenValues();
          updatePreviews();
        });
      }
      `
          : ""
      }

      // Search functionality
      ${
        options.enableSearch
          ? `
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase();
          const cards = document.querySelectorAll('.token-card');

          cards.forEach(card => {
            const path = card.dataset.path.toLowerCase();
            const visible = !query || path.includes(query);
            card.classList.toggle('hidden', !visible);
          });

          // Hide empty sections
          document.querySelectorAll('.token-section').forEach(section => {
            const visibleCards = section.querySelectorAll('.token-card:not(.hidden)');
            section.classList.toggle('hidden', visibleCards.length === 0);
          });
        });
      }
      `
          : ""
      }

      // Copy to clipboard
      ${
        options.enableCopy
          ? `
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const value = e.target.dataset.value;
          try {
            await navigator.clipboard.writeText(value);
            const original = e.target.textContent;
            e.target.textContent = '✓';
            setTimeout(() => e.target.textContent = original, 1000);
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        });
      });
      `
          : ""
      }

      // Update token values based on mode
      function updateTokenValues() {
        document.querySelectorAll('.token-card').forEach(card => {
          const modeValues = JSON.parse(card.dataset.modeValues);
          const valueCode = card.querySelector('.value-code');
          if (valueCode && modeValues[currentMode]) {
            valueCode.textContent = modeValues[currentMode];
            valueCode.closest('.token-value').querySelector('.copy-btn[data-value]')?.setAttribute('data-value', modeValues[currentMode]);
          }
        });
      }

      // Update previews based on mode
      function updatePreviews() {
        document.querySelectorAll('.token-card').forEach(card => {
          const modeValues = JSON.parse(card.dataset.modeValues);
          const value = modeValues[currentMode];
          const preview = card.querySelector('.token-preview');
          if (!preview) return;

          const type = preview.dataset.type;
          const previewEl = preview.firstElementChild;
          if (!previewEl) return;

          switch (type) {
            case 'color':
              previewEl.style.background = value;
              break;
            case 'shadow':
              previewEl.style.boxShadow = value;
              break;
            case 'gradient':
              previewEl.style.background = value;
              break;
            case 'border':
              previewEl.style.border = value;
              break;
          }
        });
      }

      // Smooth scroll to sections
      document.querySelectorAll('.type-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(link.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }

          // Update active state
          document.querySelectorAll('.type-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        });
      });

      // Animate duration/easing previews
      function animatePreviews() {
        document.querySelectorAll('.duration-preview').forEach(preview => {
          const duration = preview.dataset.duration || '1s';
          const dot = preview.querySelector('.duration-dot');
          if (dot) {
            dot.animate([
              { left: '0%' },
              { left: 'calc(100% - 12px)' }
            ], {
              duration: parseFloat(duration) * (duration.includes('ms') ? 1 : 1000),
              iterations: Infinity,
              direction: 'alternate',
              easing: 'linear'
            });
          }
        });

        document.querySelectorAll('.easing-preview').forEach(preview => {
          const easing = preview.dataset.easing || 'ease';
          const dot = preview.querySelector('.easing-dot');
          if (dot) {
            dot.animate([
              { left: '0%' },
              { left: 'calc(100% - 12px)' }
            ], {
              duration: 1500,
              iterations: Infinity,
              direction: 'alternate',
              easing: easing
            });
          }
        });
      }

      animatePreviews();
    })();
  `;
}

// ============================================================================
// Enhanced UI Components
// ============================================================================

function generateThemeToggle(): string {
  return `
    <button class="theme-toggle" id="theme-toggle" title="Toggle dark/light mode" aria-label="Toggle dark/light mode">
      <span class="theme-icon-light">☀️</span>
      <span class="theme-icon-dark">🌙</span>
    </button>
  `;
}

function generateCompareToggle(): string {
  return `
    <button class="compare-toggle" id="compare-toggle" title="Compare modes side by side">
      <span class="compare-icon">⚡</span>
      <span class="compare-text">Compare</span>
    </button>
  `;
}

function generateColorBlindnessSelector(): string {
  return `
    <div class="colorblind-selector">
      <label>Vision:</label>
      <select id="colorblind-select">
        <option value="normal">Normal</option>
        <option value="protanopia">Protanopia (Red-blind)</option>
        <option value="deuteranopia">Deuteranopia (Green-blind)</option>
        <option value="tritanopia">Tritanopia (Blue-blind)</option>
        <option value="achromatopsia">Achromatopsia (Monochrome)</option>
      </select>
    </div>
  `;
}

function generateViewToggle(): string {
  return `
    <div class="view-toggle">
      <button class="view-btn active" data-view="type" title="View by Type">
        <span>📋</span> By Type
      </button>
      <button class="view-btn" data-view="hierarchy" title="View by Hierarchy">
        <span>🌳</span> Tree
      </button>
    </div>
  `;
}

function generateHierarchyNav(groups: TokenDocGroup[]): string {
  const renderGroup = (group: TokenDocGroup, depth = 0): string => {
    const indent = depth * 12;
    const hasTokens = group.tokens.length > 0;
    const hasSubgroups = group.subgroups.length > 0;

    let html = `
      <div class="hierarchy-item" style="padding-left: ${indent}px">
        <span class="hierarchy-toggle ${hasSubgroups ? "expandable" : ""}" data-path="${group.path}">
          ${hasSubgroups ? "▶" : "•"}
        </span>
        <a href="#group-${kebabCase(group.path)}" class="hierarchy-link">
          <span class="hierarchy-name">${group.name}</span>
          ${hasTokens ? `<span class="hierarchy-count">${group.tokens.length}</span>` : ""}
        </a>
      </div>
    `;

    if (hasSubgroups) {
      html += `<div class="hierarchy-children hidden" data-parent="${group.path}">`;
      for (const sub of group.subgroups) {
        html += renderGroup(sub, depth + 1);
      }
      html += `</div>`;
    }

    return html;
  };

  return `
    <nav class="hierarchy-nav hidden" id="hierarchy-nav">
      ${groups.map((g) => renderGroup(g)).join("")}
    </nav>
  `;
}

function generateColorPalettes(colorTokens: TokenDocEntry[], modes: string[], options: HtmlOptions): string {
  // Group colors by common prefixes to create palettes
  const palettes = new Map<string, TokenDocEntry[]>();

  for (const token of colorTokens) {
    const parts = token.path.split(".");
    // Use first 2 parts as palette key
    const paletteKey = parts.slice(0, Math.min(2, parts.length - 1)).join(".");
    if (!palettes.has(paletteKey)) {
      palettes.set(paletteKey, []);
    }
    palettes.get(paletteKey)!.push(token);
  }

  // Only show palettes with 3+ colors
  const significantPalettes = Array.from(palettes.entries())
    .filter(([, tokens]) => tokens.length >= 3)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 6);

  if (significantPalettes.length === 0) return "";

  return `
    <section class="color-palettes-section" id="color-palettes">
      <h2 class="section-title">
        <span class="section-icon">🎨</span>
        Color Palettes
      </h2>
      <div class="palettes-grid">
        ${significantPalettes
          .map(
            ([name, tokens]) => `
          <div class="palette-card">
            <h3 class="palette-name">${name || "Colors"}</h3>
            <div class="palette-swatches">
              ${tokens
                .slice(0, 8)
                .map((t) => {
                  const textColor = getTextColorForBackground(t.cssValue);
                  return `
                  <div class="palette-swatch"
                       style="background: ${t.cssValue}"
                       title="${t.path}: ${t.cssValue}"
                       data-color="${t.cssValue}"
                       data-path="${t.path}">
                    <span class="swatch-name ${textColor}">${t.name}</span>
                  </div>
                `;
                })
                .join("")}
            </div>
            ${tokens.length > 8 ? `<span class="palette-more">+${tokens.length - 8} more</span>` : ""}
          </div>
        `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function getEnhancedStyles(options: HtmlOptions): string {
  return `
    /* Enhanced UI Styles */

    /* Header controls */
    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    /* Theme Toggle */
    .theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg);
      cursor: pointer;
      font-size: 1.25rem;
      transition: all 0.2s;
    }

    .theme-toggle:hover {
      background: var(--primary-light);
      border-color: var(--primary);
    }

    .theme-icon-dark { display: none; }
    .theme-icon-light { display: block; }

    [data-theme="dark"] .theme-icon-dark { display: block; }
    [data-theme="dark"] .theme-icon-light { display: none; }

    /* Compare Toggle */
    .compare-toggle {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg);
      color: var(--text);
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .compare-toggle:hover {
      background: var(--primary-light);
      border-color: var(--primary);
    }

    .compare-toggle.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    /* Comparison Preview */
    .token-preview-compare {
      display: none;
      grid-template-columns: 1fr 1fr;
      height: 100%;
    }

    /* Only hide single preview for tokens that HAVE a compare preview */
    .compare-mode .has-mode-diff .token-preview-single {
      display: none !important;
    }

    .compare-mode .has-mode-diff .token-preview-compare {
      display: grid;
    }

    .compare-side {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .compare-light {
      background: #f8fafc;
    }

    .compare-dark {
      background: #1e293b;
    }

    .compare-label {
      position: absolute;
      top: 4px;
      left: 4px;
      font-size: 0.625rem;
      padding: 2px 6px;
      border-radius: 4px;
      z-index: 1;
    }

    .compare-light .compare-label {
      background: rgba(0,0,0,0.1);
      color: #1e293b;
    }

    .compare-dark .compare-label {
      background: rgba(255,255,255,0.1);
      color: #f1f5f9;
    }

    .compare-preview {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
    }

    .compare-preview .color-preview {
      width: 100%;
      height: 100%;
      border-radius: 0;
    }

    .compare-preview .dimension-value {
      font-size: 0.875rem;
    }

    .compare-preview .preview-value {
      font-size: 0.75rem;
      font-family: monospace;
      word-break: break-all;
      text-align: center;
    }

    .compare-light .preview-value {
      color: #1e293b;
    }

    .compare-dark .preview-value {
      color: #f1f5f9;
    }

    .colorblind-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .colorblind-selector select {
      padding: 0.5rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg);
      color: var(--text);
      font-size: 0.75rem;
    }

    /* View Toggle */
    .view-toggle {
      display: flex;
      gap: 0.25rem;
      margin-bottom: 1rem;
      padding: 0.25rem;
      background: var(--bg);
      border-radius: var(--radius);
    }

    .view-btn {
      flex: 1;
      padding: 0.5rem;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      border-radius: calc(var(--radius) - 2px);
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      transition: all 0.15s;
    }

    .view-btn:hover {
      background: var(--primary-light);
    }

    .view-btn.active {
      background: var(--primary);
      color: white;
    }

    /* Hierarchy Navigation */
    .hierarchy-nav {
      max-height: 400px;
      overflow-y: auto;
    }

    .hierarchy-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0;
    }

    .hierarchy-toggle {
      width: 16px;
      cursor: pointer;
      user-select: none;
      font-size: 0.625rem;
      color: var(--text-secondary);
    }

    .hierarchy-toggle.expandable:hover {
      color: var(--primary);
    }

    .hierarchy-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--text);
      font-size: 0.75rem;
    }

    .hierarchy-link:hover {
      color: var(--primary);
    }

    .hierarchy-count {
      font-size: 0.625rem;
      color: var(--text-secondary);
    }

    .hierarchy-children {
      border-left: 1px solid var(--border);
      margin-left: 8px;
    }

    /* Color Palettes */
    .color-palettes-section {
      margin-bottom: 3rem;
    }

    .palettes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .palette-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1rem;
    }

    .palette-name {
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .palette-swatches {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      border-radius: var(--radius);
      overflow: hidden;
    }

    .palette-swatch {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.15s;
    }

    .palette-swatch:hover {
      transform: scale(1.1);
      z-index: 1;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .swatch-name {
      font-size: 0.5rem;
      font-weight: 600;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-width: 90%;
    }

    .swatch-name.light { color: white; }
    .swatch-name.dark { color: #1e293b; }

    .palette-more {
      display: block;
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    /* Enhanced Color Preview with WCAG */
    .color-card-enhanced {
      display: flex;
      flex-direction: column;
    }

    .color-preview-enhanced {
      height: 100px;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .color-main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .color-info-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.5rem;
      background: rgba(0,0,0,0.5);
      color: white;
      font-size: 0.625rem;
      display: flex;
      justify-content: space-between;
    }

    .wcag-badge {
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.625rem;
    }

    .wcag-badge.aaa { background: #22c55e; color: white; }
    .wcag-badge.aa { background: #eab308; color: black; }
    .wcag-badge.fail { background: #ef4444; color: white; }

    .contrast-ratio {
      font-family: monospace;
    }

    /* Color Blindness Simulation */
    .colorblind-protanopia .color-preview,
    .colorblind-protanopia .palette-swatch {
      filter: url('#protanopia-filter');
    }

    .colorblind-deuteranopia .color-preview,
    .colorblind-deuteranopia .palette-swatch {
      filter: url('#deuteranopia-filter');
    }

    .colorblind-tritanopia .color-preview,
    .colorblind-tritanopia .palette-swatch {
      filter: url('#tritanopia-filter');
    }

    .colorblind-achromatopsia .color-preview,
    .colorblind-achromatopsia .palette-swatch {
      filter: grayscale(100%);
    }

    /* Enhanced Typography Preview */
    .typography-preview-enhanced {
      padding: 1rem;
      background: var(--bg);
      min-height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .typography-sample {
      margin-bottom: 0.5rem;
    }

    .typography-metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.625rem;
      color: var(--text-secondary);
    }

    .metric {
      background: var(--bg-secondary);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    /* Spacing Ruler */
    .spacing-preview-enhanced {
      padding: 1rem;
      background: var(--bg);
    }

    .spacing-ruler {
      position: relative;
      height: 40px;
      background: linear-gradient(90deg, var(--primary) var(--spacing-width), transparent var(--spacing-width));
      border-radius: 4px;
    }

    .ruler-marks {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      display: flex;
    }

    .ruler-mark {
      width: 8px;
      height: 100%;
      border-right: 1px dashed var(--border);
      position: relative;
    }

    .ruler-mark::after {
      content: attr(data-value);
      position: absolute;
      bottom: -16px;
      right: -8px;
      font-size: 0.5rem;
      color: var(--text-secondary);
    }

    .spacing-value-display {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      text-align: center;
      font-family: monospace;
    }

    /* Hidden utility */
    .hidden {
      display: none !important;
    }
  `;
}

function getEnhancedScript(options: HtmlOptions, data: DocsData): string {
  return `
    // Enhanced functionality
    (function() {
      ${
        options.showHierarchyView
          ? `
      // View toggle
      document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const view = btn.dataset.view;
          document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const typeNav = document.getElementById('type-nav');
          const hierarchyNav = document.getElementById('hierarchy-nav');

          if (view === 'hierarchy') {
            typeNav.classList.add('hidden');
            hierarchyNav.classList.remove('hidden');
          } else {
            typeNav.classList.remove('hidden');
            hierarchyNav.classList.add('hidden');
          }
        });
      });

      // Hierarchy expand/collapse
      document.querySelectorAll('.hierarchy-toggle.expandable').forEach(toggle => {
        toggle.addEventListener('click', () => {
          const path = toggle.dataset.path;
          const children = document.querySelector(\`.hierarchy-children[data-parent="\${path}"]\`);
          if (children) {
            children.classList.toggle('hidden');
            toggle.textContent = children.classList.contains('hidden') ? '▶' : '▼';
          }
        });
      });
      `
          : ""
      }

      ${
        options.showColorBlindness
          ? `
      // Color blindness simulation
      const colorblindSelect = document.getElementById('colorblind-select');
      if (colorblindSelect) {
        // Add SVG filters for color blindness
        const svgFilters = \`
          <svg style="position: absolute; width: 0; height: 0;">
            <defs>
              <filter id="protanopia-filter">
                <feColorMatrix type="matrix" values="
                  0.567 0.433 0 0 0
                  0.558 0.442 0 0 0
                  0 0.242 0.758 0 0
                  0 0 0 1 0"/>
              </filter>
              <filter id="deuteranopia-filter">
                <feColorMatrix type="matrix" values="
                  0.625 0.375 0 0 0
                  0.7 0.3 0 0 0
                  0 0.3 0.7 0 0
                  0 0 0 1 0"/>
              </filter>
              <filter id="tritanopia-filter">
                <feColorMatrix type="matrix" values="
                  0.95 0.05 0 0 0
                  0 0.433 0.567 0 0
                  0 0.475 0.525 0 0
                  0 0 0 1 0"/>
              </filter>
            </defs>
          </svg>
        \`;
        document.body.insertAdjacentHTML('beforeend', svgFilters);

        colorblindSelect.addEventListener('change', (e) => {
          const value = e.target.value;
          const content = document.getElementById('main-content');
          content.className = 'content';
          if (value !== 'normal') {
            content.classList.add('colorblind-' + value);
          }
        });
      }
      `
          : ""
      }

      ${
        options.showContrastRatios
          ? `
      // Calculate and display WCAG contrast ratios
      function calculateContrastRatio(color1, color2) {
        function parseColor(color) {
          const hex = color.match(/^#([0-9a-fA-F]{6})$/);
          if (hex) {
            return {
              r: parseInt(hex[1].slice(0, 2), 16),
              g: parseInt(hex[1].slice(2, 4), 16),
              b: parseInt(hex[1].slice(4, 6), 16)
            };
          }
          return null;
        }

        function getLuminance(r, g, b) {
          const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        }

        const rgb1 = parseColor(color1);
        const rgb2 = parseColor(color2);
        if (!rgb1 || !rgb2) return null;

        const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
        const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      // Add contrast info to color cards
      document.querySelectorAll('.token-card[data-type="color"]').forEach(card => {
        const preview = card.querySelector('.color-preview');
        if (!preview) return;

        const color = preview.style.background || preview.style.backgroundColor;
        const whiteRatio = calculateContrastRatio(color, '#ffffff');
        const blackRatio = calculateContrastRatio(color, '#000000');

        if (whiteRatio && blackRatio) {
          const bestRatio = Math.max(whiteRatio, blackRatio);
          const level = bestRatio >= 7 ? 'AAA' : bestRatio >= 4.5 ? 'AA' : 'Fail';

          const infoOverlay = document.createElement('div');
          infoOverlay.className = 'color-info-overlay';
          infoOverlay.innerHTML = \`
            <span class="contrast-ratio">\${bestRatio.toFixed(1)}:1</span>
            <span class="wcag-badge \${level.toLowerCase()}">\${level}</span>
          \`;
          preview.appendChild(infoOverlay);
        }
      });
      `
          : ""
      }

      // Palette swatch click to scroll to token
      document.querySelectorAll('.palette-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
          const path = swatch.dataset.path;
          const card = document.querySelector(\`.token-card[data-path="\${path}"]\`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.outline = '2px solid var(--primary)';
            setTimeout(() => card.style.outline = '', 2000);
          }
        });
      });
    })();
  `;
}
