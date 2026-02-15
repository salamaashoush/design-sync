import { theme, ui11Medium } from '@design-sync/design-tokens';
import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
});

export const list = style({
  display: 'flex',
  flexDirection: 'row',
  borderBottom: `1px solid ${theme.color.border}`,
});

export const trigger = style([
  ui11Medium,
  {
    padding: '8px 12px',
    cursor: 'default',
    border: 'none',
    background: 'transparent',
    borderBottom: '2px solid transparent',
    color: theme.color.textSecondary,
    outline: 'none',
    userSelect: 'none',
    selectors: {
      '&[data-selected]': {
        borderBottomColor: theme.color.bgBrand,
        color: theme.color.textBrand,
      },
    },
  },
]);

export const content = style({
  flex: 1,
  overflow: 'auto',
  paddingTop: '8px',
});
