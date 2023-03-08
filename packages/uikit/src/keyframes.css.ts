import { keyframes } from '@vanilla-extract/css';

export const slideDown = keyframes({
  from: {
    height: 0,
  },
  to: {
    height: 'var(--kb-collapsible-content-height)',
  },
});

export const slideUp = keyframes({
  from: {
    height: 'var(--kb-collapsible-content-height)',
  },
  to: {
    height: 0,
  },
});
