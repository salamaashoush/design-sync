import { theme, ui11 } from "@design-sync/design-tokens";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.xxs,
});

export const label = style([
  ui11,
  {
    color: theme.color.textSecondary,
    userSelect: "none",
    selectors: {
      "&[data-disabled]": {
        color: theme.color.textDisabled,
      },
    },
  },
]);

export const description = style([
  ui11,
  {
    color: theme.color.textTertiary,
    selectors: {
      "&[data-disabled]": {
        color: theme.color.textDisabled,
      },
    },
  },
]);

export const fieldWrapper = style({
  display: "flex",
  alignItems: "center",
  position: "relative",
});

export const icon = style({
  position: "absolute",
  left: "8px",
  display: "flex",
  alignItems: "center",
  color: theme.color.iconSecondary,
  pointerEvents: "none",
  selectors: {
    "[data-disabled] &": {
      color: theme.color.iconDisabled,
    },
  },
});

export const field = style([
  ui11,
  {
    width: "100%",
    height: "30px",
    paddingInline: "8px",
    background: "transparent",
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.borderRadius.md,
    color: theme.color.text,
    outline: "none",
    selectors: {
      "&::placeholder": {
        color: theme.color.textTertiary,
      },
      "&:focus": {
        borderColor: theme.color.bgBrand,
        outline: `1px solid ${theme.color.bgBrand}`,
        outlineOffset: "-1px",
      },
      "&[data-invalid]": {
        borderColor: theme.color.borderDangerStrong,
      },
      "&[data-invalid]:focus": {
        borderColor: theme.color.borderDangerStrong,
        outline: `1px solid ${theme.color.borderDangerStrong}`,
      },
      "&:disabled": {
        borderColor: theme.color.borderDisabled,
        color: theme.color.textDisabled,
        cursor: "not-allowed",
      },
    },
  },
]);

export const fieldWithIcon = style({
  paddingLeft: "28px",
});

export const errorMessage = style([
  ui11,
  {
    color: theme.color.textDanger,
  },
]);
