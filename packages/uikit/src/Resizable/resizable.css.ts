import { theme } from "@design-sync/design-tokens";
import { style } from "@vanilla-extract/css";

export const container = style({
  position: "fixed",
  inset: 0,
});

export const corner = style({
  position: "fixed",
  bottom: 0,
  right: 0,
  cursor: "se-resize",
  width: "16px",
  height: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.color.iconTertiary,
});
