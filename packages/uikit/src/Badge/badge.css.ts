import { theme } from "@design-sync/design-tokens";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

export const badge = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 6px",
    borderRadius: theme.borderRadius.sm,
    fontFamily: theme.fontFamily.main,
    fontSize: 10,
    fontWeight: theme.fontWeight.medium,
    lineHeight: theme.lineHeight.sm,
    letterSpacing: theme.letterSpacing.ui11,
    whiteSpace: "nowrap",
  },
  variants: {
    intent: {
      neutral: {
        background: theme.color.bgTertiary,
        color: theme.color.textSecondary,
      },
      brand: {
        background: theme.color.bgBrandTertiary,
        color: theme.color.textBrand,
      },
      success: {
        background: theme.color.bgSuccessTertiary,
        color: theme.color.textSuccess,
      },
      error: {
        background: theme.color.bgDangerTertiary,
        color: theme.color.textDanger,
      },
      warning: {
        background: theme.color.bgWarningTertiary,
        color: theme.color.textWarning,
      },
    },
  },
  defaultVariants: {
    intent: "neutral",
  },
});

export type BadgeVariants = RecipeVariants<typeof badge>;
