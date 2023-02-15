import tiny from "tinycolor2";

export function getFigmaRGBColor(color: string, alpha: boolean = false) {
  const rgb = tiny(color).toRgb();
  if (alpha) {
    return {
      r: rgb.r / 255,
      g: rgb.g / 255,
      b: rgb.b / 255,
      a: rgb.a,
    };
  } else {
    return {
      r: rgb.r / 255,
      g: rgb.g / 255,
      b: rgb.b / 255,
    };
  }
}

export function getFigmaFontStyleFromWeight(fontWeight: string) {
  // check if the font weight is a number
  if (parseInt(fontWeight)) {
    const weight = parseInt(fontWeight);
    // convert it to figma font weight names
    switch (weight) {
      case 100:
        return "Thin";
      case 200:
        return "Extra Light";
      case 300:
        return "Light";
      case 400:
        return "Regular";
      case 500:
        return "Medium";
      case 600:
        return "Semi Bold";
      case 700:
        return "Bold";
      case 800:
        return "Extra Bold";
      case 900:
        return "Black";
      default:
        return "Regular";
    }
  } else {
    return fontWeight;
  }
}

export function getFigmaFontSize(fontSize: string) {
  const parsedFontSize = parseInt(fontSize);
  return parsedFontSize;
}

export function getFigmaValueWithUnit(value: string, relativeValue: number) {
  // check if the line height is a number with a unit
  const parsedValue = parseInt(value);
  if (value.includes("px")) {
    return {
      unit: "PIXELS",
      value: parsedValue,
    };
  }

  // check if the line height is a number without a unit
  if (parsedValue || value.includes("%")) {
    return {
      unit: "PERCENT",
      value: (parsedValue / relativeValue) * 100,
    };
  }
}

export function getFigmaTextDecoration(textDecoration: string) {
  // convert css text decoration to figma text decoration
  switch (textDecoration) {
    case "underline":
      return "UNDERLINE";
    case "line-through":
      return "STRIKETHROUGH";
    default:
      return "NONE";
  }
}

export function getFigmaTextCase(textCase: string) {
  // convert css text transform to figma text case
  switch (textCase) {
    case "uppercase":
      return "UPPER";
    case "lowercase":
      return "LOWER";
    case "capitalize":
      return "TITLE";
    default:
      return "ORIGINAL";
  }
}
