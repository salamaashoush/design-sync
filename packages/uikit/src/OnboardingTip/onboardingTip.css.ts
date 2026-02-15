import { theme, ui11 } from "@design-sync/design-tokens";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing.xxs,
  padding: theme.spacing.xxs,
  backgroundColor: theme.color.bgBrandTertiary,
  borderRadius: theme.borderRadius.md,
  border: `1px solid ${theme.color.borderBrand}`,
});

export const message = style([
  ui11,
  {
    color: theme.color.textBrand,
    flex: 1,
  },
]);
