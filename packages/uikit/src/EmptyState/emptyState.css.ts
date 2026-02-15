import { theme, ui11, ui12Bold } from '@design-sync/design-tokens';
import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 32,
  gap: 12,
  textAlign: 'center',
});

export const icon = style({
  color: theme.color.iconTertiary,
  fontSize: 32,
});

export const title = style([
  ui12Bold,
  {
    color: theme.color.text,
  },
]);

export const description = style([
  ui11,
  {
    color: theme.color.textSecondary,
  },
]);
