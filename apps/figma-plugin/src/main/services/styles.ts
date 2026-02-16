import { camelCase, set } from "@design-sync/utils";
import type {
  LegacyColor,
  LegacyGradientStop,
  LegacyShadow,
  LegacyTypography,
  TokenDefinition,
} from "@design-sync/w3c-dtfm";
import { deserializeColor, isGradientValue, serializeColor } from "../utils/colors";
import {
  convertFontSize,
  convertFontWeight,
  convertValue,
  serializeFontWeight,
  serializeLetterSpacing,
  serializeLineHeight,
} from "../utils/fonts";
import { walkTokens } from "../utils/tokens";
import type { DiffResult } from "../../shared/types";

export class StylesService {
  // ── Export (Figma → Tokens) ────────────────────────────────────────

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

  // ── Import (Tokens → Figma) ────────────────────────────────────────

  async importTypography(
    tokens: Record<string, unknown>,
  ): Promise<{ created: number; updated: number }> {
    let created = 0;
    let updated = 0;
    const existingStyles = figma.getLocalTextStyles();

    for (const { path, token } of walkTokens(tokens)) {
      if (token.$type !== "typography") continue;
      const value = token.$value as LegacyTypography;
      const styleName = path.replace(/\//g, "/");

      // Find or create
      let style = existingStyles.find((s) => s.name === styleName);
      if (!style) {
        style = figma.createTextStyle();
        style.name = styleName;
        created++;
      } else {
        updated++;
      }

      if (token.$description) {
        style.description = token.$description;
      }

      // Load font before setting properties
      const family = value.fontFamily ?? "Inter";
      const fontStyle = convertFontWeight(value.fontWeight ?? "400") ?? "Regular";
      await figma.loadFontAsync({ family, style: fontStyle });

      style.fontName = { family, style: fontStyle };
      style.fontSize = convertFontSize(value.fontSize ?? "16px");
      style.letterSpacing = convertValue(value.letterSpacing?.toString() ?? "0px");
      style.lineHeight = value.lineHeight
        ? convertValue(String(value.lineHeight), style.fontSize)
        : ({ unit: "AUTO", value: 0 } as any);
    }

    return { created, updated };
  }

  async importShadows(
    tokens: Record<string, unknown>,
  ): Promise<{ created: number; updated: number }> {
    let created = 0;
    let updated = 0;
    const existingStyles = figma.getLocalEffectStyles();

    for (const { path, token } of walkTokens(tokens)) {
      if (token.$type !== "shadow") continue;
      const styleName = path.replace(/\//g, "/");

      let style = existingStyles.find((s) => s.name === styleName);
      if (!style) {
        style = figma.createEffectStyle();
        style.name = styleName;
        created++;
      } else {
        updated++;
      }

      if (token.$description) {
        style.description = token.$description;
      }

      // Support single shadow or array
      const shadowValues = Array.isArray(token.$value) ? token.$value : [token.$value];
      const effects: DropShadowEffect[] = shadowValues.map((shadow: LegacyShadow) => ({
        type: "DROP_SHADOW" as const,
        visible: true,
        blendMode: "NORMAL" as const,
        color: {
          ...deserializeColor(shadow.color),
          a: deserializeColor(shadow.color).a ?? 1,
        } as RGBA,
        offset: {
          x: parseFloat(shadow.offsetX) || 0,
          y: parseFloat(shadow.offsetY) || 0,
        },
        radius: parseFloat(shadow.blur) || 0,
        spread: parseFloat(shadow.spread) || 0,
      }));
      style.effects = effects;
    }

    return { created, updated };
  }

  async importPaints(
    tokens: Record<string, unknown>,
  ): Promise<{ created: number; updated: number }> {
    let created = 0;
    let updated = 0;
    const existingStyles = figma.getLocalPaintStyles();

    for (const { path, token } of walkTokens(tokens)) {
      const styleName = path.replace(/\//g, "/");

      if (token.$type === "color") {
        const colorStr = token.$value as string;
        if (isGradientValue(colorStr)) continue;

        let style = existingStyles.find((s) => s.name === styleName);
        if (!style) {
          style = figma.createPaintStyle();
          style.name = styleName;
          created++;
        } else {
          updated++;
        }

        if (token.$description) {
          style.description = token.$description;
        }

        const rgba = deserializeColor(colorStr);
        const paint: SolidPaint = {
          type: "SOLID",
          color: { r: rgba.r, g: rgba.g, b: rgba.b },
          opacity: "a" in rgba ? rgba.a : 1,
        };
        style.paints = [paint];
      } else if (token.$type === "gradient") {
        const stops = token.$value as LegacyGradientStop[];

        let style = existingStyles.find((s) => s.name === styleName);
        if (!style) {
          style = figma.createPaintStyle();
          style.name = styleName;
          created++;
        } else {
          updated++;
        }

        if (token.$description) {
          style.description = token.$description;
        }

        const gradientStops: ColorStop[] = stops.map(({ color, position }) => ({
          color: { ...deserializeColor(color), a: deserializeColor(color).a ?? 1 } as RGBA,
          position,
        }));
        const paint: GradientPaint = {
          type: "GRADIENT_LINEAR",
          gradientStops,
          gradientTransform: [
            [1, 0, 0],
            [0, 1, 0],
          ],
        };
        style.paints = [paint];
      }
    }

    return { created, updated };
  }

  // ── Diff Import (preview before applying) ──────────────────────────

  diffImportTypography(tokens: Record<string, unknown>): DiffResult {
    const diff: DiffResult = [];
    const existingStyles = figma.getLocalTextStyles();
    const remotePaths = new Set<string>();

    for (const { path, token } of walkTokens(tokens)) {
      if (token.$type !== "typography") continue;
      remotePaths.add(path);
      const existing = existingStyles.find((s) => s.name === path);
      if (!existing) {
        diff.push({ path, type: "add", newValue: JSON.stringify(token.$value) });
      } else {
        const newStr = JSON.stringify(token.$value);
        const oldValue: LegacyTypography = {
          fontSize: `${existing.fontSize}px`,
          letterSpacing: serializeLetterSpacing(existing.letterSpacing),
          lineHeight: serializeLineHeight(existing.lineHeight),
          fontFamily: existing.fontName.family,
          fontWeight: serializeFontWeight(existing.fontName.style),
        };
        const oldStr = JSON.stringify(oldValue);
        if (newStr !== oldStr) {
          diff.push({ path, type: "update", oldValue: oldStr, newValue: newStr });
        }
      }
    }

    for (const style of existingStyles) {
      if (!remotePaths.has(style.name)) {
        diff.push({ path: style.name, type: "remove", oldValue: style.name });
      }
    }

    return diff;
  }

  diffImportShadows(tokens: Record<string, unknown>): DiffResult {
    const diff: DiffResult = [];
    const existingStyles = figma.getLocalEffectStyles();
    const remotePaths = new Set<string>();

    for (const { path, token } of walkTokens(tokens)) {
      if (token.$type !== "shadow") continue;
      remotePaths.add(path);
      const existing = existingStyles.find((s) => s.name === path);
      if (!existing) {
        diff.push({ path, type: "add", newValue: JSON.stringify(token.$value) });
      } else {
        const newStr = JSON.stringify(token.$value);
        // Serialize existing shadow effects for comparison
        const shadows = existing.effects.filter(
          ({ type }) => type === "DROP_SHADOW" || type === "INNER_SHADOW",
        ) as (DropShadowEffect | InnerShadowEffect)[];
        const oldValue = shadows.map(({ color, offset, radius, spread }) => ({
          color: serializeColor(color),
          blur: `${radius}px`,
          spread: spread ? `${spread}px` : "0px",
          offsetX: `${offset.x}px`,
          offsetY: `${offset.y}px`,
        }));
        const oldStr =
          oldValue.length === 1 ? JSON.stringify(oldValue[0]) : JSON.stringify(oldValue);
        if (newStr !== oldStr) {
          diff.push({ path, type: "update", oldValue: oldStr, newValue: newStr });
        }
      }
    }

    for (const style of existingStyles) {
      if (!remotePaths.has(style.name)) {
        diff.push({ path: style.name, type: "remove", oldValue: style.name });
      }
    }

    return diff;
  }

  diffImportPaints(tokens: Record<string, unknown>): DiffResult {
    const diff: DiffResult = [];
    const existingStyles = figma.getLocalPaintStyles();
    const remotePaths = new Set<string>();

    for (const { path, token } of walkTokens(tokens)) {
      if (token.$type !== "color" && token.$type !== "gradient") continue;
      remotePaths.add(path);
      const existing = existingStyles.find((s) => s.name === path);
      if (!existing) {
        diff.push({ path, type: "add", newValue: JSON.stringify(token.$value) });
      } else {
        const newStr = JSON.stringify(token.$value);
        // Serialize existing paint for comparison
        const paint = existing.paints[0];
        let oldStr: string;
        if (paint?.type === "SOLID") {
          const { color, opacity } = paint as SolidPaint;
          oldStr = JSON.stringify(serializeColor({ ...color, a: opacity }));
        } else if (paint?.type.startsWith("GRADIENT_")) {
          const { gradientStops } = paint as GradientPaint;
          oldStr = JSON.stringify(
            gradientStops.map(({ color, position }) => ({
              color: serializeColor(color),
              position,
            })),
          );
        } else {
          oldStr = "";
        }
        if (newStr !== oldStr) {
          diff.push({ path, type: "update", oldValue: oldStr, newValue: newStr });
        }
      }
    }

    for (const style of existingStyles) {
      if (!remotePaths.has(style.name)) {
        diff.push({ path: style.name, type: "remove", oldValue: style.name });
      }
    }

    return diff;
  }
}

export const stylesService = new StylesService();
