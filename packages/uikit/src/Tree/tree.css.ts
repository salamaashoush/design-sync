import { theme, ui11 } from '@design-sync/design-tokens';
import { style } from '@vanilla-extract/css';

export const root = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const node = style({
  display: 'flex',
  flexDirection: 'column',
});

export const nodeHeader = style([
  ui11,
  {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    cursor: 'default',
    borderRadius: theme.borderRadius.sm,
    userSelect: 'none',
    selectors: {
      '&:hover': {
        background: theme.color.bgHover,
      },
    },
  },
]);

export const nodeHeaderSelected = style({
  background: theme.color.bgSelected,
  color: theme.color.textSelected,
});

export const nodeToggle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '16px',
  height: '16px',
  transform: 'rotate(0deg)',
  transition: 'transform 150ms',
});

export const nodeToggleExpanded = style({
  transform: 'rotate(90deg)',
});

export const nodeChildren = style({
  paddingLeft: '16px',
});

export const nodeLabel = style({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const nodeIcon = style({
  display: 'flex',
  alignItems: 'center',
  width: '16px',
  height: '16px',
  color: theme.color.iconSecondary,
});

export const leafNode = style({
  width: '16px',
  height: '16px',
});
