import { theme, ui11Bold } from "@design-sync/design-tokens";
import { style } from "@vanilla-extract/css";

export const overlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 10,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
});

export const positioner = style({
  position: "fixed",
  inset: 0,
  zIndex: 10,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const content = style({
  borderRadius: theme.borderRadius.lg,
  backgroundColor: theme.color.bg,
  border: `1px solid ${theme.color.border}`,
  boxShadow: theme.shadows.floatingWindow,
  minWidth: "300px",
  maxWidth: "480px",
  overflow: "hidden",
});

export const header = style({
  display: "flex",
  paddingInline: theme.spacing.xs,
  paddingBlock: theme.spacing.xxs,
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: `2px solid ${theme.color.bgBrand}`,
});

export const title = style([
  ui11Bold,
  {
    color: theme.color.text,
  },
]);

export const closeButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "24px",
  height: "24px",
  background: "transparent",
  border: "none",
  borderRadius: theme.borderRadius.sm,
  color: theme.color.iconSecondary,
  cursor: "pointer",
  ":hover": {
    backgroundColor: theme.color.bgHover,
    color: theme.color.icon,
  },
});

export const description = style({
  padding: theme.spacing.xs,
  color: theme.color.text,
});
