import { camelCase, set } from '@tokenize/utils';
import { TokenDefinition } from '@tokenize/w3c-tokens';
import { serailzeColor, serializeFontWeight, serializeLetterSpacing, serializeLineHeight } from './utils';

export function textStylesToDesignTokens() {
  const styles = figma.getLocalTextStyles();
  const tokens: Record<string, any> = {};
  for (const style of styles) {
    const { name, description, fontSize, letterSpacing, lineHeight, fontName } = style;
    const normalizedPath = name.replace(/\//g, '.').split('.').map(camelCase).join('.');
    const token: TokenDefinition<'typography'> = {
      $description: description,
      $type: 'typography',
      $value: {
        fontSize: `${fontSize}px`,
        letterSpacing: serializeLetterSpacing(letterSpacing),
        lineHeight: serializeLineHeight(lineHeight),
        fontFamily: fontName.family,
        fontWeight: serializeFontWeight(fontName.style),
      },
    };
    set(tokens, normalizedPath, token);
  }
  return tokens;
}

export function shadowStylesToDesignTokens() {
  const styles = figma.getLocalEffectStyles();
  const tokens: Record<string, any> = {};
  for (const style of styles) {
    const { name, description, effects } = style;
    const normalizedPath = name.replace(/\//g, '.').split('.').map(camelCase).join('.');
    const shadows = effects.filter(({ type }) => type === 'DROP_SHADOW' || type === 'INNER_SHADOW') as (
      | DropShadowEffect
      | InnerShadowEffect
    )[];
    if (shadows.length === 0) {
      continue;
    }
    for (const { color, offset, radius, spread } of shadows) {
      const token: TokenDefinition<'shadow'> = {
        $description: description,
        $type: 'shadow',
        $value: {
          color: serailzeColor(color),
          blur: `${radius}px`,
          spread: spread ? `${spread}px` : '0px',
          offsetX: `${offset.x}px`,
          offsetY: `${offset.y}px`,
        },
      };
      set(tokens, normalizedPath, token);
    }
  }
  return tokens;
}

export function paintStylesToDesignTokens(exportSolid = false, exportGradient = true) {
  const styles = figma.getLocalPaintStyles();
  const tokens: Record<string, any> = {};
  for (const style of styles) {
    const { name, description, paints } = style;
    const normalizedPath = name.replace(/\//g, '.').split('.').map(camelCase).join('.');
    for (const paint of paints) {
      if (paint.type.startsWith('GRADIENT_') && exportGradient) {
        const { gradientStops } = paint as GradientPaint;
        const token: TokenDefinition<'gradient'> = {
          $description: description,
          $type: 'gradient',
          $value: gradientStops.map(({ color, position }) => ({
            color: serailzeColor(color),
            position,
          })),
        };
        set(tokens, normalizedPath, token);
      }
      if (paint.type === 'SOLID' && exportSolid) {
        const { color, opacity } = paint as SolidPaint;
        const token: TokenDefinition<'color'> = {
          $description: description,
          $type: 'color',
          $value: serailzeColor(color, opacity),
        };
        set(tokens, normalizedPath, token);
      }
    }
  }
  return tokens;
}
