import { camelCase, set } from "@design-sync/utils";
import type {
  LegacyColor,
  LegacyGradientStop,
  LegacyShadow,
  LegacyTypography,
  TokenDefinition,
} from "@design-sync/w3c-dtfm";
import { serializeColor } from "../utils/colors";
import { serializeFontWeight, serializeLetterSpacing, serializeLineHeight } from "../utils/fonts";

export class StylesService {
  textStylesToDesignTokens() {
    const styles = figma.getLocalTextStyles();
    const tokens: Record<string, any> = {};
    for (const style of styles) {
      const { name, description, fontSize, letterSpacing, lineHeight, fontName } = style;
      const normalizedPath = name.replace(/\//g, ".").split(".").map(camelCase).join(".");
      const value: LegacyTypography = {
        fontSize: `${fontSize}px`,
        letterSpacing: serializeLetterSpacing(letterSpacing),
        lineHeight: serializeLineHeight(lineHeight),
        fontFamily: fontName.family,
        fontWeight: serializeFontWeight(fontName.style),
      };
      const token: TokenDefinition<"typography", LegacyTypography> = {
        $description: description,
        $type: "typography",
        $value: value,
      };
      set(tokens, normalizedPath, token);
    }
    return tokens;
  }

  shadowStylesToDesignTokens() {
    const styles = figma.getLocalEffectStyles();
    const tokens: Record<string, any> = {};
    for (const style of styles) {
      const { name, description, effects } = style;
      const normalizedPath = name.replace(/\//g, ".").split(".").map(camelCase).join(".");
      const shadows = effects.filter(
        ({ type }) => type === "DROP_SHADOW" || type === "INNER_SHADOW",
      ) as (DropShadowEffect | InnerShadowEffect)[];
      if (shadows.length === 0) {
        continue;
      }
      for (const { color, offset, radius, spread } of shadows) {
        const value: LegacyShadow = {
          color: serializeColor(color),
          blur: `${radius}px`,
          spread: spread ? `${spread}px` : "0px",
          offsetX: `${offset.x}px`,
          offsetY: `${offset.y}px`,
        };
        const token: TokenDefinition<"shadow", LegacyShadow> = {
          $description: description,
          $type: "shadow",
          $value: value,
        };
        set(tokens, normalizedPath, token);
      }
    }
    return tokens;
  }

  paintStylesToDesignTokens() {
    const styles = figma.getLocalPaintStyles();
    const colors: Record<string, any> = {};
    const gradients: Record<string, any> = {};
    for (const style of styles) {
      const { name, description, paints } = style;
      const normalizedPath = name.replace(/\//g, ".").split(".").map(camelCase).join(".");
      for (const paint of paints) {
        if (paint.type.startsWith("GRADIENT_")) {
          const { gradientStops } = paint as GradientPaint;
          const value: LegacyGradientStop[] = gradientStops.map(({ color, position }) => ({
            color: serializeColor(color),
            position,
          }));
          const token: TokenDefinition<"gradient", LegacyGradientStop[]> = {
            $description: description,
            $type: "gradient",
            $value: value,
          };
          set(gradients, normalizedPath, token);
        }
        if (paint.type === "SOLID") {
          const { color, opacity } = paint as SolidPaint;
          const value: LegacyColor = serializeColor({
            ...color,
            a: opacity,
          });
          const token: TokenDefinition<"color", LegacyColor> = {
            $description: description,
            $type: "color",
            $value: value,
          };
          set(colors, normalizedPath, token);
        }
      }
    }
    return {
      colors,
      gradients,
    };
  }
}

export const stylesService = new StylesService();
