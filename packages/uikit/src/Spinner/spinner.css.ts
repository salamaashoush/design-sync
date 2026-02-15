import { theme, spin } from "@design-sync/design-tokens";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

export const spinner = recipe({
  base: {
    display: "inline-block",
    borderRadius: "50%",
    border: `2px solid ${theme.color.borderDisabled}`,
    borderTopColor: theme.color.bgBrand,
    animation: `${spin} 600ms linear infinite`,
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

export type SpinnerVariants = RecipeVariants<typeof spinner>;
