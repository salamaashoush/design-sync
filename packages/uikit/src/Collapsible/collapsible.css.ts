import { slideDown, slideUp, theme } from '@tokenize/design-tokens';
import { ui11 } from '@tokenize/design-tokens/src/typography.css';
import { style } from '@vanilla-extract/css';

export const collapsible = style({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  width: ' 100%',
  borderBottom: `1px solid ${theme.color.border}`,
  selectors: {
    '&:last-child': {
      borderBottom: '1px solid transparent',
    },
  },
});

export const collapsibleContent = style({
  overflow: 'hidden',
  width: '100%',
  color: theme.color.text,
  padding: `${theme.spacing.xxs} ${theme.spacing.xxs} ${theme.spacing.xxs} ${theme.spacing.sm}`,
  animation: `${slideUp} 100ms ease-out`,
  selectors: {
    '&[data-expanded]': {
      animation: `${slideDown} 100ms ease-out`,
      borderBottom: '1px solid transparent',
    },
  },
});

export const collapsibleHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: theme.sizing.md,
});

export const collapsibleLabel = style([
  ui11,
  {
    display: 'flex',
    alignItems: 'center',
    // gap: 8,
    flex: 1,
    height: theme.sizing.md,
    color: theme.color.text,
    paddingInlineEnd: '8px',
    cursor: 'default',
    ':focus-visible': {
      outline: `2px solid ${theme.color.bgBrandHover}`,
      outlineOffset: '2px',
    },
    ':disabled': {
      color: theme.color.textDisabled,
      cursor: 'not-allowed',
    },
    selectors: {
      '&[data-section]': {
        fontWeight: theme.fontWeight.bold,
      },
    },
  },
]);

export const collapsibleCaret = style({
  fill: theme.color.iconTertiary,
  fontSize: 16,
  fillOpacity: 0.8,
  transition: 'transform 250ms',
  selectors: {
    [`${collapsibleLabel}[data-expanded] &`]: {
      transform: 'rotate(90deg)',
    },

    [`${collapsibleLabel}:disabled &`]: {
      fillOpacity: 0.3,
    },
  },
});
