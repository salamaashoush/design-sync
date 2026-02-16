import { isObject, memoize } from "@design-sync/utils";

export function isRGBA(color: RGB | RGBA): color is RGBA {
  return "a" in color;
}

export function isColorVariableValue(value: VariableValue): value is RGB | RGBA {
  return isObject(value) && "r" in value && "g" in value && "b" in value;
}

export function isVariableAlias(value: VariableValue): value is VariableAlias {
  return isObject(value) && "type" in value && value.type === "VARIABLE_ALIAS" && "id" in value;
}

export function isGradientValue(value: string): boolean {
  return typeof value === "string" && value.includes("gradient");
}

export const deserializeColor = memoize((color: string): RGBA | RGB => {
  if (isGradientValue(color)) {
    console.warn(`Gradient color "${color}" is not supported as a Figma variable — skipping`);
    return { r: 0, g: 0, b: 0, a: 0 };
  }
  return figma.util.rgba(color);
});

export function numberToHex(value: number) {
  const hex = Math.round(value * 255).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export function serializeColor(color: RGB | RGBA): `#${string}` {
  const c = `#${numberToHex(color.r)}${numberToHex(color.g)}${numberToHex(color.b)}`;
  if (isRGBA(color)) {
    return `${c}${numberToHex(color.a)}` as `#${string}`;
  }
  return c as `#${string}`;
}
