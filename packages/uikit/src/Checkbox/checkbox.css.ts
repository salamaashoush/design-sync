import { theme, ui11 } from '@tokenize/design-tokens';
import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  alignItems: 'center',
});

export const control = style({
  height: 12,
  width: 12,
  borderRadius: theme.borderRadius.sm,
  border: `1px solid ${theme.color.border}`,
  backgroundColor: 'transparent',

  selectors: {
    'input:focus-visible + &': {
      outline: '2px solid hsl(200 98% 39%)',
      outlineOffset: '2px',
    },
    '&[data-checked]': {
      borderColor: theme.color.borderOnbrand,
      backgroundColor: theme.color.bgBrand,
      color: theme.color.textOnbrand,
    },
    '&[data-disabled]': {
      borderColor: theme.color.borderDisabled,
      backgroundColor: theme.color.bgDisabled,
      color: theme.color.textDisabled,
    },
  },
});

export const label = style([
  ui11,
  {
    marginLeft: '6px',
    color: 'hsl(240 6% 10%)',
    fontSize: '14px',
    userSelect: 'none',
    selectors: {
      '&[data-disabled]': {
        color: theme.color.textDisabled,
        opacity: 0.3,
      },
    },
  },
]);
