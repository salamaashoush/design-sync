import type { ProcessedToken } from "@design-sync/w3c-dtfm";

// ============================================================================
// Color Utilities for WCAG and Accessibility
// ============================================================================

/**
 * Parse a CSS color string to RGB values
 */
export function parseColor(color: string): { r: number; g: number; b: number } | null {
  // Handle hex colors
  const hexMatch = color.match(/^#([0-9a-fA-F]{3,8})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    if (hex.length >= 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
  }

  // Handle rgb/rgba colors
  const rgbMatch = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }

  // Handle hsl colors (convert to RGB)
  const hslMatch = color.match(/hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]) / 360;
    const s = parseInt(hslMatch[2]) / 100;
    const l = parseInt(hslMatch[3]) / 100;
    return hslToRgb(h, s, l);
  }

  return null;
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

/**
 * Calculate relative luminance for WCAG
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate WCAG contrast ratio between two colors
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function getContrastRatio(color1: string, color2: string): number | null {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);
  if (!rgb1 || !rgb2) return null;

  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get WCAG compliance level for a contrast ratio
 */
export function getWCAGLevel(ratio: number, isLargeText = false): "AAA" | "AA" | "Fail" {
  if (isLargeText) {
    if (ratio >= 4.5) return "AAA";
    if (ratio >= 3) return "AA";
  } else {
    if (ratio >= 7) return "AAA";
    if (ratio >= 4.5) return "AA";
  }
  return "Fail";
}

/**
 * Get complementary color
 */
export function getComplementaryColor(color: string): string | null {
  const rgb = parseColor(color);
  if (!rgb) return null;
  return `#${(255 - rgb.r).toString(16).padStart(2, "0")}${(255 - rgb.g).toString(16).padStart(2, "0")}${(255 - rgb.b).toString(16).padStart(2, "0")}`;
}

/**
 * Determine if text should be light or dark on a background
 */
export function getTextColorForBackground(bgColor: string): "light" | "dark" {
  const rgb = parseColor(bgColor);
  if (!rgb) return "dark";
  const luminance = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
  return luminance > 0.179 ? "dark" : "light";
}

/**
 * Color blindness simulation matrices
 * Based on: https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
 */
export const colorBlindnessMatrices = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

export type ColorBlindnessType = keyof typeof colorBlindnessMatrices;

/**
 * Simulate color blindness for a color
 */
export function simulateColorBlindness(
  color: string,
  type: ColorBlindnessType,
): string | null {
  const rgb = parseColor(color);
  if (!rgb) return null;

  const matrix = colorBlindnessMatrices[type];
  const newR = Math.round(matrix[0][0] * rgb.r + matrix[0][1] * rgb.g + matrix[0][2] * rgb.b);
  const newG = Math.round(matrix[1][0] * rgb.r + matrix[1][1] * rgb.g + matrix[1][2] * rgb.b);
  const newB = Math.round(matrix[2][0] * rgb.r + matrix[2][1] * rgb.g + matrix[2][2] * rgb.b);

  return `rgb(${Math.min(255, Math.max(0, newR))}, ${Math.min(255, Math.max(0, newG))}, ${Math.min(255, Math.max(0, newB))})`;
}

/**
 * Token documentation entry
 */
export interface TokenDocEntry {
  /** Token path */
  path: string;
  /** Token name */
  name: string;
  /** Token group */
  group: string;
  /** Token type */
  type: string;
  /** Token description */
  description?: string;
  /** CSS value for default mode */
  cssValue: string;
  /** Values per mode */
  modeValues: Record<string, string>;
  /** Whether token is deprecated */
  isDeprecated: boolean;
  /** Deprecation message */
  deprecationMessage?: string;
  /** Whether token was generated */
  isGenerated: boolean;
  /** Extension that generated the token */
  generatedBy?: string;
  /** Raw token extensions */
  extensions?: Record<string, unknown>;
}

/**
 * Token group for documentation
 */
export interface TokenDocGroup {
  /** Group name */
  name: string;
  /** Group path */
  path: string;
  /** Tokens in this group */
  tokens: TokenDocEntry[];
  /** Nested groups */
  subgroups: TokenDocGroup[];
}

/**
 * Documentation data structure
 */
export interface DocsData {
  /** Project name */
  projectName: string;
  /** Generation timestamp */
  generatedAt: string;
  /** Available modes */
  modes: string[];
  /** Default mode */
  defaultMode: string;
  /** All tokens flat list */
  tokens: TokenDocEntry[];
  /** Tokens grouped by type */
  tokensByType: Record<string, TokenDocEntry[]>;
  /** Tokens grouped hierarchically */
  groups: TokenDocGroup[];
  /** Statistics */
  stats: {
    total: number;
    byType: Record<string, number>;
    deprecated: number;
    generated: number;
  };
}

/**
 * Convert ProcessedToken to TokenDocEntry
 */
export function tokenToDocEntry(token: ProcessedToken, modes: string[]): TokenDocEntry {
  const modeValues: Record<string, string> = {};
  for (const mode of modes) {
    modeValues[mode] = token.toCSS(mode);
  }

  return {
    path: token.path,
    name: token.name,
    group: token.group,
    type: token.type,
    description: token.description,
    cssValue: token.toCSS(),
    modeValues,
    isDeprecated: token.isDeprecated,
    deprecationMessage: token.deprecationMessage,
    isGenerated: token.isGenerated,
    generatedBy: token.generatedBy,
    extensions: token.extensions,
  };
}

/**
 * Build hierarchical groups from flat token list
 */
export function buildTokenGroups(tokens: TokenDocEntry[]): TokenDocGroup[] {
  const rootGroups = new Map<string, TokenDocGroup>();

  for (const token of tokens) {
    const parts = token.group.split(".");
    let currentMap = rootGroups;
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}.${part}` : part;

      if (!currentMap.has(part)) {
        const newGroup: TokenDocGroup = {
          name: part,
          path: currentPath,
          tokens: [],
          subgroups: [],
        };
        currentMap.set(part, newGroup);
      }

      const group = currentMap.get(part)!;

      if (i === parts.length - 1) {
        // Last part - add token to this group
        group.tokens.push(token);
      } else {
        // Navigate deeper
        const subMap = new Map<string, TokenDocGroup>();
        for (const sub of group.subgroups) {
          subMap.set(sub.name, sub);
        }
        if (!subMap.has(parts[i + 1])) {
          const newSubgroup: TokenDocGroup = {
            name: parts[i + 1],
            path: `${currentPath}.${parts[i + 1]}`,
            tokens: [],
            subgroups: [],
          };
          group.subgroups.push(newSubgroup);
          subMap.set(parts[i + 1], newSubgroup);
        }
        currentMap = subMap;
      }
    }

    // Handle tokens with no group
    if (!token.group) {
      if (!rootGroups.has("_root")) {
        rootGroups.set("_root", {
          name: "Root",
          path: "",
          tokens: [],
          subgroups: [],
        });
      }
      rootGroups.get("_root")!.tokens.push(token);
    }
  }

  return Array.from(rootGroups.values());
}

/**
 * Group tokens by type
 */
export function groupTokensByType(tokens: TokenDocEntry[]): Record<string, TokenDocEntry[]> {
  const byType: Record<string, TokenDocEntry[]> = {};

  for (const token of tokens) {
    if (!byType[token.type]) {
      byType[token.type] = [];
    }
    byType[token.type].push(token);
  }

  return byType;
}

/**
 * Calculate token statistics
 */
export function calculateStats(tokens: TokenDocEntry[]): DocsData["stats"] {
  const byType: Record<string, number> = {};
  let deprecated = 0;
  let generated = 0;

  for (const token of tokens) {
    byType[token.type] = (byType[token.type] || 0) + 1;
    if (token.isDeprecated) deprecated++;
    if (token.isGenerated) generated++;
  }

  return {
    total: tokens.length,
    byType,
    deprecated,
    generated,
  };
}
