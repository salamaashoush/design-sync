import { theme } from "@design-sync/design-tokens";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

export const iconButton = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    borderRadius: theme.borderRadius.md,
    cursor: "pointer",
    width: 32,
    height: 32,
    color: theme.color.icon,
    outline: "none",
    selectors: {
      "&:hover": {
        background: theme.color.bgHover,
      },
      "&:active": {
        background: theme.color.bgPressed,
      },
      "&:disabled": {
        cursor: "not-allowed",
        color: theme.color.iconDisabled,
      },
      "&:focus-visible": {
        outline: `2px solid ${theme.color.bgBrand}`,
      },
    },
  },
  variants: {
    selected: {
      true: {
        background: theme.color.bgSelected,
        color: theme.color.textSelected,
      },
    },
  },
});

export type IconButtonVariants = RecipeVariants<typeof iconButton>;
