import { style } from '@vanilla-extract/css';
import { slideDown, slideUp } from '../keyframes.css';
import { vars } from '../theme.css';
import { ui11 } from '../Typography/typography.css';

export const collapsible = style({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  width: ' 100%',
  borderBottom: `1px solid ${vars.color.border}`,
  selectors: {
    '&:last-child': {
      borderBottom: '1px solid transparent',
    },
  },
});

export const collapsibleContent = style({
  color: vars.color.text,
  padding: `${vars.spacing.xxs} ${vars.spacing.xxs} ${vars.spacing.xxs} ${vars.spacing.sm}`,
  animation: `${slideUp} 100ms ease-out`,
  overflow: 'hidden',
  selectors: {
    '&[hidden]': {
      display: 'none',
    },
    '&[data-expanded]': {
      animation: `${slideDown} 100ms ease-out`,
      display: 'block',
      borderBottom: '1px solid transparent',
    },
  },
});

export const collapsibleHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: vars.sizing.md,
});

export const collapsibleLabel = style([
  ui11,
  {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    height: vars.sizing.md,
    color: vars.color.text,
    paddingInline: '8px',
    cursor: 'default',
    ':focus-visible': {
      outline: `2px solid ${vars.color.bgBrandHover}`,
      outlineOffset: '2px',
    },
    ':disabled': {
      color: vars.color.textDisabled,
      cursor: 'not-allowed',
    },
    selectors: {
      '&[data-section]': {
        fontWeight: vars.fontWeight.bold,
      },
    },
  },
]);

export const collapsibleCaret = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  color: vars.color.text,
});

export const collapsibleCaretIcon = style({
  fill: vars.color.text,
  fillOpacity: 0.8,
  selectors: {
    [`${collapsibleLabel}[data-expanded] &`]: {
      transform: 'rotate(90deg)',
    },

    [`${collapsibleLabel}:disabled &`]: {
      fillOpacity: 0.3,
    },
  },
});
