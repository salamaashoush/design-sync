import { theme } from '@tokenize/design-tokens';
import { style } from '@vanilla-extract/css';

export const badgeStyle = style({
  display: 'inline-block',
  padding: theme.spacing.extraSmall,
  borderRadius: theme.borderRadius.sm,
  backgroundColor: theme.color.iconSelected,
});
