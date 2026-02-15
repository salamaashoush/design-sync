import { theme, ui11 } from "@design-sync/design-tokens";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { style } from "@vanilla-extract/css";

export const toast = recipe({
  base: [
    ui11,
    {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.floatingWindow,
      minWidth: 200,
    },
  ],
  variants: {
    intent: {
      info: {
        background: theme.color.bgBrandTertiary,
        color: theme.color.textBrand,
        border: `1px solid ${theme.color.borderBrand}`,
      },
      success: {
        background: theme.color.bgSuccessTertiary,
        color: theme.color.textSuccess,
        border: `1px solid ${theme.color.borderSuccess}`,
      },
      error: {
        background: theme.color.bgDangerTertiary,
        color: theme.color.textDanger,
        border: `1px solid ${theme.color.borderDanger}`,
      },
      warning: {
        background: theme.color.bgWarningTertiary,
        color: theme.color.textWarning,
        border: `1px solid ${theme.color.borderWarning}`,
      },
    },
  },
  defaultVariants: {
    intent: "info",
  },
});

export type ToastVariants = RecipeVariants<typeof toast>;

export const toastMessage = style({
  flex: 1,
});

export const closeButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "none",
  borderRadius: theme.borderRadius.md,
  cursor: "pointer",
  width: 24,
  height: 24,
  color: "currentColor",
  outline: "none",
  selectors: {
    "&:hover": {
      background: theme.color.bgHover,
    },
    "&:focus-visible": {
      outline: `2px solid ${theme.color.bgBrand}`,
    },
  },
});
