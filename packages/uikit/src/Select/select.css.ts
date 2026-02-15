import { theme, ui11 } from '@design-sync/design-tokens';
import { style } from '@vanilla-extract/css';

export const trigger = style([
  ui11,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    paddingInline: 8,
    background: 'transparent',
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.borderRadius.md,
    color: theme.color.text,
    outline: 'none',
    cursor: 'default',
    userSelect: 'none',
    selectors: {
      '&:focus': {
        borderColor: theme.color.bgBrand,
      },
      '&[data-invalid]': {
        borderColor: theme.color.borderDangerStrong,
      },
    },
  },
]);

export const value = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const icon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginLeft: 4,
  color: theme.color.iconSecondary,
});

export const content = style({
  background: theme.color.bg,
  border: `1px solid ${theme.color.border}`,
  borderRadius: theme.borderRadius.md,
  boxShadow: theme.shadows.floatingWindow,
  maxHeight: 200,
  overflowY: 'auto',
});

export const listbox = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

export const item = style([
  ui11,
  {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 8px',
    cursor: 'default',
    color: theme.color.text,
    outline: 'none',
    selectors: {
      '&[data-highlighted]': {
        background: theme.color.bgSelectedSecondary,
      },
    },
  },
]);

export const itemIndicator = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 4,
  width: 16,
  flexShrink: 0,
});

export const label = style([
  ui11,
  {
    color: theme.color.textTertiary,
    marginBottom: 4,
    userSelect: 'none',
  },
]);

export const errorMessage = style([
  ui11,
  {
    color: theme.color.textDanger,
    marginTop: 4,
  },
]);
