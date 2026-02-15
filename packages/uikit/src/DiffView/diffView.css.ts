import { theme, ui11, ui11Bold } from "@design-sync/design-tokens";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "flex",
  flexDirection: "column",
  gap: 0,
  border: `1px solid ${theme.color.border}`,
  borderRadius: theme.borderRadius.md,
  overflow: "hidden",
});

export const header = style([
  ui11Bold,
  {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 12px",
    background: theme.color.bgSecondary,
    borderBottom: `1px solid ${theme.color.border}`,
  },
]);

export const stats = style([
  ui11,
  {
    display: "flex",
    gap: "8px",
  },
]);

export const statAdd = style({
  color: theme.color.textSuccess,
});

export const statUpdate = style({
  color: theme.color.textWarning,
});

export const statRemove = style({
  color: theme.color.textDanger,
});

export const row = style([
  ui11,
  {
    display: "flex",
    alignItems: "center",
    padding: "6px 12px",
    borderBottom: `1px solid ${theme.color.border}`,
    gap: "8px",
    selectors: {
      "&:last-child": {
        borderBottom: "none",
      },
    },
  },
]);

export const rowAdd = style({
  background: theme.color.bgSuccessTertiary,
});

export const rowUpdate = style({
  background: theme.color.bgWarningTertiary,
});

export const rowRemove = style({
  background: theme.color.bgDangerTertiary,
});

export const rowPath = style({
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const rowValue = style({
  color: theme.color.textSecondary,
  maxWidth: "200px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const rowBadge = style({
  fontSize: "10px",
  fontWeight: "bold",
  padding: "1px 4px",
  borderRadius: theme.borderRadius.sm,
});

export const addBadge = style({
  color: theme.color.textSuccess,
  background: theme.color.bgSuccessTertiary,
});

export const updateBadge = style({
  color: theme.color.textWarning,
  background: theme.color.bgWarningTertiary,
});

export const removeBadge = style({
  color: theme.color.textDanger,
  background: theme.color.bgDangerTertiary,
});
