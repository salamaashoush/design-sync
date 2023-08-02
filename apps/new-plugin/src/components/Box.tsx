import { baseStyle, boxAtoms } from './box.css.ts';

import { createBox } from '@dessert-box/react';

export const Box = createBox({
  atoms: boxAtoms,
  defaultClassName: baseStyle,
});
