/**
 * "none" Keyword Handling
 *
 * The W3C spec allows "none" as a color component value to represent
 * powerless or missing components with ambiguous zero values.
 *
 * @see https://www.w3.org/community/reports/design-tokens/CG-FINAL-color-20251028/#none-keyword
 */

import type { W3CColorValue, W3CColorComponent, W3CColorSpace } from "../types/w3c";
import { COLOR_SPACE_COMPONENTS } from "./spaces";

/**
 * Check if a color component is "none"
 */
export function isNoneComponent(component: W3CColorComponent): component is "none" {
  return component === "none";
}

/**
 * Check if a color has any "none" components
 */
export function hasNoneComponents(color: W3CColorValue): boolean {
  return (
    color.components.some(isNoneComponent) || (color.alpha !== undefined && color.alpha === "none")
  );
}

/**
 * Get which components are "none" in a color
 */
export function getNoneComponents(color: W3CColorValue): string[] {
  const noneComponents: string[] = [];
  const componentNames = COLOR_SPACE_COMPONENTS[color.colorSpace];

  for (let i = 0; i < 3; i++) {
    if (color.components[i] === "none") {
      noneComponents.push(componentNames[i]);
    }
  }

  if (color.alpha === "none") {
    noneComponents.push("alpha");
  }

  return noneComponents;
}

/**
 * Replace "none" components with a fallback value
 */
export function replaceNoneComponents(color: W3CColorValue, fallback: number = 0): W3CColorValue {
  const newComponents = color.components.map((c) => (c === "none" ? fallback : c)) as [
    W3CColorComponent,
    W3CColorComponent,
    W3CColorComponent,
  ];

  const newAlpha = color.alpha === "none" ? fallback : color.alpha;

  return {
    ...color,
    components: newComponents,
    alpha: newAlpha,
  };
}

/**
 * When to use "none" for hue values
 *
 * Hue is considered powerless (should be "none") when:
 * - In HSL: saturation is 0 (grayscale)
 * - In HWB: whiteness + blackness >= 1 (fully desaturated)
 * - In LCH/OKLCH: chroma is 0 (achromatic)
 */
export function shouldHueBeNone(color: W3CColorValue): boolean {
  const [_c1, c2, c3] = color.components;

  switch (color.colorSpace) {
    case "hsl": {
      // Hue is powerless when saturation is 0
      const saturation = c2;
      return saturation === 0 || saturation === "none";
    }
    case "hwb": {
      // Hue is powerless when whiteness + blackness >= 1
      const whiteness = c2 === "none" ? 0 : c2;
      const blackness = c3 === "none" ? 0 : c3;
      return whiteness + blackness >= 1;
    }
    case "lch":
    case "oklch": {
      // Hue is powerless when chroma is 0
      const chroma = c2;
      return chroma === 0 || chroma === "none";
    }
    default:
      return false;
  }
}

/**
 * Apply "none" to powerless components
 */
export function applyNoneToPowerless(color: W3CColorValue): W3CColorValue {
  // Only applies to color spaces with hue
  if (!["hsl", "hwb", "lch", "oklch"].includes(color.colorSpace)) {
    return color;
  }

  if (!shouldHueBeNone(color)) {
    return color;
  }

  // Hue is first component in hsl/hwb, third in lch/oklch
  const hueIndex = color.colorSpace === "lch" || color.colorSpace === "oklch" ? 2 : 0;
  const newComponents = [...color.components] as [
    W3CColorComponent,
    W3CColorComponent,
    W3CColorComponent,
  ];
  newComponents[hueIndex] = "none";

  return {
    ...color,
    components: newComponents,
  };
}

/**
 * Check if alpha is powerless (fully transparent)
 */
export function isAlphaPowerless(color: W3CColorValue): boolean {
  return color.alpha === 0;
}

/**
 * Calculate effective value of a component, treating "none" as 0
 */
export function getEffectiveValue(component: W3CColorComponent): number {
  return component === "none" ? 0 : component;
}

/**
 * Create a color with specific components set to "none"
 */
export function withNoneComponents(
  color: W3CColorValue,
  noneIndices: number[],
  noneAlpha: boolean = false,
): W3CColorValue {
  const newComponents = color.components.map((c, i) => (noneIndices.includes(i) ? "none" : c)) as [
    W3CColorComponent,
    W3CColorComponent,
    W3CColorComponent,
  ];

  return {
    ...color,
    components: newComponents,
    alpha: noneAlpha ? "none" : color.alpha,
  };
}

/**
 * Preserve "none" values during color space conversion
 * When converting between color spaces, "none" should be preserved
 * in corresponding powerless positions
 */
export function preserveNoneInConversion(
  originalColor: W3CColorValue,
  convertedColor: W3CColorValue,
): W3CColorValue {
  // If original had none in hue position, and converted has hue, preserve it
  const hueSpaces: W3CColorSpace[] = ["hsl", "hwb", "lch", "oklch"];

  const originalHueIndex = hueSpaces.includes(originalColor.colorSpace)
    ? originalColor.colorSpace === "lch" || originalColor.colorSpace === "oklch"
      ? 2
      : 0
    : -1;

  const convertedHueIndex = hueSpaces.includes(convertedColor.colorSpace)
    ? convertedColor.colorSpace === "lch" || convertedColor.colorSpace === "oklch"
      ? 2
      : 0
    : -1;

  if (
    originalHueIndex >= 0 &&
    convertedHueIndex >= 0 &&
    originalHueIndex < 3 &&
    convertedHueIndex < 3 &&
    originalColor.components[originalHueIndex as 0 | 1 | 2] === "none"
  ) {
    const newComponents = [...convertedColor.components] as [
      W3CColorComponent,
      W3CColorComponent,
      W3CColorComponent,
    ];
    newComponents[convertedHueIndex as 0 | 1 | 2] = "none";
    return {
      ...convertedColor,
      components: newComponents,
    };
  }

  // Preserve alpha none
  if (originalColor.alpha === "none" && convertedColor.alpha !== "none") {
    return {
      ...convertedColor,
      alpha: "none",
    };
  }

  return convertedColor;
}
