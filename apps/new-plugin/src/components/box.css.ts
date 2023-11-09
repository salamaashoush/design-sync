import { theme } from '@design-sync/design-tokens';
import { style } from '@vanilla-extract/css';
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles';

const space = theme.spacing;
const color = theme.color;

export const baseStyle = style({
  display: 'flex',
  boxSizing: 'border-box',
  width: '100%',
});

const props = defineProperties({
  properties: {
    display: ['flex', 'block', 'inline-block', 'inline-flex'],
    flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
    gap: space,
    justifyContent: ['stretch', 'flex-start', 'center', 'flex-end', 'space-around', 'space-between', 'space-evenly'],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'],
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    backgroundColor: color,
    color: color,
  },
  shorthands: {
    direction: ['flexDirection'],
    justify: ['justifyContent'],
    align: ['alignItems'],
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    placeItems: ['justifyContent', 'alignItems'],
    bg: ['backgroundColor'],
  },
});

export const boxAtoms = createSprinkles(props);
