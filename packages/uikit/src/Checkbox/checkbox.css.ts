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
  color: theme.color.text,
  border: `1px solid ${theme.color.text}`,
  backgroundColor: 'transparent',
  selectors: {
    'input:focus-visible + &': {
      outline: `2px solid ${theme.color.bgBrand}`,
      borderColor: theme.color.bgBrand,
      outlineOffset: '-1px',
    },
    'input[data-checked]:focus-visible + &': {
      outlineOffset: '1px',
      outlineWidth: '1px',
    },
    '&[data-checked]': {
      borderColor: theme.color.bgBrand,
      backgroundColor: theme.color.bgBrand,
      color: theme.color.textOnBrand,
    },
    '&[data-disabled]': {
      borderColor: theme.color.bgDisabled,
      backgroundColor: theme.color.bgDisabled,
      color: theme.color.textDisabled,
    },
  },
});

export const label = style([
  ui11,
  {
    marginLeft: '6px',
    color: theme.color.text,
    fontSize: '14px',
    userSelect: 'none',
    selectors: {
      '&[data-disabled]': {
        color: theme.color.textDisabled,
      },
    },
  },
]);

export const indicator = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
});
