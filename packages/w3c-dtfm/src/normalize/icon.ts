/**
 * Icon and Asset Token Normalization
 *
 * Supports two formats:
 * 1. Kadena-style embedded SVG icons
 * 2. Standard URL/file-based assets (future W3C-compatible)
 */

import { isTokenAlias } from "../guards";

// ============================================================================
// Icon Types (Kadena-style embedded SVG)
// ============================================================================

/**
 * Icon style variants
 */
export type IconStyle = "mono" | "duotone" | "color" | "outline" | "filled";

/**
 * Normalized icon value with embedded SVG
 */
export interface NormalizedIconValue {
  /** Icon name/identifier */
  name: string;
  /** SVG content as string */
  svg: string;
  /** Icon style variant */
  style?: IconStyle;
  /** Icon dimensions */
  width: number;
  height: number;
  /** Optional description */
  description?: string;
  /** Optional categories/tags for searching */
  tags?: string[];
  /** Original format for reference */
  format: "embedded-svg";
}

/**
 * Kadena icon token format
 */
export interface KadenaIconToken {
  $type: "icon";
  $name?: string;
  $value: string; // SVG content
  $style?: string;
  $description?: string;
  $dimensions?: {
    width: string | number;
    height: string | number;
  };
}

// ============================================================================
// Asset Types (Standard URL-based)
// ============================================================================

/**
 * Asset MIME types
 */
export type AssetMimeType =
  | "image/svg+xml"
  | "image/png"
  | "image/jpeg"
  | "image/webp"
  | "image/gif"
  | "image/avif"
  | "application/pdf"
  | "video/mp4"
  | "video/webm"
  | "audio/mpeg"
  | "audio/wav"
  | "font/woff"
  | "font/woff2"
  | "font/ttf"
  | "font/otf"
  | string;

/**
 * Normalized asset value (URL-based)
 */
export interface NormalizedAssetValue {
  /** URL or relative path to the asset */
  url: string;
  /** MIME type of the asset */
  mimeType?: AssetMimeType;
  /** Asset dimensions (for images/videos) */
  width?: number;
  height?: number;
  /** Alt text for accessibility */
  alt?: string;
  /** File size in bytes */
  size?: number;
  /** Optional description */
  description?: string;
  /** Original format for reference */
  format: "url" | "data-url" | "relative-path";
}

/**
 * Standard asset token format (future W3C-compatible)
 */
export interface StandardAssetToken {
  $type: "asset";
  $value: string; // URL or path
  $description?: string;
  $extensions?: {
    asset?: {
      mimeType?: string;
      width?: number;
      height?: number;
      alt?: string;
      size?: number;
    };
  };
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if value is a Kadena-style icon token
 */
export function isKadenaIconValue(value: unknown): value is KadenaIconToken {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return v.$type === "icon" && typeof v.$value === "string";
}

/**
 * Check if value is a standard asset token
 */
export function isStandardAssetValue(value: unknown): value is StandardAssetToken {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return v.$type === "asset" && typeof v.$value === "string";
}

/**
 * Check if a string is an SVG
 */
export function isSvgString(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.startsWith("<svg") || trimmed.startsWith("<?xml");
}

/**
 * Check if a string is a data URL
 */
export function isDataUrl(value: string): boolean {
  return value.startsWith("data:");
}

/**
 * Check if a string is an absolute URL
 */
export function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/**
 * Check if value is a normalized icon
 */
export function isNormalizedIconValue(value: unknown): value is NormalizedIconValue {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v.name === "string" &&
    typeof v.svg === "string" &&
    typeof v.width === "number" &&
    typeof v.height === "number" &&
    v.format === "embedded-svg"
  );
}

/**
 * Check if value is a normalized asset
 */
export function isNormalizedAssetValue(value: unknown): value is NormalizedAssetValue {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v.url === "string" &&
    (v.format === "url" || v.format === "data-url" || v.format === "relative-path")
  );
}

// ============================================================================
// Normalization Functions
// ============================================================================

/**
 * Extract dimensions from SVG string
 */
export function extractSvgDimensions(svg: string): { width: number; height: number } {
  const widthMatch = svg.match(/width=["'](\d+)/);
  const heightMatch = svg.match(/height=["'](\d+)/);
  const viewBoxMatch = svg.match(/viewBox=["'](\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);

  if (widthMatch && heightMatch) {
    return {
      width: parseInt(widthMatch[1], 10),
      height: parseInt(heightMatch[1], 10),
    };
  }

  if (viewBoxMatch) {
    return {
      width: parseInt(viewBoxMatch[3], 10),
      height: parseInt(viewBoxMatch[4], 10),
    };
  }

  // Default to 24x24 (common icon size)
  return { width: 24, height: 24 };
}

/**
 * Extract icon name from path
 */
export function extractIconNameFromPath(path: string): string {
  const parts = path.split(".");
  return parts[parts.length - 1] || "icon";
}

/**
 * Normalize Kadena-style icon token
 */
export function normalizeKadenaIcon(
  value: KadenaIconToken | string,
  path?: string,
): NormalizedIconValue | string {
  // Handle token alias
  if (typeof value === "string") {
    if (isTokenAlias(value)) {
      return value;
    }
    // Raw SVG string
    if (isSvgString(value)) {
      const dims = extractSvgDimensions(value);
      return {
        name: path ? extractIconNameFromPath(path) : "icon",
        svg: value,
        width: dims.width,
        height: dims.height,
        format: "embedded-svg",
      };
    }
    return value;
  }

  const svg = value.$value;
  const dims = value.$dimensions
    ? {
        width:
          typeof value.$dimensions.width === "string"
            ? parseInt(value.$dimensions.width, 10)
            : value.$dimensions.width,
        height:
          typeof value.$dimensions.height === "string"
            ? parseInt(value.$dimensions.height, 10)
            : value.$dimensions.height,
      }
    : extractSvgDimensions(svg);

  return {
    name: value.$name || (path ? extractIconNameFromPath(path) : "icon"),
    svg,
    style: value.$style as IconStyle | undefined,
    width: dims.width,
    height: dims.height,
    description: value.$description,
    format: "embedded-svg",
  };
}

/**
 * Normalize standard asset token
 */
export function normalizeStandardAsset(
  value: StandardAssetToken | string,
): NormalizedAssetValue | string {
  // Handle token alias
  if (typeof value === "string") {
    if (isTokenAlias(value)) {
      return value;
    }

    // Determine format from string
    let format: NormalizedAssetValue["format"] = "relative-path";
    if (isDataUrl(value)) {
      format = "data-url";
    } else if (isAbsoluteUrl(value)) {
      format = "url";
    }

    return {
      url: value,
      format,
    };
  }

  const url = value.$value;
  const ext = value.$extensions?.asset;

  let format: NormalizedAssetValue["format"] = "relative-path";
  if (isDataUrl(url)) {
    format = "data-url";
  } else if (isAbsoluteUrl(url)) {
    format = "url";
  }

  return {
    url,
    mimeType: ext?.mimeType as AssetMimeType | undefined,
    width: ext?.width,
    height: ext?.height,
    alt: ext?.alt,
    size: ext?.size,
    description: value.$description,
    format,
  };
}

/**
 * Normalize icon value (handles both formats)
 */
export function normalizeIconValue(value: unknown, path?: string): NormalizedIconValue | string {
  if (typeof value === "string") {
    if (isTokenAlias(value)) {
      return value;
    }
    if (isSvgString(value)) {
      return normalizeKadenaIcon(value, path) as NormalizedIconValue;
    }
    return value;
  }

  if (isKadenaIconValue(value)) {
    return normalizeKadenaIcon(value, path) as NormalizedIconValue;
  }

  // Fallback - try to extract SVG from $value
  if (typeof value === "object" && value !== null) {
    const v = value as Record<string, unknown>;
    if (typeof v.$value === "string" && isSvgString(v.$value)) {
      return normalizeKadenaIcon(
        {
          $type: "icon",
          $value: v.$value,
          $name: v.$name as string | undefined,
          $style: v.$style as string | undefined,
          $description: v.$description as string | undefined,
          $dimensions: v.$dimensions as KadenaIconToken["$dimensions"],
        },
        path,
      ) as NormalizedIconValue;
    }
  }

  return String(value);
}

/**
 * Normalize asset value
 */
export function normalizeAssetValue(value: unknown): NormalizedAssetValue | string {
  if (typeof value === "string") {
    return normalizeStandardAsset(value) as NormalizedAssetValue | string;
  }

  if (isStandardAssetValue(value)) {
    return normalizeStandardAsset(value) as NormalizedAssetValue;
  }

  // Fallback - try to extract URL from $value
  if (typeof value === "object" && value !== null) {
    const v = value as Record<string, unknown>;
    if (typeof v.$value === "string") {
      return normalizeStandardAsset({
        $type: "asset",
        $value: v.$value,
        $description: v.$description as string | undefined,
        $extensions: v.$extensions as StandardAssetToken["$extensions"],
      }) as NormalizedAssetValue;
    }
  }

  return String(value);
}

// ============================================================================
// CSS Conversion
// ============================================================================

/**
 * Convert SVG to data URL
 */
export function svgToDataUrl(svg: string): string {
  const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Convert SVG to base64 data URL
 */
export function svgToBase64DataUrl(svg: string): string {
  // Use btoa for browser, Buffer for Node
  const base64 = typeof btoa !== "undefined" ? btoa(svg) : Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Convert icon to CSS value (as data URL)
 */
export function iconToCssValue(value: NormalizedIconValue | string): string {
  if (typeof value === "string") {
    if (isSvgString(value)) {
      return `url("${svgToDataUrl(value)}")`;
    }
    return value;
  }

  return `url("${svgToDataUrl(value.svg)}")`;
}

/**
 * Convert asset to CSS value
 */
export function assetToCssValue(value: NormalizedAssetValue | string): string {
  if (typeof value === "string") {
    return `url("${value}")`;
  }

  return `url("${value.url}")`;
}
