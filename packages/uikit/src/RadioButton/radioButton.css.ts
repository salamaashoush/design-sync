import { theme, ui11 } from "@design-sync/design-tokens";
import { style } from "@vanilla-extract/css";

export const group = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const item = style({
  display: "flex",
  alignItems: "center",
  gap: 6,
});

export const control = style({
  width: 14,
  height: 14,
  borderRadius: "50%",
  border: `1px solid ${theme.color.border}`,
  backgroundColor: "transparent",
  selectors: {
    "&[data-checked]": {
      borderColor: theme.color.bgBrand,
      boxShadow: `inset 0 0 0 3px ${theme.color.bgBrand}`,
    },
    "&[data-disabled]": {
      borderColor: theme.color.bgDisabled,
    },
  },
});

export const label = style([
  ui11,
  {
    color: theme.color.text,
    cursor: "default",
    selectors: {
      "&[data-disabled]": {
        color: theme.color.textDisabled,
      },
    },
  },
]);
