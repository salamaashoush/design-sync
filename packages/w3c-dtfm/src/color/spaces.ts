/**
 * Color Space Definitions and Conversions
 *
 * Support for all 14 W3C-required color spaces.
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-color-20251028/
 */

import "culori/css";
import {
  converter,
  formatHex,
  formatHex8,
  formatCss,
  parse as culoriParse,
  type Color as CuloriColor,
  type Mode,
} from "culori/fn";
import type { W3CColorSpace, W3CColorValue, W3CColorComponent } from "../types/w3c";

/**
 * Mapping from W3C color space names to Culori mode names
 */
export const W3C_TO_CULORI_MODE: Record<W3CColorSpace, Mode> = {
  srgb: "rgb",
  "srgb-linear": "lrgb",
  hsl: "hsl",
  hwb: "hwb",
  lab: "lab",
  lch: "lch",
  oklab: "oklab",
  oklch: "oklch",
  "display-p3": "p3",
  "a98-rgb": "a98",
  "prophoto-rgb": "prophoto",
  rec2020: "rec2020",
  "xyz-d50": "xyz50",
  "xyz-d65": "xyz65",
};

/**
 * Reverse mapping from Culori mode to W3C color space
 */
export const CULORI_MODE_TO_W3C: Record<string, W3CColorSpace> = {
  rgb: "srgb",
  lrgb: "srgb-linear",
  hsl: "hsl",
  hwb: "hwb",
  lab: "lab",
  lch: "lch",
  oklab: "oklab",
  oklch: "oklch",
  p3: "display-p3",
  a98: "a98-rgb",
  prophoto: "prophoto-rgb",
  rec2020: "rec2020",
  xyz50: "xyz-d50",
  xyz65: "xyz-d65",
};

/**
 * Color space component definitions
 * Maps color space to its component names in order
 */
export const COLOR_SPACE_COMPONENTS: Record<W3CColorSpace, [string, string, string]> = {
  srgb: ["r", "g", "b"],
  "srgb-linear": ["r", "g", "b"],
  hsl: ["h", "s", "l"],
  hwb: ["h", "w", "b"],
  lab: ["l", "a", "b"],
  lch: ["l", "c", "h"],
  oklab: ["l", "a", "b"],
  oklch: ["l", "c", "h"],
  "display-p3": ["r", "g", "b"],
  "a98-rgb": ["r", "g", "b"],
  "prophoto-rgb": ["r", "g", "b"],
  rec2020: ["r", "g", "b"],
  "xyz-d50": ["x", "y", "z"],
  "xyz-d65": ["x", "y", "z"],
};

/**
 * Create a Culori converter for a color space
 */
export function getColorSpaceConverter(
  colorSpace: W3CColorSpace,
): (color: CuloriColor | string | undefined) => CuloriColor {
  const mode = W3C_TO_CULORI_MODE[colorSpace];
  return converter(mode) as (color: CuloriColor | string | undefined) => CuloriColor;
}

/**
 * Parse a CSS color string
 */
export function parseColor(color: string): CuloriColor | undefined {
  return culoriParse(color);
}

/**
 * Convert a W3C color value to Culori color object
 */
export function w3cColorToCulori(color: W3CColorValue): CuloriColor {
  const mode = W3C_TO_CULORI_MODE[color.colorSpace];
  const componentNames = COLOR_SPACE_COMPONENTS[color.colorSpace];

  const result: Record<string, unknown> = { mode };

  for (let i = 0; i < 3; i++) {
    const component = color.components[i];
    result[componentNames[i]] = component === "none" ? undefined : component;
  }

  if (color.alpha !== undefined && color.alpha !== "none") {
    result.alpha = color.alpha;
  }

  return result as unknown as CuloriColor;
}

/**
 * Convert a Culori color object to W3C color value
 */
export function culoriToW3CColor(color: CuloriColor, targetSpace?: W3CColorSpace): W3CColorValue {
  const sourceSpace = CULORI_MODE_TO_W3C[color.mode] || "srgb";
  const colorSpace = targetSpace || sourceSpace;

  // Convert to target color space if needed
  let convertedColor = color;
  if (targetSpace && targetSpace !== sourceSpace) {
    const convert = getColorSpaceConverter(targetSpace);
    convertedColor = convert(color);
  }

  const componentNames = COLOR_SPACE_COMPONENTS[colorSpace];
  const colorRecord = convertedColor as unknown as Record<string, unknown>;
  const components: [W3CColorComponent, W3CColorComponent, W3CColorComponent] = [
    (colorRecord[componentNames[0]] as number) ?? 0,
    (colorRecord[componentNames[1]] as number) ?? 0,
    (colorRecord[componentNames[2]] as number) ?? 0,
  ];

  const result: W3CColorValue = {
    colorSpace,
    components,
  };

  if (convertedColor.alpha !== undefined && convertedColor.alpha < 1) {
    result.alpha = convertedColor.alpha;
  }

  // Add hex for sRGB colors
  if (colorSpace === "srgb") {
    result.hex = (
      convertedColor.alpha !== undefined && convertedColor.alpha < 1
        ? formatHex8(convertedColor)
        : formatHex(convertedColor)
    ) as `#${string}`;
  }

  return result;
}

/**
 * Convert a color between color spaces
 */
export function convertColorSpace(color: W3CColorValue, targetSpace: W3CColorSpace): W3CColorValue {
  if (color.colorSpace === targetSpace) {
    return color;
  }

  const culoriColor = w3cColorToCulori(color);
  return culoriToW3CColor(culoriColor, targetSpace);
}

/**
 * Format a W3C color value to CSS string
 */
export function formatW3CColorToCSS(color: W3CColorValue): string {
  // For sRGB with hex, use hex format
  if (color.colorSpace === "srgb" && color.hex) {
    return color.hex;
  }

  const culoriColor = w3cColorToCulori(color);
  return formatCss(culoriColor) || "";
}

/**
 * Parse a CSS color string to W3C color value
 */
export function parseCSSToW3CColor(
  css: string,
  targetSpace: W3CColorSpace = "srgb",
): W3CColorValue | undefined {
  const parsed = parseColor(css);
  if (!parsed) {
    return undefined;
  }
  return culoriToW3CColor(parsed, targetSpace);
}

/**
 * Check if a color space is valid W3C color space
 */
export function isValidColorSpace(colorSpace: string): colorSpace is W3CColorSpace {
  return colorSpace in W3C_TO_CULORI_MODE;
}

/**
 * Get all supported color spaces
 */
export function getSupportedColorSpaces(): W3CColorSpace[] {
  return Object.keys(W3C_TO_CULORI_MODE) as W3CColorSpace[];
}

/**
 * Check if a color is in gamut for a color space
 */
export function isInGamut(color: W3CColorValue): boolean {
  // For RGB-based color spaces, check if components are in [0, 1] range
  const rgbSpaces: W3CColorSpace[] = [
    "srgb",
    "srgb-linear",
    "display-p3",
    "a98-rgb",
    "prophoto-rgb",
    "rec2020",
  ];

  if (rgbSpaces.includes(color.colorSpace)) {
    for (const component of color.components) {
      if (component !== "none" && (component < 0 || component > 1)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Clamp a color to its gamut
 */
export function clampToGamut(color: W3CColorValue): W3CColorValue {
  const rgbSpaces: W3CColorSpace[] = [
    "srgb",
    "srgb-linear",
    "display-p3",
    "a98-rgb",
    "prophoto-rgb",
    "rec2020",
  ];

  if (!rgbSpaces.includes(color.colorSpace)) {
    return color;
  }

  const clampedComponents = color.components.map((c) => {
    if (c === "none") return c;
    return Math.max(0, Math.min(1, c));
  }) as [W3CColorComponent, W3CColorComponent, W3CColorComponent];

  return {
    ...color,
    components: clampedComponents,
  };
}

/**
 * Interpolate between two colors
 */
export function interpolateColors(
  color1: W3CColorValue,
  color2: W3CColorValue,
  t: number,
  interpolationSpace: W3CColorSpace = "oklch",
): W3CColorValue {
  // Convert both colors to interpolation space
  const c1 = convertColorSpace(color1, interpolationSpace);
  const c2 = convertColorSpace(color2, interpolationSpace);

  // Interpolate components
  const interpolatedComponents = c1.components.map((c1Comp, i) => {
    const c2Comp = c2.components[i];
    if (c1Comp === "none") return c2Comp;
    if (c2Comp === "none") return c1Comp;
    return c1Comp + (c2Comp - c1Comp) * t;
  }) as [W3CColorComponent, W3CColorComponent, W3CColorComponent];

  // Interpolate alpha
  const alpha1 = c1.alpha === "none" ? 1 : (c1.alpha ?? 1);
  const alpha2 = c2.alpha === "none" ? 1 : (c2.alpha ?? 1);
  const interpolatedAlpha = alpha1 + (alpha2 - alpha1) * t;

  const result: W3CColorValue = {
    colorSpace: interpolationSpace,
    components: interpolatedComponents,
  };

  if (interpolatedAlpha < 1) {
    result.alpha = interpolatedAlpha;
  }

  return result;
}
