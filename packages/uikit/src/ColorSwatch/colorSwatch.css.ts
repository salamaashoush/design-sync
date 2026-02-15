import { theme } from "@design-sync/design-tokens";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { style } from "@vanilla-extract/css";

export const swatch = recipe({
  base: {
    display: "inline-block",
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.color.border}`,
    overflow: "hidden",
    position: "relative",
  },
  variants: {
    size: {
      sm: {
        width: 16,
        height: 16,
      },
      md: {
        width: 24,
        height: 24,
      },
      lg: {
        width: 32,
        height: 32,
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type SwatchVariants = RecipeVariants<typeof swatch>;

export const checkerboard = style({
  position: "absolute",
  inset: 0,
  backgroundImage: `linear-gradient(45deg, ${theme.color.bgTertiary} 25%, transparent 25%), linear-gradient(-45deg, ${theme.color.bgTertiary} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${theme.color.bgTertiary} 75%), linear-gradient(-45deg, transparent 75%, ${theme.color.bgTertiary} 75%)`,
  backgroundSize: "8px 8px",
  backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
});

export const colorFill = style({
  position: "absolute",
  inset: 0,
});
