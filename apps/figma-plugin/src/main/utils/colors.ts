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

export const deserializeColor = memoize((color: string): RGBA | RGB => {
  if (color.includes("gradient")) {
    console.warn("gradient color is not supported");
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
